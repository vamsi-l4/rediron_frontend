  import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import API from "../components/Api";
import { AuthContext } from "./AuthContext";

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async (retryCount = 0) => {
    if (!isAuthenticated) {
      setUserData(null);
      return;
    }
    setLoading(true);
    setError(null);
    const maxRetries = 3;

    try {
      const response = await API.get("/api/accounts/profile/");
      setUserData(response.data);
    } catch (err) {
      if (retryCount < maxRetries && (err.response?.status >= 500 || !err.response)) {
        // Retry on server errors or network errors
        const delay = Math.pow(2, retryCount) * 1000;
        console.warn(`Retrying fetchUserData (${retryCount + 1}/${maxRetries}) after ${delay}ms`);
        setTimeout(() => fetchUserData(retryCount + 1), delay);
        return;
      }
      // Differentiate error types
      if (!err.response) {
        setError("Network error: Unable to connect to server. Please check your connection.");
      } else if (err.response.status === 401) {
        setError("Authentication error: Please log in again.");
      } else if (err.response.status >= 500) {
        setError("Server error: Service temporarily unavailable. Please try again later.");
      } else {
        setError(`Failed to load user data: ${err.response.data?.detail || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const updateUserData = async (newData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.patch("/api/accounts/profile/", newData);

      setUserData(response.data);
    } catch (err) {
      setError("Failed to update user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <UserDataContext.Provider value={{ userData, loading, error, updateUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};
