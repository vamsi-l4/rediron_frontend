import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import API, { makeAbsolute } from "./Api";
import "./Profile.css";

export default function Profile() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get("/api/accounts/profile/");
      setUser(response.data);
      setName(response.data.name || "");
      setProfileImage(response.data.profile_image || null);
    } catch (error) {
      setErrorMessage("Failed to load profile data.");
    }
  };

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
      const response = await API.patch("/api/accounts/profile/update/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccessMessage("Profile updated successfully.");
      setUser(response.data);
      setName(response.data.name || "");
      setProfileImage(response.data.profile_image || null);
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
      <div className="profile-header">
        {user && user.profile_image ? (
          <img
            src={makeAbsolute(user.profile_image)}
            alt="Profile"
            className="profile-image"
          />
        ) : (
          <div className="profile-placeholder">
            {user && user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}
        <div className="profile-info">
          <h2>{user ? user.name : "User"}</h2>
          <p>{user ? user.email : "Email not available"}</p>
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
          value={user ? user.email : ""}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
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

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
