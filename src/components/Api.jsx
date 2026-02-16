import axios from "axios";

/**
 * ============================================
 * API CONFIGURATION - CLERK AUTHENTICATION
 * ============================================
 * 
 * CLERK-ONLY APPROACH:
 * - Token managed by Clerk via useAuth().getToken()
 * - No localStorage token storage
 * - No manual JWT refresh logic
 * - Token caching for performance (30-second TTL)
 * 
 * BACKEND INTEGRATION:
 * - Send Clerk JWT in Authorization header
 * - Backend verifies token with Clerk's public key
 * - NO password storage in backend
 * - Backend stores only: clerk_user_id, email, name
 * 
 * ============================================
 * OLD JWT AUTHENTICATION (COMMENTED FOR REFERENCE)
 * ============================================
 * 
 * DEPRECATED ENDPOINTS (DO NOT USE):
 * - /api/accounts/login/ (now handled by Clerk)
 * - /api/accounts/signup/ (now handled by Clerk)
 * - /api/accounts/verify-otp/ (removed - login is email+password only)
 * - /api/accounts/refresh/ (Clerk handles token refresh)
 * 
 * OLD CODE:
 * // localStorage.setItem('accessToken', response.data.access);
 * // localStorage.setItem('refreshToken', response.data.refresh);
 * // const token = localStorage.getItem('accessToken');
 * 
 * REPLACED BY:
 * // const token = await getToken(); // From Clerk
 */

// ============================================
// BASE URL CONFIGURATION
// ============================================
const getAPIBaseURL = () => {
  const isDev = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1';
  
  if (isDev) {
    // Development: HTTP for localhost
    return "http://127.0.0.1:8000";
  }
  
  // Production: Use environment or default
  return process.env.REACT_APP_API_BASE_URL || "https://rediron-backend-1.onrender.com";
};

const API_BASE_URL = getAPIBaseURL();

// Debug mode
export const DEBUG = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ||
                     (process.env.REACT_APP_DEBUG === 'true') ||
                     (process.env.NODE_ENV === 'development');

export function makeAbsolute(url) {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  const base = API_BASE_URL.replace(/\/$/, "");
  const cleanUrl = url.startsWith("/") ? url : "/" + url;
  return base + cleanUrl;
}

// ============================================
// CLERK TOKEN MANAGEMENT
// ============================================
// Global reference to Clerk's getToken function
// Set by TokenInitializer in App.js when user signs in
let clerkGetTokenFn = null;
let clerkTokenCache = null;
let clerkTokenCacheTime = 0;
const CLERK_TOKEN_CACHE_MS = 30000; // Cache tokens for 30 seconds

export const setClerkGetToken = (getTokenFn) => {
  console.log('[API] Clerk getToken function registered');
  clerkGetTokenFn = getTokenFn;
};

const getClerkTokenWithCache = async () => {
  // Return cached token if still valid
  if (clerkTokenCache && Date.now() - clerkTokenCacheTime < CLERK_TOKEN_CACHE_MS) {
    return clerkTokenCache;
  }

  if (!clerkGetTokenFn) {
    if (DEBUG) console.warn('[API] No Clerk token function available');
    return null;
  }

  try {
    // Get token from Clerk (no template parameter - use standard JWT)
    const token = await clerkGetTokenFn();
    
    if (token) {
      clerkTokenCache = token;
      clerkTokenCacheTime = Date.now();
      return token;
    } else {
      if (DEBUG) console.warn('[API] Clerk getToken() returned null');
      return null;
    }
  } catch (error) {
    if (DEBUG) console.error('[API] Error getting Clerk token:', error.message);
    clerkTokenCache = null;
    clerkTokenCacheTime = 0;
    return null;
  }
};

// ============================================
// RETRY CONFIGURATION
// ============================================
const RETRY_CONFIG = {  
  maxRetries: 3,
  retryDelay: 1000,
  retryCondition: (error) => {
    const errorMessage = error.message || '';
    const errorCode = error.code || '';
    
    // Don't retry permanent errors
    if (
      errorMessage.includes('SSL') || 
      errorMessage.includes('protocol') || 
      errorMessage.includes('ERR_SSL') ||
      errorCode.includes('ERR_SSL') ||
      errorMessage.includes('ECONNREFUSED') ||
      errorMessage.includes('ENOTFOUND')
    ) {
      return false;
    }
    
    // Retry network errors or 5xx server errors
    return (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600)
    );
  },
};

const API = axios.create({
  baseURL: API_BASE_URL,
});

// ============================================
// REQUEST INTERCEPTOR: Add Clerk token
// ============================================
API.interceptors.request.use(
  async (config) => {
    // Public endpoints that don't need authentication
    const publicEndpoints = [
      "/api/nutrition-list/",
      "/api/shop-categories/",
      "/api/muscle-groups/",
      "/api/workouts/",
      "/api/equipment/",
      "/api/exercises/",
      "/api/shop-products/",
      // Note: /api/accounts/login, /signup, /verify-otp, /refresh are no longer used
      // Clerk handles all authentication
    ];
    
    const isPublic = publicEndpoints.some(endpoint => config.url.includes(endpoint));
    
    if (DEBUG) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url} (isPublic: ${isPublic})`);
    }
    
    // Add Clerk token to protected endpoints
    if (!isPublic) {
      const clerkToken = await getClerkTokenWithCache();
      
      if (clerkToken) {
        config.headers.Authorization = `Bearer ${clerkToken}`;
        if (DEBUG) {
          console.log(`[API] ✅ Token attached to ${config.url}`);
        }
      } else {
        if (DEBUG) {
          console.warn(`[API] ⚠️ No token for authenticated endpoint: ${config.url}`);
        }
      }
    }

    if (DEBUG) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, { 
        hasAuth: !!config.headers.Authorization 
      });
    }

    return config;
  },
  (error) => {
    if (DEBUG) console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR: Handle errors
// ============================================
API.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} (${response.status})`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ============================================
    // ERROR HANDLING
    // ============================================
    // 401: Unauthorized - Clerk session has expired or token is invalid
    // Let the component handle this (ProtectedRoute will redirect)
    if (error.response?.status === 401 && !originalRequest._noRetry) {
      originalRequest._noRetry = true;
      console.error(`[API] 401 Unauthorized on ${originalRequest.url}`);
      // Clerk will handle session cleanup, just reject
      return Promise.reject(error);
    }

    // Retry logic for transient errors (5xx, network errors)
    if (RETRY_CONFIG.retryCondition(error) && !originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }

    if (originalRequest._retryCount < RETRY_CONFIG.maxRetries) {
      originalRequest._retryCount += 1;
      const delay = RETRY_CONFIG.retryDelay * Math.pow(2, originalRequest._retryCount - 1);
      console.warn(`[API] Retrying (${originalRequest._retryCount}/${RETRY_CONFIG.maxRetries}) after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return API(originalRequest);
    }

    if (DEBUG) {
      console.error("[API Error]", {
        url: originalRequest?.url,
        status: error.response?.status,
        message: error.message
      });
    }

    return Promise.reject(error);
  }
);

export default API;
