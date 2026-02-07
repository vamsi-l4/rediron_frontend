import axios from "axios";

// ============================================
// FIX: FORCE HTTP FOR LOCALHOST (NO HTTPS)
// ============================================
// Issue: Browser was using HTTPS even for localhost
// causing SSL/protocol errors for local API
const getAPIBaseURL = () => {
  const isDev = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1';
  
  if (isDev) {
    // ALWAYS use HTTP for localhost development
    return "http://127.0.0.1:8000";
  }
  
  // Production: Use environment variable or default
  return process.env.REACT_APP_API_BASE_URL || "https://rediron-backend-1.onrender.com";
};

const API_BASE_URL = getAPIBaseURL();

// Debug mode - enabled for localhost, disabled for production
export const DEBUG = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ||
                     (process.env.REACT_APP_DEBUG === 'true') ||
                     (process.env.NODE_ENV === 'development');

export function makeAbsolute(url) {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  const base = API_BASE_URL.replace(/\/$/, "");
  // Ensure no double slashes in the URL
  const cleanUrl = url.startsWith("/") ? url : "/" + url;
  return base + cleanUrl;
}

// ============================================
// CLERK TOKEN MANAGEMENT - UPDATED APPROACH
// ============================================
// Instead of storing a global getToken, we'll try to get the token
// from the request interceptor every time (with caching for performance)
let clerkGetTokenFn = null;
let clerkTokenCache = null;
let clerkTokenCacheTime = 0;
const CLERK_TOKEN_CACHE_MS = 30000; // Cache for 30 seconds

export const setClerkGetToken = (getTokenFn) => {
  console.log('[API] setClerkGetToken called with:', typeof getTokenFn);
  clerkGetTokenFn = getTokenFn;
};

const getClerkTokenWithCache = async () => {
  // Return cached token if still valid
  if (clerkTokenCache && Date.now() - clerkTokenCacheTime < CLERK_TOKEN_CACHE_MS) {
    return clerkTokenCache;
  }

  if (!clerkGetTokenFn) {
    return null;
  }

  try {
    // ============================================
    // FIX: Get token without template (Clerk default)
    // ============================================
    // Do NOT use { template: 'integration_jwt' }
    // Your Clerk setup uses the default token format
    let token;
    try {
      // Get Clerk's default JWT token
      token = await clerkGetTokenFn();
    } catch (err) {
      console.error('[API] Failed to get Clerk token:', err.message);
      return null;
    }
    
    if (token) {
      clerkTokenCache = token;
      clerkTokenCacheTime = Date.now();
    }
    return token;
  } catch (error) {
    if (DEBUG) {
      console.error('[API] Error getting Clerk token:', error.message);
    }
    return null;
  }
};

// Retry configuration
const RETRY_CONFIG = {  
  maxRetries: 3,
  retryDelay: 1000, // Initial delay in ms
  retryCondition: (error) => {
    // ============================================
    // CRITICAL: Don't retry SSL/protocol errors
    // ============================================
    // These are permanent errors, not transient failures
    const errorMessage = error.message || '';
    const errorCode = error.code || '';
    
    if (
      errorMessage.includes('SSL') || 
      errorMessage.includes('protocol') || 
      errorMessage.includes('ERR_SSL') ||
      errorCode.includes('ERR_SSL') ||
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('ENOTFOUND')
    ) {
      console.warn(`[API] Not retrying fatal error: ${errorMessage}`);
      return false;
    }
    
    return (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600)
    );
  },
};

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  // Removed withCredentials to avoid CSRF cookie issues since JWT is used in Authorization header
  // withCredentials: true,
});

API.interceptors.request.use(
  async (config) => {
  // Skip adding Authorization header for public endpoints
  const publicEndpoints = [
    "/api/nutrition-list/",
    "/api/accounts/login/",
    "/api/accounts/signup/",
    "/api/accounts/verify-otp/",
    "/api/accounts/refresh/",
    "/api/shop-categories/",
    "/api/muscle-groups/",
    "/api/workouts/",
    "/api/equipment/",
    "/api/exercises/",
    "/api/shop-products/"];
    const isPublic = publicEndpoints.some(endpoint => config.url.includes(endpoint));
    
    if (DEBUG) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        isPublic,
        hasClerkGetTokenFn: !!clerkGetTokenFn,
        url: config.url
      });
    }
    
    if (!isPublic) {
      // Get Clerk token with caching
      const clerkToken = await getClerkTokenWithCache();
      
      if (clerkToken) {
        config.headers.Authorization = `Bearer ${clerkToken}`;
        if (DEBUG) {
          console.log(`[API] ✅ Attached Clerk token to ${config.url}. Token: ${clerkToken.substring(0, 30)}...`);
        }
      } else {
        if (DEBUG) {
          console.warn(`[API] ⚠️ No Clerk token available for authenticated endpoint: ${config.url}`);
        }
      }
    } else if (isPublic && DEBUG) {
      console.log(`[API] Skipping auth for public endpoint: ${config.url}`);
    }

    // Debug logging
    if (DEBUG) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        hasAuth: !!config.headers.Authorization,
        data: config.data,
        params: config.params
      });
    }

    return config;
  },
  (error) => {
    if (DEBUG) {
      console.error("[API Request Error]", error);
    }
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    // Debug logging for successful responses
    if (DEBUG) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
        headers: response.headers
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ============================================
    // HANDLE 401 ONLY - MISSING TOKEN
    // ============================================
    // DO NOT redirect on 403 - let component handle it
    // Only handle 401 (missing token) by rejecting
    if (error.response?.status === 401 && !originalRequest._noRetry) {
      originalRequest._noRetry = true;
      console.error(`[API] 401 Unauthorized on ${originalRequest.url}`);
      
      // Clear any cached tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      // Just reject - don't redirect (causes loops)
      return Promise.reject(error);
    }

    // Retry logic for network errors or 5xx server errors (NOT 4xx)
    if (RETRY_CONFIG.retryCondition(error) && !originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }

    if (originalRequest._retryCount < RETRY_CONFIG.maxRetries) {
      originalRequest._retryCount += 1;
      const delay = RETRY_CONFIG.retryDelay * Math.pow(2, originalRequest._retryCount - 1); // Exponential backoff
      console.warn(`Retrying request (${originalRequest._retryCount}/${RETRY_CONFIG.maxRetries}) after ${delay}ms:`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay));
      return API(originalRequest);
    }

    // Enhanced error logging
    if (error.response) {
      console.error(`API Error [${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.message);
    } else {
      console.error("Request Error:", error.message);
    }

    // Debug logging for errors
    if (DEBUG) {
      console.error("[API Response Error]", {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }

    return Promise.reject(error);
  }
);

export default API;
