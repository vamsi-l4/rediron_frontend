import axios from "axios";

const API_BASE_URL = window.location.hostname === 'localhost' ? "http://127.0.0.1:8000" : (process.env.REACT_APP_API_BASE_URL || "https://rediron-backend-1.onrender.com");

export function makeAbsolute(url) {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  const base = API_BASE_URL.replace(/\/$/, "");
  return url.startsWith("/") ? base + url : base + "/" + url;
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // Initial delay in ms
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
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
  (config) => {
  // Skip adding Authorization header for public endpoints
  const publicEndpoints = ["/api/nutrition-list/", "/api/accounts/login/", "/api/accounts/signup/", "/api/accounts/verify-otp/", "/api/accounts/refresh/"];
    const isPublic = publicEndpoints.some(endpoint => config.url.includes(endpoint));
    if (!isPublic) {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refreshToken");
        if (refresh) {
          const response = await axios.post(
            `${API_BASE_URL}/api/accounts/refresh/`,
            { refresh },
            { headers: { "Content-Type": "application/json" } }
          );

          if (response.status === 200) {
            localStorage.setItem("accessToken", response.data.access);
            API.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
            originalRequest.headers["Authorization"] = `Bearer ${response.data.access}`;
            return API(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Retry logic for network errors or 5xx server errors
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

    return Promise.reject(error);
  }
);

export default API;
