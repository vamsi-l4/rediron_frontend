import React, { useEffect, useState, useContext } from "react";
import "./UserProfile.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";
import API from "../components/Api";
import { AuthContext } from "../contexts/AuthContext";

const UserProfile = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    async function fetchProfile() {
      try {
        const profileRes = await API.get('/api/shop-userprofiles/');
        const profileData = profileRes.data.results ? profileRes.data.results[0] : profileRes.data[0];
        setProfile(profileData);
        setFormData(profileData);

        const addrRes = await API.get('/api/shop-useraddresses/');
        setAddresses(addrRes.data.results || addrRes.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [isAuthenticated]);

  const handleSave = async () => {
    try {
      await API.patch(`/api/shop-userprofiles/${profile.id}/`, formData);
      setProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
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
        <h2>My Profile</h2>
        {profile && (
          <div className="profile-section">
            <h3>Personal Information</h3>
            {editing ? (
              <div className="profile-form">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.first_name || ''}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.last_name || ''}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <textarea
                  placeholder="Bio"
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setEditing(false)}>Cancel</button>
              </div>
            ) : (
              <div className="profile-info">
                <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {profile.phone}</p>
                <p><strong>Bio:</strong> {profile.bio}</p>
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
                <p>{addr.name}, {addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                <p>Phone: {addr.phone}</p>
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
