import React, { createContext, useState, useEffect, useCallback } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";

export const AuthContext = createContext();

/**
 * ============================================
 * AUTHENTICATION CONTEXT - CLERK ONLY
 * ============================================
 * 
 * CLERK INTEGRATION:
 * - Uses Clerk's useAuth() hook for authentication state
 * - isSignedIn determines if user is authenticated
 * - getToken() provides JWT for backend API calls
 * - signOut() handles session cleanup
 * 
 * NO localStorage usage
 * NO manual token management
 * NO template tokens - Clerk provides standard JWT
 * 
 * ============================================
 * OLD JWT AUTHENTICATION (COMMENTED FOR REFERENCE)
 * ============================================
 * 
 * DEPRECATED APPROACH (DO NOT USE):
 * - Stored tokens in localStorage
 * - Manual refresh logic with refresh tokens
 * - Backend issued and managed tokens
 * - Prone to XSS attacks via localStorage
 * 
 * DEPRECATED CODE EXAMPLES:
 * // OLD: const token = localStorage.getItem('accessToken');
 * // OLD: const refresh = localStorage.getItem('refreshToken');
 * // OLD: API.post('/api/accounts/refresh/', { refresh })
 * 
 * REPLACED BY:
 * - Clerk handles all token management securely
 * - Session stored server-side by Clerk
 * - Token obtained on-demand via getToken()
 * - No storage needed in app
 */

export const AuthProvider = ({ children }) => {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { signOut } = useClerk();
  
  // ============================================
  // AUTHENTICATION STATE: Synced with Clerk
  // ============================================
  // Only true when Clerk is loaded AND user is signed in
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ============================================
  // SYNC CLERK STATE TO LOCAL STATE
  // ============================================
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setIsAuthenticated(true);
    } else if (isLoaded && !isSignedIn) {
      setIsAuthenticated(false);
    }
    // While isLoaded=false, remain false (don't assume auth state)
  }, [isLoaded, isSignedIn]);

  // ============================================
  // LOGOUT: Sign out from Clerk
  // ============================================
  const logout = useCallback(async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error('[AuthContext] Error signing out:', error);
      // Fallback: clear state and redirect even if signOut fails
      setIsAuthenticated(false);
      window.location.href = "/login";
    }
  }, [signOut]);

  // ============================================
  // GET TOKEN: Retrieve JWT for API requests
  // ============================================
  // NO template parameter - use Clerk's standard JWT
  const getClerkToken = useCallback(async () => {
    try {
      if (!getToken || typeof getToken !== 'function') {
        console.warn('[AuthContext] getToken not available');
        return null;
      }
      
      // Get standard JWT without template
      const token = await getToken();
      return token;
    } catch (error) {
      console.error('[AuthContext] Error getting Clerk token:', error);
      return null;
    }
  }, [getToken]);

  // ============================================
  // LOGIN: Mark user as authenticated
  // ============================================
  // This is kept for compatibility but Clerk handles signup/login directly
  const login = useCallback(() => {
    // Clerk session is already created by Clerk's sign-in process
    // This just syncs the local state if needed
    setIsAuthenticated(true);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated,
      isLoaded,           // Pass through Clerk's loading state
      isSignedIn,         // Pass through Clerk's sign-in state
      login, 
      logout,
      getClerkToken,      // For API calls (NO template tokens)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

