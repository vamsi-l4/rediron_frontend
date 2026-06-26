import React, { useEffect, useState, useContext } from "react";
import "./UserProfile.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";
import API from "../components/Api";
import { AuthContext } from "../contexts/AuthContext";
import { UserDataContext } from "../contexts/UserDataContext";
import { useUser } from "@clerk/clerk-react";
import { Camera, Mail, MapPin, Phone, Save, UserRound } from "lucide-react";

const UserProfile = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { userData, updateUserData } = useContext(UserDataContext);
  const { user: clerkUser } = useUser();
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    async function fetchProfile() {
      try {
        const profileRes = await API.get('/api/accounts/profile-manage/');
        const profileData = profileRes.data;
        setProfile(profileData);
        setFormData(profileData || {});
        setPreviewUrl(profileData?.profile_image || userData?.profile_image || clerkUser?.imageUrl || "");

        const addrRes = await API.get('/api/shop-useraddresses/');
        setAddresses(addrRes.data.results || addrRes.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [isAuthenticated, clerkUser, userData]);

  const fallbackEmail =
    profile?.email ||
    formData?.email ||
    userData?.email ||
    clerkUser?.primaryEmailAddress?.emailAddress ||
    clerkUser?.emailAddresses?.[0]?.emailAddress ||
    "Email not available";

  const displayName =
    profile?.name ||
    [formData?.first_name, formData?.last_name].filter(Boolean).join(" ") ||
    userData?.name ||
    clerkUser?.fullName ||
    "RedIron Member";

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let updatedProfile = profile || {};
      const accountForm = new FormData();
      accountForm.append("bio", formData.bio || "");
      accountForm.append("phone_number", formData.phone_number || formData.phone || "");
      const fullName = formData.name || [formData.first_name, formData.last_name].filter(Boolean).join(" ");
      if (fullName) accountForm.append("name", fullName);
      if (selectedFile) {
        accountForm.append("profile_image", selectedFile);
      }
      const updatedAccount = await updateUserData(accountForm);
      updatedProfile = { ...updatedProfile, ...updatedAccount };
      if (updatedAccount?.profile_image) {
        setPreviewUrl(updatedAccount.profile_image);
      }
      window.dispatchEvent(new CustomEvent("profileUpdated", { detail: updatedAccount }));
      window.dispatchEvent(new CustomEvent("userDataUpdated", { detail: updatedAccount }));

      setProfile(updatedProfile);
      setEditing(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-main rediron-theme">
        <Header />
        <div className="profile-content">
          <h2>Please log in to view your profile.</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) return <Loader />;

  return (
    <div className="profile-main rediron-theme">
      <Header />
      <div className="profile-content">
        <div className="profile-hero">
          <div className="profile-avatar-wrap">
            {previewUrl ? (
              <img src={previewUrl} alt="" className="profile-avatar" />
            ) : (
              <div className="profile-avatar profile-avatar-empty"><UserRound size={38} /></div>
            )}
            <label className="profile-upload-btn" htmlFor="shop-profile-image">
              <Camera size={16} />
              <input id="shop-profile-image" type="file" accept="image/*" hidden onChange={handleImageChange} />
            </label>
          </div>
          <div>
            <h2>My Profile</h2>
            <p><Mail size={16} /> {fallbackEmail}</p>
          </div>
        </div>
        {(profile || formData) && (
          <div className="profile-section">
            <h3>Personal Information</h3>
            {editing ? (
              <div className="profile-form">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={formData.phone_number || formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                />
                <textarea
                  placeholder="Bio"
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
                <button onClick={handleSave} disabled={saving}><Save size={16} /> {saving ? "Saving..." : "Save"}</button>
                <button onClick={() => setEditing(false)}>Cancel</button>
              </div>
            ) : (
              <div className="profile-info">
                <p><strong>Name:</strong> {displayName}</p>
                <p><strong>Email:</strong> {fallbackEmail}</p>
                <p><strong>Phone:</strong> {profile?.phone_number || profile?.phone || "Not added"}</p>
                <p><strong>Bio:</strong> {profile?.bio || "Not added"}</p>
                <button onClick={() => setEditing(true)}>Edit</button>
              </div>
            )}
          </div>
        )}
        <div className="profile-section">
          <h3>Addresses</h3>
          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <div key={addr.id} className="address-item">
                <p><MapPin size={15} /> {addr.name}, {addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                <p><Phone size={15} /> {addr.phone}</p>
              </div>
            ))
          ) : (
            <p>No addresses saved.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
