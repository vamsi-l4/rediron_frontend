import axios from "axios";

const getAPIBaseURL = () => {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }

  const isDev = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1';
  
  if (isDev) {
    return "http://127.0.0.1:8000";
  }
  
  return process.env.REACT_APP_API_BASE_URL || "https://rediron-backend-1.onrender.com";
};

const API_BASE_URL = getAPIBaseURL();

export const DEBUG = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ||
                     (process.env.REACT_APP_DEBUG === 'true') ||
                     (process.env.NODE_ENV === 'development');

export function makeAbsolute(url) {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("//") || url.startsWith("data:") || url.startsWith("blob:")) return url;
  const base = API_BASE_URL.replace(/\/$/, "");
  const cleanUrl = url.startsWith("/") ? url : "/" + url;
  return base + cleanUrl;
}

let clerkGetTokenFn = null;
let clerkTokenCache = null;
let clerkTokenCacheTime = 0;
let clerkUserInfo = null;
const CLERK_TOKEN_CACHE_MS = 15000;

export const setClerkGetToken = (getTokenFn) => {
  if (!getTokenFn || typeof getTokenFn !== 'function') {
    clerkGetTokenFn = null;
    clerkTokenCache = null;
    clerkTokenCacheTime = 0;
    return;
  }
  clerkGetTokenFn = getTokenFn;
  clerkTokenCache = null;
  clerkTokenCacheTime = 0;
};

export const setClerkUserInfo = (userInfo) => {
  if (!userInfo) {
    clerkUserInfo = null;
    return;
  }
  clerkUserInfo = {
    email: userInfo.email || "",
    name: userInfo.name || "",
  };
};

const getClerkTokenWithCache = async ({ forceRefresh = false } = {}) => {
  if (!forceRefresh && clerkTokenCache && Date.now() - clerkTokenCacheTime < CLERK_TOKEN_CACHE_MS) {
    return clerkTokenCache;
  }

  if (!clerkGetTokenFn) {
    if (DEBUG) console.warn('[API] No Clerk token function available');
    return null;
  }

  try {
    const token = await clerkGetTokenFn(forceRefresh ? { skipCache: true } : undefined);
    
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

const clearClerkTokenCache = () => {
  clerkTokenCache = null;
  clerkTokenCacheTime = 0;
};

const isAuthRefreshableError = (error) => {
  const status = error.response?.status;
  if (status !== 401 && status !== 403) return false;

  const responseData = error.response?.data;
  const responseText = typeof responseData === "string"
    ? responseData
    : JSON.stringify(responseData || {});
  const message = `${error.message || ""} ${responseText}`.toLowerCase();

  return (
    status === 401 ||
    message.includes("expired") ||
    message.includes("expiredsignatureerror") ||
    message.includes("invalid clerk token") ||
    message.includes("clerk token expired") ||
    message.includes("invalid token") ||
    message.includes("authentication service")
  );
};

export const getFriendlyApiErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  if (isAuthRefreshableError(error)) {
    return "Unable to submit. Please refresh your session.";
  }
  const data = error.response?.data;
  if (typeof data === "string") return data;
  return data?.message || data?.error || data?.detail || fallback;
};

const RETRY_CONFIG = {  
  maxRetries: 3,
  retryDelay: 1000,
  retryCondition: (error) => {
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
});

API.interceptors.request.use(
  async (config) => {
    const publicEndpoints = [
      "/api/nutrition-list/",
      "/api/nutrition/",
      "/api/fitness-articles/",
      "/api/workout-tips/",
      "/api/workout-articles/",
      "/api/shop-categories/",
      "/api/muscle-groups/",
      "/api/equipment/",
      "/api/exercises/",
      "/api/shop-products/",
    ];
    
    const isPublic = publicEndpoints.some(endpoint => config.url.includes(endpoint));

    if (!isPublic) {
      const clerkToken = await getClerkTokenWithCache();
      
      if (clerkToken) {
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${clerkToken}`,
        };
      } else {
        if (DEBUG) {
          console.warn(`[API] ⚠️ No token for authenticated endpoint: ${config.url}`);
        }
      }
    }

    if (clerkUserInfo?.email || clerkUserInfo?.name) {
      config.headers = {
        ...(config.headers || {}),
        ...(clerkUserInfo.email ? { "X-Clerk-Email": clerkUserInfo.email } : {}),
        ...(clerkUserInfo.name ? { "X-Clerk-Name": clerkUserInfo.name } : {}),
      };
    }

    return config;
  },
  (error) => {
    if (DEBUG) console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest && isAuthRefreshableError(error) && !originalRequest._authRetry) {
      originalRequest._authRetry = true;
      clearClerkTokenCache();

      const freshToken = await getClerkTokenWithCache({ forceRefresh: true });
      if (freshToken) {
        originalRequest.headers = {
          ...(originalRequest.headers || {}),
          Authorization: `Bearer ${freshToken}`,
        };
        return API(originalRequest);
      }

      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.sessionStorage.setItem("rediron_auth_redirect", window.location.pathname + window.location.search);
        window.location.assign("/login");
      }
    }

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
