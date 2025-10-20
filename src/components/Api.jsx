import axios from "axios";

export function makeAbsolute(url) {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("//")) return url;
  const base = "http://127.0.0.1:8000".replace(/\/$/, "");
  return url.startsWith("/") ? base + url : base + "/" + url;
}

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
  // Removed withCredentials to avoid CSRF cookie issues since JWT is used in Authorization header
  // withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    // Skip adding Authorization header for public endpoints
    const publicEndpoints = ["/api/nutrition-list/"];
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refreshToken");
        if (refresh) {
          const response = await axios.post(
            "http://127.0.0.1:8000/api/accounts/refresh/",
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
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
