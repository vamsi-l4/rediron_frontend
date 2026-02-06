import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { UserDataContext } from "../contexts/UserDataContext";
import { useNavigate } from "react-router-dom";
import { makeAbsolute } from "./Api";
import "./Profile.css";

export default function Profile() {
  const { logout } = useContext(AuthContext);
  const { userData, loading, error, updateUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);

  // ============================================
  // FIX: SYNC REAL USER DATA FROM BACKEND
  // ============================================
  // Display actual user data (name, email) from backend
  // NOT from Clerk (which shows "Clerk User")
  useEffect(() => {
    if (userData) {
      setName(userData.name || userData.username || "");
      setEmail(userData.email || "");
      setProfileImage(userData.profile_image || null);
      setImageError(false);
      setErrorMessage(""); // Clear error when data loads
    } else if (error) {
      setErrorMessage(error);
    }
  }, [userData, error]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    } else {
      setProfileImage(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("name", name);
    if (profileImage instanceof File) {
      formData.append("profile_image", profileImage);
    } else if (profileImage === null) {
      // To delete profile image, send empty string or null depending on backend
      formData.append("profile_image", "");
    }

    try {
      await updateUserData(formData);
      setSuccessMessage("Profile updated successfully.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setErrorMessage("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      
      {loading ? (
        <div className="loading-state" style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading profile...</p>
        </div>
      ) : !userData ? (
        <div className="error-state" style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
          <p>Failed to load profile data.</p>
        </div>
      ) : (
        <>
          <div className="profile-header">
            {userData.profile_image && !imageError ? (
              <img
                src={makeAbsolute(userData.profile_image)}
                alt="Profile"
                className="profile-image"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="profile-placeholder">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="profile-info">
              <h2>{name || "User"}</h2>
              <p>{email || "Email not available"}</p>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleUpdate}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              readOnly
              required
            />

            <label htmlFor="profile_image">Profile Image</label>
            <input
              id="profile_image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
            />

            <button type="submit">Update Profile</button>
          </form>

          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </>
      )}

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
