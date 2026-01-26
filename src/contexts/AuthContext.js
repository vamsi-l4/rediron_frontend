import React, { createContext, useState, useEffect, useCallback } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";
// import API from "../components/Api"; // COMMENTED OUT: Old JWT refresh logic - replaced with Clerk
import { clearClerkUserInfo } from "../utils/clerkAuth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isSignedIn, getToken } = useAuth();
  const { signOut } = useClerk();
  // CLERK INTEGRATION: Use Clerk's isSignedIn instead of localStorage tokens
  const [isAuthenticated, setIsAuthenticated] = useState(isSignedIn || false);
  // eslint-disable-next-line no-unused-vars
  const [refreshLoading, setRefreshLoading] = useState(false);

  // Update authentication state when Clerk's isSignedIn changes
  useEffect(() => {
    setIsAuthenticated(isSignedIn || false);
  }, [isSignedIn]);

  const logout = useCallback(async () => {
    // ============================================
    // CLERK LOGOUT (NEW)
    // ============================================
    // Sign out from Clerk and clear local state
    try {
      await signOut();
      clearClerkUserInfo();
      setIsAuthenticated(false);
      window.location.href = "/login";
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback: clear local state even if Clerk signOut fails
      clearClerkUserInfo();
      setIsAuthenticated(false);
      window.location.href = "/login";
    }
  }, [signOut]);

  // COMMENTED OUT: Old refresh token logic (no longer needed with Clerk)
  /*
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
  */

  // Get Clerk token for API requests
  const getClerkToken = useCallback(async () => {
    try {
      if (!getToken) return null;
      const token = await getToken({ template: 'integration_jwt' });
      return token;
    } catch (error) {
      console.error('Error getting Clerk token:', error);
      return null;
    }
  }, [getToken]);

  // COMMENTED OUT: Old localStorage-based auth check
  /*
  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      setIsAuthenticated(!!token);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);
  */

  const login = useCallback((userData = {}) => {
    // ============================================
    // CLERK LOGIN (NEW)
    // ============================================
    // Clerk handles session automatically after successful sign-in
    // This function is kept for compatibility but not strictly needed
    setIsAuthenticated(true);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      // refreshToken, // COMMENTED OUT: No longer needed
      getClerkToken, // NEW: Get Clerk token for API requests
    }}>
      {children}
    </AuthContext.Provider>
  );
};

