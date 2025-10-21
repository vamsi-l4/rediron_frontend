import React, { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getToken = () => localStorage.getItem("accessToken");
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());

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
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";
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
        return data.access;
      } else {
        logout();
        return null;
      }
    } catch (error) {
      logout();
      return null;
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
