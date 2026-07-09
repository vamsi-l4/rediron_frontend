import { useAuth } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import API from "../components/Api";

const useProfileInitializer = () => {
  const { isSignedIn, sessionId } = useAuth();
  const hasInitialized = useRef(false);
  
  useEffect(() => {
    const initializeProfile = async () => {
      if (!isSignedIn) {
        return;
      }
      
      const initSessionKey = `profile_init_${sessionId}`;
      const alreadyInitialized = sessionStorage.getItem(initSessionKey);
      
      if (alreadyInitialized && hasInitialized.current) {
        return;
      }
      
      try {
        const response = await API.post("/api/accounts/initialize-profile/");
        
        const { success, profile, message } = response.data;
        
        if (!success) {
          console.error("[ProfileInit] ❌ Server returned error:", message);
          return;
        }
        
        sessionStorage.setItem(initSessionKey, "true");
        sessionStorage.setItem("userProfile", JSON.stringify(profile));
        hasInitialized.current = true;
        
        if (profile.completion_percentage < 100) {
          console.warn(
            `[ProfileInit] ⚠️ Profile ${profile.completion_percentage}% complete. ` +
            `User should complete profile for better experience.`
          );
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
    
    const timer = setTimeout(() => {
      initializeProfile();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isSignedIn, sessionId]);
};

export default useProfileInitializer;
