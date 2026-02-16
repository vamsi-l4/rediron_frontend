/**
 * Clerk Authentication Utilities
 * 
 * ============================================
 * REFACTORED: Clerk-Only Authentication
 * ============================================
 * 
 * IMPORTANT CHANGES:
 * - Removed ALL localStorage usage (maintaining Clerk session only)
 * - Token is obtained on-demand via getToken() from AuthContext
 * - User info is retrieved directly from Clerk's useAuth() hook
 * - No caching or manual storage of credentials
 * 
 * This ensures:
 * 1. Session state lives in Clerk only
 * 2. No sensitive data in browser storage
 * 3. Single source of truth: Clerk
 * 4. Compliant with security best practices
 */

/**
 * Get Clerk session token for API requests
 * 
 * CLERK ONLY APPROACH:
 * - Uses Clerk's native getToken() without template parameter
 * - Token is obtained on-demand when making API calls
 * - No manual caching or storage
 * 
 * @param {function} getToken - Clerk's getToken function from useAuth()
 * @returns {Promise<string|null>} Bearer token or null if not authenticated
 */
export const getClerkToken = async (getToken) => {
  try {
    if (!getToken || typeof getToken !== 'function') {
      console.warn('[clerkAuth] getToken not available - user may not be signed in');
      return null;
    }
    
    // Get token WITHOUT template - Clerk handles this internally
    const token = await getToken();
    return token;
  } catch (error) {
    console.error('[clerkAuth] Error getting Clerk token:', error.message);
    return null;
  }
};

/**
 * DEPRECATED: storeClerkUserInfo
 * 
 * OLD APPROACH (NO LONGER USED):
 * Previously stored user info in localStorage.
 * Now user info is retrieved directly from Clerk useAuth() hook.
 * 
 * @deprecated - Use useAuth() hook directly instead
 */
export const storeClerkUserInfo = (user) => {
  // DEPRECATED: No longer storing in localStorage
  // Use Clerk's useAuth() hook directly in components
  console.warn('[clerkAuth] storeClerkUserInfo is deprecated - use useAuth() directly');
};

/**
 * DEPRECATED: getClerkUserInfo
 * 
 * OLD APPROACH (NO LONGER USED):
 * Previously retrieved user info from localStorage.
 * Now use useAuth() hook directly to get fresh user info from Clerk.
 * 
 * @deprecated - Use useAuth() hook directly instead
 * @returns {object} Empty object (deprecated)
 */
export const getClerkUserInfo = () => {
  // DEPRECATED: No longer storing in localStorage
  // Use Clerk's useAuth() hook directly in components
  console.warn('[clerkAuth] getClerkUserInfo is deprecated - use useAuth() directly');
  return {};
};

/**
 * DEPRECATED: clearClerkUserInfo
 * 
 * OLD APPROACH (NO LONGER USED):
 * Previously cleared user info from localStorage.
 * Now Clerk handles session cleanup via signOut().
 * 
 * @deprecated - Use Clerk's signOut() directly instead
 */
export const clearClerkUserInfo = () => {
  // DEPRECATED: Clerk handles session cleanup
  // Use signOut() from useClerk() hook directly
  console.warn('[clerkAuth] clearClerkUserInfo is deprecated - use Clerk signOut() directly');
};

// ============================================
// OLD JWT AUTHENTICATION (COMMENTED - FOR REFERENCE)
// ============================================
// PREVIOUS IMPLEMENTATION (NO LONGER USED):
// This project previously used manual JWT tokens stored in localStorage.
// The old code is preserved for interview/reference purposes.
// 
// OLD FLOW:
// 1. User logged in manually and got JWT token
// 2. Token stored in localStorage: 'accessToken', 'refreshToken'
// 3. API calls included Authorization header with token
// 4. Token refreshed when expired using refresh endpoint
// 
// NEW FLOW (CLERK):
// 1. Clerk handles signup, email verification, password storage
// 2. Clerk creates session automatically after verification
// 3. Token obtained on-demand via getToken() from useAuth()
// 4. No manual token management or storage needed
// 
// DEPRECATED CODE EXAMPLES (for reference):
// OLD: localStorage.setItem('accessToken', response.data.access);
// OLD: localStorage.setItem('refreshToken', response.data.refresh);
// OLD: const token = localStorage.getItem('accessToken');
// NEW: const token = await getToken();
// 
// OLD Manual refresh logic:
// OLD: const response = await API.post('/api/accounts/refresh/', { refresh });
// NEW: Clerk handles token refresh automatically

const clerkAuthUtils = {
  getClerkToken,
  // Deprecated functions kept for compatibility but do nothing
  storeClerkUserInfo,
  getClerkUserInfo,
  clearClerkUserInfo,
};

export default clerkAuthUtils;
