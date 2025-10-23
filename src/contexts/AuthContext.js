import React, { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getToken = () => localStorage.getItem("accessToken");
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());
  const [refreshLoading, setRefreshLoading] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setRefreshLoading(false);
    window.location.href = "/login";
  }, []);

  const refreshToken = useCallback(async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) {
      logout();
      return null;
    }
    setRefreshLoading(true);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://rediron-backend-1.onrender.com";
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/accounts/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("accessToken", data.access);
          setIsAuthenticated(true);
          setRefreshLoading(false);
          return data.access;
        } else if (response.status >= 500) {
          // Retry on server errors
          retryCount++;
          if (retryCount < maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        // Non-retryable error
        console.error(`Token refresh failed with status ${response.status}`);
        logout();
        return null;
      } catch (error) {
        retryCount++;
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000;
          console.warn(`Token refresh network error, retrying in ${delay}ms:`, error.message);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.error("Token refresh failed after retries:", error);
          logout();
          return null;
        }
      }
    }
    setRefreshLoading(false);
    return null;
  }, [logout]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        // Try to refresh the token to ensure it's valid
        const newToken = await refreshToken();
        if (newToken) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [refreshToken]);

  const login = (accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};
