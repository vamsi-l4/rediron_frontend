/**
 * Clerk Authentication Utilities
 * Handles Clerk-specific authentication logic and token management
 * This utility provides functions to integrate Clerk tokens with the backend API
 */

/**
 * Get Clerk session token for API requests
 * @returns {Promise<string|null>} Bearer token or null if not authenticated
 */
export const getClerkToken = async (getToken) => {
  try {
    if (!getToken) return null;
    const token = await getToken({ template: 'integration_jwt' });
    return token;
  } catch (error) {
    console.error('Error getting Clerk token:', error);
    return null;
  }
};

/**
 * Store Clerk user info in localStorage
 * @param {object} user - Clerk user object
 */
export const storeClerkUserInfo = (user) => {
  if (!user) return;
  try {
    localStorage.setItem('clerkUserId', user.id);
    localStorage.setItem('clerkEmail', user.primaryEmailAddress?.emailAddress || '');
    localStorage.setItem('clerkName', user.firstName || '');
  } catch (error) {
    console.error('Error storing Clerk user info:', error);
  }
};

/**
 * Get stored Clerk user info
 * @returns {object} User information or empty object
 */
export const getClerkUserInfo = () => {
  try {
    return {
      userId: localStorage.getItem('clerkUserId'),
      email: localStorage.getItem('clerkEmail'),
      name: localStorage.getItem('clerkName'),
    };
  } catch (error) {
    console.error('Error getting Clerk user info:', error);
    return {};
  }
};

/**
 * Clear Clerk user info from localStorage
 */
export const clearClerkUserInfo = () => {
  try {
    localStorage.removeItem('clerkUserId');
    localStorage.removeItem('clerkEmail');
    localStorage.removeItem('clerkName');
    // COMMENTED: Old token cleanup (no longer needed)
    // localStorage.removeItem('accessToken');
    // localStorage.removeItem('refreshToken');
  } catch (error) {
    console.error('Error clearing Clerk user info:', error);
  }
};

const clerkAuthUtils = {
  getClerkToken,
  storeClerkUserInfo,
  getClerkUserInfo,
  clearClerkUserInfo,
};

export default clerkAuthUtils;
