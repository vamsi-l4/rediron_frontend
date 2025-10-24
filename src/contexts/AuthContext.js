import React, { createContext, useState, useEffect, useCallback } from "react";
import API from "../components/Api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getToken = () => localStorage.getItem("accessToken");
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());
  // eslint-disable-next-line no-unused-vars
  const [refreshLoading, setRefreshLoading] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    window.location.href = "/login";
  }, []);

  const refreshToken = useCallback(async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) {
      logout();
      return null;
    }
    setRefreshLoading(true);
    try {
      const response = await API.post('/api/accounts/refresh/', { refresh });
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.access);
        setIsAuthenticated(true);
        setRefreshLoading(false);
        return response.data.access;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return null;
    } finally {
      setRefreshLoading(false);
    }
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
