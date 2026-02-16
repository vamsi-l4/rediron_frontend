/**
 * ============================================
 * PRODUCTION-GRADE: PROFILE INITIALIZATION
 * ============================================
 * Initializes user profile after successful Clerk authentication.
 * Called once per login session when Clerk sets isSignedIn=true.
 * 
 * RESPONSIBILITY:
 * 1. Verify Clerk authentication status
 * 2. Initialize backend UserProfile via POST /api/accounts/initialize-profile/
 * 3. Cache profile data in UserDataContext
 * 4. Handle profile completion percentage
 * 5. Trigger UI prompts for incomplete profiles
 */

import { useAuth } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import API from "../components/Api";

const useProfileInitializer = () => {
  const { isSignedIn, sessionId } = useAuth();
  const hasInitialized = useRef(false);
  
  useEffect(() => {
    const initializeProfile = async () => {
      // ============================================
      // STEP 1: CHECK CLERK AUTHENTICATION
      // ============================================
      if (!isSignedIn) {
        console.log("[ProfileInit] User not signed in, skipping initialization");
        return;
      }
      
      // ============================================
      // STEP 2: PREVENT DUPLICATE INITIALIZATION
      // ============================================
      // Use session ID as key to track initialization per session
      const initSessionKey = `profile_init_${sessionId}`;
      const alreadyInitialized = sessionStorage.getItem(initSessionKey);
      
      if (alreadyInitialized && hasInitialized.current) {
        console.log("[ProfileInit] ✅ Profile already initialized in this session");
        return;
      }
      
      try {
        console.log("[ProfileInit] Starting profile initialization...");
        
        // ============================================
        // STEP 3: CALL BACKEND INITIALIZATION ENDPOINT
        // ============================================
        // This endpoint creates UserProfile if needed and returns profile data
        const response = await API.post("/api/accounts/initialize-profile/");
        
        const { success, profile, message } = response.data;
        
        if (!success) {
          console.error("[ProfileInit] ❌ Server returned error:", message);
          return;
        }
        
        console.log("[ProfileInit] ✅ Profile initialized:", profile);
        
        // ============================================
        // STEP 4: CACHE IN SESSION STORAGE
        // ============================================
        // Mark as initialized within this browser session
        sessionStorage.setItem(initSessionKey, "true");
        sessionStorage.setItem("userProfile", JSON.stringify(profile));
        hasInitialized.current = true;
        
        // ============================================
        // STEP 5: TRIGGER PROFILE COMPLETION CHECK
        // ============================================
        // If profile is incomplete, UI can show onboarding
        if (profile.completion_percentage < 100) {
          console.warn(
            `[ProfileInit] ⚠️ Profile ${profile.completion_percentage}% complete. ` +
            `User should complete profile for better experience.`
          );
          // Trigger optional: Show profile completion prompt
          sessionStorage.setItem("showProfileCompletion", "true");
        }
        
      } catch (error) {
        if (error.response?.status === 401) {
          console.warn("[ProfileInit] ⚠️ Unauthorized - token may have expired");
          hasInitialized.current = false;
        } else {
          console.error("[ProfileInit] ❌ Profile initialization failed:", error.message);
        }
      }
    };
    
    // Debounce initialization to avoid multiple calls
    const timer = setTimeout(() => {
      initializeProfile();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isSignedIn, sessionId]);
};

export default useProfileInitializer;
