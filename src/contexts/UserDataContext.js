import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import API from "../components/Api";
import { AuthContext } from "./AuthContext";

export const UserDataContext = createContext();

/**
 * ============================================
 * USER DATA CONTEXT - PROFILE MANAGEMENT
 * ============================================
 * 
 * PURPOSE:
 * - Fetch and cache user profile data
 * - Update profile information
 * - Prevent infinite useEffect loops
 * 
 * GUARDS AGAINST INFINITE LOOPS:
 * 1. hasAttemptedFetch: Fetch only once per session
 * 2. isLoaded: Wait for Clerk initialization
 * 3. isSignedIn: Ensure user is authenticated
 * 4. useRef: Track logout to prevent repeated calls
 * 
 * NO infinite re-renders - careful dependency management
 * NO logout function in dependencies - use ref instead
 * NO password storage - backend has no passwords
 */

export const UserDataProvider = ({ children }) => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { isSignedIn, isLoaded } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const logoutCalled = useRef(false); // Track if we've already called logout

  const fetchUserData = useCallback(async () => {
    // ============================================
    // GUARD 1: Wait for Clerk to initialize
    // ============================================
    if (!isLoaded) {
      console.log('[UserDataContext] Waiting for Clerk to load...');
      return;
    }

    // ============================================
    // GUARD 2: Only fetch if user is signed in
    // ============================================
    if (!isSignedIn || !isAuthenticated) {
      console.log('[UserDataContext] Not signed in, skipping profile fetch');
      setUserData(null);
      setHasAttemptedFetch(true);
      setLoading(false);
      return;
    }

    // ============================================
    // GUARD 3: Only fetch once per session
    // ============================================
    if (hasAttemptedFetch) {
      console.log('[UserDataContext] Profile already fetched this session');
      setLoading(false);
      return;
    }

    console.log('[UserDataContext] Fetching user profile...');
    setLoading(true);
    setError(null);

    try {
      const response = await API.get("/api/accounts/profile/");
      console.log('[UserDataContext] ✅ Profile fetched successfully');
      setUserData(response.data);
      setHasAttemptedFetch(true);
      setLoading(false);
      
    } catch (err) {
      const status = err.response?.status;
      const message = err.message;

      console.error('[UserDataContext] Profile fetch error:', status, message);

      if (!err.response) {
        // Network error
        setError("Network error: Unable to connect to server.");
      } else if (status === 401) {
        // Unauthorized - session expired
        setError("Session expired. Please log in again.");
        if (!logoutCalled.current) {
          logoutCalled.current = true;
          logout();
        }
      } else if (status === 403) {
        // Forbidden - profile doesn't exist yet (new user)
        // Try to create it
        console.log('[UserDataContext] Creating new user profile...');
        try {
          await API.post("/api/accounts/profile/create/", {});
          // Retry fetch
          const retryResponse = await API.get("/api/accounts/profile/");
          setUserData(retryResponse.data);
          setHasAttemptedFetch(true);
        } catch (createErr) {
          console.error('[UserDataContext] Failed to create profile:', createErr.message);
          if (createErr.response?.status === 403 && !logoutCalled.current) {
            logoutCalled.current = true;
            logout();
          }
          setError("Failed to load user profile.");
        }
      } else if (status >= 500) {
        setError("Server error: Service temporarily unavailable.");
      } else {
        setError("Failed to load user profile.");
      }

      setHasAttemptedFetch(true);
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, isAuthenticated, hasAttemptedFetch, logout]);

  // ============================================
  // TRIGGER PROFILE FETCH WHEN AUTH CHANGES
  // ============================================
  useEffect(() => {
    // Reset fetch flag when auth status changes
    setHasAttemptedFetch(false);
    logoutCalled.current = false;
  }, [isSignedIn, isAuthenticated]);

  // ============================================
  // FETCH PROFILE WHEN READY
  // ============================================
  useEffect(() => {
    if (isLoaded && isSignedIn && isAuthenticated && !hasAttemptedFetch) {
      fetchUserData();
    }
  }, [isLoaded, isSignedIn, isAuthenticated, hasAttemptedFetch, fetchUserData]);

  const updateUserData = async (newData) => {
    setLoading(true);
    setError(null);
    try {
      // ============================================
      // FIX: PROPERLY UPDATE PROFILE
      // ============================================
      // Use PATCH with multipart/form-data for image uploads
      const response = await API.patch("/api/accounts/profile-manage/", newData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // Update local state with response data
      if (response.data) {
        setUserData(response.data);
        console.log('[UserDataContext] ✅ Profile updated successfully:', response.data);
      }
      
      return response.data; // Return data for frontend to show success message
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to update user data.";
      console.error('[UserDataContext] ❌ Profile update failed:', errorMsg);
      setError(errorMsg);
      throw err; // Re-throw so component can handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserDataContext.Provider value={{ userData, loading, error, updateUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};
