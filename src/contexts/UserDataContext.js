  import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import API from "../components/Api";
import { AuthContext } from "./AuthContext";

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { isSignedIn, isLoaded } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  const fetchUserData = useCallback(async () => {
    // ============================================
    // GUARD 1: ONLY FETCH IF TRULY AUTHENTICATED
    // ============================================
    // Check ALL three conditions:
    // 1. Clerk is loaded and ready
    // 2. Clerk says user is signed in
    // 3. Our context says authenticated
    // This prevents calls to profile when Clerk is still initializing
    console.log('[UserDataContext] fetchUserData check:', { isLoaded, isSignedIn, isAuthenticated, hasAttemptedFetch });
    
    if (!isLoaded || !isSignedIn || !isAuthenticated) {
      console.log('[UserDataContext] ⚠️ Skipping fetch: not ready', { isLoaded, isSignedIn, isAuthenticated });
      setUserData(null);
      setHasAttemptedFetch(true);
      return;
    }

    // ============================================
    // GUARD 2: ONLY FETCH ONCE PER AUTH SESSION
    // ============================================
    // Prevent infinite retry loops by only fetching once initially
    // If you need to refresh, call refetchUserData() explicitly
    if (hasAttemptedFetch) {
      console.log('[UserDataContext] ⚠️ Already attempted fetch, skipping');
      return;
    }

    console.log('[UserDataContext] 🚀 Starting fetch of profile data');
    setLoading(true);
    setError(null);

    try {
      const response = await API.get("/api/accounts/profile/");
      console.log('[UserDataContext] ✅ Profile fetched successfully:', response.data);
      setUserData(response.data);
      setHasAttemptedFetch(true);
    } catch (err) {
      console.error('[UserDataContext] ❌ Error fetching profile:', err.response?.status, err.message);
      // Differentiate error types
      if (!err.response) {
        // Check for SSL protocol errors specifically
        if (err.message && (err.message.includes('SSL') || err.message.includes('protocol') || err.message.includes('ERR_SSL'))) {
          setError("Connection error: Protocol mismatch. Please check server configuration.");
        } else {
          setError("Network error: Unable to connect to server. Please check your connection.");
        }
      } else if (err.response.status === 401) {
        setError("Authentication error: Please log in again.");
        logout(); // Also logout on 401
      } else if (err.response.status === 403) {
        // ============================================
        // 403 FORBIDDEN ON PROFILE - CHECK IF NEW USER
        // ============================================
        // For new users, profile doesn't exist yet. Try to create it.
        console.log('[UserDataContext] 403 on profile - attempting to create profile for new user');
        try {
          const createResponse = await API.post("/api/accounts/profile/create/", {});
          if (createResponse.status === 201) {
            // Profile created successfully, now fetch it
            const profileResponse = await API.get("/api/accounts/profile/");
            console.log('[UserDataContext] ✅ Profile created and loaded:', profileResponse.data);
            setUserData(profileResponse.data);
            setHasAttemptedFetch(true);
            return;
          }
        } catch (createErr) {
          console.error('[UserDataContext] ❌ Failed to create profile:', createErr.response?.status, createErr.message);
          // If profile creation fails, this might be a real auth issue
          if (createErr.response?.status === 403) {
            setError("Authentication error: Session mismatch. Please log in again.");
            logout();
          } else {
            setError("Failed to create user profile. Please try again later.");
          }
        }
      } else if (err.response.status >= 500) {
        setError("Server error: Service temporarily unavailable. Please try again later.");
      } else {
        setError(`Failed to load user data: ${err.response.data?.detail || err.message}`);
      }
      setHasAttemptedFetch(true);
    } finally {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, isAuthenticated, hasAttemptedFetch, logout]);

  // ============================================
  // FETCH USER DATA WHEN AUTHENTICATION CHANGES
  // ============================================
  useEffect(() => {
    // Reset fetch attempt when auth status changes (login/logout)
    // Include isLoaded and isSignedIn so we wait for Clerk to fully initialize
    setHasAttemptedFetch(false);
  }, [isLoaded, isSignedIn, isAuthenticated]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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
