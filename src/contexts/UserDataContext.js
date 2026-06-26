import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import API from '../components/Api';
import { AuthContext } from './AuthContext';

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated) {
      setUserData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await API.get('/api/accounts/profile-manage/');
      setUserData(response.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setUserData(null); // Clear data on error
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // This function will be called from the Profile page
  const updateProfile = useCallback(async (formData, isMultipart = false) => {
    try {
      const response = await API.patch('/api/accounts/profile-manage/', formData, {
        headers: {
          'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
        },
      });
      // Immediately update the context with the new data from the server response
      setUserData(response.data);
      console.log('[UserDataContext] ✅ Profile updated successfully:', response.data);
      return response.data; // Return the new data
    } catch (error) {
      console.error('[UserDataContext] ❌ Failed to update profile:', error);
      throw error; // Re-throw to be caught by the calling component
    }
  }, []);

  const value = { userData, loading, fetchUserData, updateProfile };

  return (
    <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>
  );
};