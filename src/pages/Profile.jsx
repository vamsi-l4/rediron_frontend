import React, { useState, useContext, useEffect } from 'react';
import { UserDataContext } from '../contexts/UserDataContext';
import { useUser } from '@clerk/clerk-react';
import './Profile.css'; // Assuming you have a CSS file for styling

const Profile = () => {
  const { userData, updateProfile, loading: userDataLoading } = useContext(UserDataContext);
  const { user: clerkUser } = useUser();

  // State for form fields, initialized from context
  const [localUserData, setLocalUserData] = useState({
    name: '',
    // Add other fields from your API response here to control them in the form
    // e.g., phone: '', bio: '', etc.
  });

  // State for image file and its preview
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State for loading indicators
  const [isSaving, setIsSaving] = useState(false);

  // Effect to populate form when userData from context is available or changes
  useEffect(() => {
    if (userData) {
      setLocalUserData({
        name: userData.name || '',
        // Populate other fields
      });
    }
  }, [userData]);

  // Cleanup for the object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData) return;

    setIsSaving(true);

    const formData = new FormData();

    // Append text fields only if they have changed
    Object.keys(localUserData).forEach(key => {
      if (localUserData[key] !== userData[key]) {
        formData.append(key, localUserData[key]);
      }
    });

    // Append image if a new one was selected
    if (profileImageFile) {
      formData.append('profile_image', profileImageFile);
    }

    try {
      await updateProfile(formData);
      // On success, clear the staged image file and its preview
      setProfileImageFile(null);
      setImagePreview(null);
      // You can add a success toast message here
    } catch (error) {
      console.error("Failed to update profile:", error);
      // You can add an error toast message here
    } finally {
      setIsSaving(false);
    }
  };

  if (userDataLoading || !userData) {
    return <div>Loading profile...</div>;
  }

  // Add a cache-busting query parameter to the profile image URL
  const profileImageUrl = userData.profile_image ? `${userData.profile_image}?t=${new Date().getTime()}` : clerkUser?.imageUrl;

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="profile-image-section">
          <img src={imagePreview || profileImageUrl || '/default-avatar.png'} alt="Profile" className="profile-page-avatar" />
          <label htmlFor="profile-image-upload" className="profile-image-label">
            Change Photo
          </label>
          <input id="profile-image-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
        </div>

        <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={localUserData.name || ''} onChange={handleInputChange} />
        </div>

        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;