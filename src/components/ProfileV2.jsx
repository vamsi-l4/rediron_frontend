import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { UserDataContext } from "../contexts/UserDataContext";
import { useNavigate } from "react-router-dom";
import API, { makeAbsolute } from "./Api";
import "./ProfileV2.css";
import { ChevronDown, ChevronUp, Plus, Edit2, Trash2, LogOut } from "react-feather";

export default function ProfileV2() {
  const { logout } = useContext(AuthContext);
  const { userData, updateUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  // Section visibility states
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    addresses: false,
    subscription: false,
    fitness: false,
    saved: false,
    payment: false,
  });

  // Data states
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [fitnessProgress, setFitnessProgress] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    address_type: "home",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Load all profile data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Parallelize all data fetching
      const [profileRes, addressesRes, subRes, fitnessRes, savedRes, paymentRes] = await Promise.allSettled([
        API.get("/api/accounts/profile-manage/"),
        API.get("/api/accounts/addresses/"),
        API.get("/api/accounts/gym-subscription/"),
        API.get("/api/accounts/fitness-progress/"),
        API.get("/api/accounts/saved-items/"),
        API.get("/api/accounts/payment-history/"),
      ]);

      // Handle results  
      if (profileRes.status === "fulfilled" && profileRes.value.data) {
        setProfile(profileRes.value.data);
        setProfileForm(profileRes.value.data);
      }
      if (addressesRes.status === "fulfilled") {
        setAddresses(addressesRes.value.data || []);
      }
      if (subRes.status === "fulfilled" && subRes.value.data) {
        setSubscription(subRes.value.data);
      }
      if (fitnessRes.status === "fulfilled") {
        setFitnessProgress(fitnessRes.value.data || []);
      }
      if (savedRes.status === "fulfilled") {
        setSavedItems(savedRes.value.data || []);
      }
      if (paymentRes.status === "fulfilled") {
        setPaymentHistory(paymentRes.value.data || []);
      }
    } catch (err) {
      console.error("Error loading profile data:", err);
      setError("Failed to load profile data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("phone_number", profileForm.phone_number || "");
      formData.append("date_of_birth", profileForm.date_of_birth || "");
      formData.append("gender", profileForm.gender || "");
      formData.append("bio", profileForm.bio || "");
      formData.append("weight", profileForm.weight || "");
      formData.append("height", profileForm.height || "");
      formData.append("fitness_goal", profileForm.fitness_goal || "");
      formData.append("experience_level", profileForm.experience_level || "");

      // Add profile image if selected
      if (profileImageFile) {
        formData.append("profile_image", profileImageFile);
      }

      // Use the UserDataContext updateUserData function to update both local and global state
      const updatedData = await updateUserData(formData);
      setProfile(updatedData);
      setProfileImageFile(null); // Clear the file after successful upload
      setEditingProfile(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Failed to update profile: " + (err.response?.data?.detail || err.response?.data?.error || err.message));
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/api/accounts/addresses/", newAddress);
      setAddresses([...addresses, response.data]);
      setNewAddress({
        street_address: "",
        city: "",
        state: "",
        postal_code: "",
        country: "India",
        address_type: "home",
      });
      setShowAddressForm(false);
      alert("Address added successfully!");
    } catch (err) {
      alert("Failed to add address: " + (err.response?.data?.detail || err.message));
    }
  };

  const deleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await API.delete(`/api/accounts/addresses/${addressId}/`);
      setAddresses(addresses.filter((a) => a.id !== addressId));
      alert("Address deleted!");
    } catch (err) {
      alert("Failed to delete address");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container-v2">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {error && <div className="error-banner">{error}</div>}

      {/* Header */}
      <div className="profile-header-v2">
        {profile?.profile_image ? (
          <img
            src={makeAbsolute(profile.profile_image)}
            alt="Profile"
            className="profile-avatar"
          />
        ) : (
          <div className="profile-avatar-placeholder">
            {profile?.phone_number?.[0]?.toUpperCase() || "U"}
          </div>
        )}
        <div className="profile-header-info">
          <h1>{profileForm.name || "User Profile"}</h1>
          <p className="profile-email">{profile?.email || "No email"}</p>
          {subscription && subscription.is_active && (
            <div className="subscription-badge">
              Premium • {subscription.days_remaining} days left
            </div>
          )}
        </div>
      </div>

      {/* Personal Information Section */}
      <CollapsibleSection
        title="Personal Information"
        id="personal"
        expanded={expandedSections.personal}
        onToggle={toggleSection}
      >
        {editingProfile ? (
          <form onSubmit={handleProfileUpdate} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={profileForm.name || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={profileForm.phone_number || ""}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone_number: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={profileForm.date_of_birth || ""}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, date_of_birth: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  value={profileForm.gender || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={profileForm.bio || ""}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImageFile(e.target.files[0])}
              />
              {profileImageFile && (
                <p className="file-selected">Selected: {profileImageFile.name}</p>
              )}
            </div>

            {/* Fitness Information */}
            <div className="form-divider">Fitness Information</div>

            <div className="form-row">
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={profileForm.weight || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, weight: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={profileForm.height || ""}
                  onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fitness Goal</label>
                <select
                  value={profileForm.fitness_goal || ""}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, fitness_goal: e.target.value })
                  }
                >
                  <option value="">Select goal</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="endurance">Endurance</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="form-group">
                <label>Experience Level</label>
                <select
                  value={profileForm.experience_level || ""}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, experience_level: e.target.value })
                  }
                >
                  <option value="">Select level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-primary" type="submit">
                Save Changes
              </button>
              <button
                className="btn-secondary"
                type="button"
                onClick={() => {
                  setEditingProfile(false);
                  setProfileForm(profile);
                  setProfileImageFile(null); // Clear file on cancel
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info-display">
            <div className="info-row">
              <span className="label">Email:</span>
              <span>{profile?.email || "N/A"}</span>
            </div>
            <div className="info-row">
              <span className="label">Phone:</span>
              <span>{profile?.phone_number || "Not provided"}</span>
            </div>
            <div className="info-row">
              <span className="label">Date of Birth:</span>
              <span>{profile?.date_of_birth || "Not provided"}</span>
            </div>
            <div className="info-row">
              <span className="label">Gender:</span>
              <span>{profile?.gender ? { M: "Male", F: "Female", O: "Other" }[profile.gender] : "Not provided"}</span>
            </div>
            <div className="info-row">
              <span className="label">Fitness Goal:</span>
              <span>{profile?.fitness_goal?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "Not set"}</span>
            </div>
            <div className="info-row">
              <span className="label">Experience Level:</span>
              <span>{profile?.experience_level?.replace(/\b\w/g, l => l.toUpperCase()) || "Not set"}</span>
            </div>
            <div className="info-row">
              <span className="label">Weight:</span>
              <span>{profile?.weight ? `${profile.weight} kg` : "Not provided"}</span>
            </div>
            <div className="info-row">
              <span className="label">Height:</span>
              <span>{profile?.height ? `${profile.height} cm` : "Not provided"}</span>
            </div>

            <button className="btn-primary" onClick={() => setEditingProfile(true)}>
              <Edit2 size={16} /> Edit Profile
            </button>
          </div>
        )}
      </CollapsibleSection>

      {/* Addresses Section */}
      <CollapsibleSection
        title={`Addresses (${addresses.length})`}
        id="addresses"
        expanded={expandedSections.addresses}
        onToggle={toggleSection}
      >
        <div className="addresses-list">
          {addresses.map((addr) => (
            <div key={addr.id} className="address-card">
              <div className="address-header">
                <h4>{addr.address_type.toUpperCase()}</h4>
                <button
                  className="btn-delete"
                  onClick={() => deleteAddress(addr.id)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p>{addr.street_address}</p>
              <p>
                {addr.city}, {addr.state} {addr.postal_code}
              </p>
              <p>{addr.country}</p>
              {addr.is_primary && <span className="badge">Primary</span>}
            </div>
          ))}
        </div>

        {!showAddressForm ? (
          <button className="btn-primary" onClick={() => setShowAddressForm(true)}>
            <Plus size={16} /> Add Address
          </button>
        ) : (
          <form onSubmit={handleAddAddress} className="address-form">
            <div className="form-group">
              <label>Address Type</label>
              <select
                value={newAddress.address_type}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, address_type: e.target.value })
                }
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                value={newAddress.street_address}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street_address: e.target.value })
                }
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  value={newAddress.postal_code}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, postal_code: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  value={newAddress.country}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, country: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-primary" type="submit">
                Add Address
              </button>
              <button
                className="btn-secondary"
                type="button"
                onClick={() => setShowAddressForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </CollapsibleSection>

      {/* Subscription Section */}
      <CollapsibleSection
        title="Subscription & Plan"
        id="subscription"
        expanded={expandedSections.subscription}
        onToggle={toggleSection}
      >
        {subscription && subscription.is_active ? (
          <div className="subscription-card active">
            <div className="plan-name">{subscription.plan.toUpperCase()}</div>
            <div className="plan-details">
              <p>₹{subscription.price}/month</p>
              <p>{subscription.days_remaining} days remaining</p>
              <p>
                Expires: {new Date(subscription.end_date).toLocaleDateString()}
              </p>
              <p>
                {subscription.auto_renewal ? "Auto-renewal:" : "Non-renewing"}
              </p>
            </div>
          </div>
        ) : (
          <div className="no-subscription">
            <p>No active subscription</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/subscribe")}
            >
              Choose a Plan
            </button>
          </div>
        )}
      </CollapsibleSection>

      {/* Fitness Progress Section */}
      <CollapsibleSection
        title={`Fitness Progress (${fitnessProgress.length})`}
        id="fitness"
        expanded={expandedSections.fitness}
        onToggle={toggleSection}
      >
        <div className="fitness-list">
          {fitnessProgress.length > 0 ? (
            fitnessProgress.map((entry, idx) => (
              <div key={idx} className="fitness-entry">
                <p className="date">{new Date(entry.date_recorded).toLocaleDateString()}</p>
                {entry.weight && <p>Weight: {entry.weight} kg</p>}
                {entry.body_fat_percentage && <p>Body Fat: {entry.body_fat_percentage}%</p>}
                {entry.muscle_mass && <p>Muscle Mass: {entry.muscle_mass} kg</p>}
                {entry.notes && <p className="notes">{entry.notes}</p>}
              </div>
            ))
          ) : (
            <p>No fitness progress recorded yet.</p>
          )}
        </div>
      </CollapsibleSection>

      {/* Saved Items Section */}
      <CollapsibleSection
        title={`Saved Items (${savedItems.length})`}
        id="saved"
        expanded={expandedSections.saved}
        onToggle={toggleSection}
      >
        <div className="saved-items-list">
          {savedItems.length > 0 ? (
            savedItems.map((item) => (
              <div key={item.id} className="saved-item">
                <h4>{item.item_title}</h4>
                <p className="item-type">{item.item_type}</p>
                {item.item_description && <p>{item.item_description}</p>}
              </div>
            ))
          ) : (
            <p>No saved items yet.</p>
          )}
        </div>
      </CollapsibleSection>

      {/* Payment History Section */}
      <CollapsibleSection
        title={`Payment History (${paymentHistory.length})`}
        id="payment"
        expanded={expandedSections.payment}
        onToggle={toggleSection}
      >
        <div className="payment-list">
          {paymentHistory.length > 0 ? (
            paymentHistory.map((payment) => (
              <div key={payment.id} className="payment-row">
                <div>
                  <p className="payment-id">{payment.payment_id}</p>
                  <p className="payment-plan">{payment.plan}</p>
                </div>
                <div className="payment-amount">
                  ₹{payment.amount}
                  <span className={`status ${payment.status}`}>
                    {payment.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>No payment transactions yet.</p>
          )}
        </div>
      </CollapsibleSection>

      {/* Logout Section */}
      <div className="logout-section">
        <button className="btn-danger" onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

// Reusable Collapsible Section Component
function CollapsibleSection({ title, id, expanded, onToggle, children }) {
  return (
    <div className="section-card">
      <button
        className="section-header"
        onClick={() => onToggle(id)}
      >
        <h3>{title}</h3>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {expanded && <div className="section-content">{children}</div>}
    </div>
  );
}
