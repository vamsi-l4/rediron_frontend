  import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import API from "../components/Api";
import { AuthContext } from "./AuthContext";

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated) {
      setUserData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/api/accounts/profile/");
      setUserData(response.data);
    } catch (err) {
      setError("Failed to load user data.");
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
