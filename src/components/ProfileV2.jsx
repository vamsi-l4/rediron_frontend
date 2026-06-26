import React, { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { UserDataContext } from "../contexts/UserDataContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import API, { makeAbsolute } from "./Api";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, User, MapPin, CreditCard, Activity, Bookmark, LogOut, Save, Plus, Trash2 } from "lucide-react";
import "./ProfileV2.css";

export default function ProfileV2() {
  const { logout } = useContext(AuthContext);
  const { updateProfile } = useContext(UserDataContext);

  const { user: clerkUser } = useUser();
  const navigate = useNavigate();

  // Active Tab State
  const [activeTab, setActiveTab] = useState("personal");

  // Data states
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [fitnessProgress, setFitnessProgress] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Form states
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    address_type: "home",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  const getDisplayEmail = useCallback((data) => {
    const profileEmail = data?.email && !String(data.email).endsWith("@clerk.invalid") ? data.email : "";
    return profileEmail || clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress || "No email provided";
  }, [clerkUser]);

  const loadAllData = useCallback(async () => {
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
        let profileData = profileRes.value.data;

        // Auto-fill name and email from Clerk if empty in database
        if (clerkUser) {
          if (!profileData.name || profileData.name.trim() === '') {
            profileData.name = clerkUser.firstName || '';
          }
          if (!profileData.email || profileData.email.trim() === '' || profileData.email.endsWith('@clerk.invalid')) {
            profileData.email = clerkUser.emailAddresses?.[0]?.emailAddress || '';
          }
        }

        if (profileData.profile_image) {
          const absoluteImageBase = makeAbsolute(profileData.profile_image);
          const absoluteImage = `${absoluteImageBase}${absoluteImageBase.includes('?') ? '&' : '?'}t=${Date.now()}`;
          profileData.profile_image = absoluteImage;
          setPreviewUrl(absoluteImage);
        }

        setProfile(profileData);
        setProfileForm(profileData);

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
  }, [clerkUser]);

  // Load all profile data ONCE (prevents repeated API calls / rerender loops)
  useEffect(() => {
    window.scrollTo(0, 0);
    loadAllData();
  }, [loadAllData]);


  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };


  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const formData = new FormData();
      if (profileForm.name) formData.append("name", profileForm.name);
      if (profileForm.phone) formData.append("phone", profileForm.phone);

      if (profileForm.date_of_birth) formData.append("date_of_birth", profileForm.date_of_birth);
      if (profileForm.gender) formData.append("gender", profileForm.gender);
      if (profileForm.bio) formData.append("bio", profileForm.bio);
      if (profileForm.weight) formData.append("weight", profileForm.weight);
      if (profileForm.height) formData.append("height", profileForm.height);
      if (profileForm.fitness_goal) formData.append("fitness_goal", profileForm.fitness_goal);
      if (profileForm.experience_level) formData.append("experience_level", profileForm.experience_level);

      if (selectedFile) {
        formData.append("profile_image", selectedFile);
      }

      const updatedData = await updateProfile(formData, true);

      // Keep local state in sync without full refetch
      setProfile((prev) => ({ ...prev, ...updatedData }));
      setProfileForm((prev) => ({ ...prev, ...updatedData }));

      // Replace preview with server image + cache-bust
      if (updatedData && updatedData.profile_image) {
        const absoluteImageBase = makeAbsolute(updatedData.profile_image);
        setPreviewUrl(`${absoluteImageBase}${absoluteImageBase.includes('?') ? '&' : '?'}t=${Date.now()}`);
      }

      setFeedback({ type: "success", text: "Profile updated successfully!" });

      setSelectedFile(null); // Clear selected file after successful save
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error("Profile update error:", err);
      setFeedback({ type: "error", text: "Failed to update profile." });
    } finally {
      setSaving(false);
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
    } catch (err) {
      alert("Failed to add address: " + (err.response?.data?.detail || err.message));
    }
  };

  const deleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await API.delete(`/api/accounts/addresses/${addressId}/`);
      setAddresses(addresses.filter((a) => a.id !== addressId));
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
      <div className="profile-v2-page loading">
        <div className="profile-v2-spinner"></div>
      </div>
    );
  }

  return (
    <div className="profile-v2-page">
      <div className="profile-v2-header-bg">
        <button className="profile-v2-back-btn" onClick={() => navigate(-1)} aria-label="Go Back">
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="profile-v2-content">

        {/* LEFT COLUMN - USER SIDEBAR */}
        <motion.div
          className="profile-v2-sidebar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="profile-v2-card sidebar-card">
            <div className="profile-v2-avatar-wrapper">
              <img src={previewUrl || profile?.profile_image || clerkUser?.imageUrl || "/img/default-avatar.png"} alt="Profile" className="profile-v2-avatar" />
              <label htmlFor="avatarUpload" className="profile-v2-avatar-upload">
                <Camera size={18} color="#fff" />
                <input type="file" id="avatarUpload" accept="image/*" onChange={handleImageChange} hidden />
              </label>
            </div>

            <h2 className="profile-v2-name">{profileForm.name || clerkUser?.fullName || "Gym Member"}</h2>
            <p className="profile-v2-email">{getDisplayEmail(profile)}</p>
            {subscription && subscription.is_active && (
              <span className="profile-v2-badge">Premium • {subscription.days_remaining} Days Left</span>
            )}

            <div className="profile-v2-tabs">
              <button className={activeTab === "personal" ? "active" : ""} onClick={() => setActiveTab("personal")}>
                <User size={18} /> Personal Info
              </button>
              <button className={activeTab === "addresses" ? "active" : ""} onClick={() => setActiveTab("addresses")}>
                <MapPin size={18} /> Addresses
              </button>
              <button className={activeTab === "subscription" ? "active" : ""} onClick={() => setActiveTab("subscription")}>
                <CreditCard size={18} /> Subscription
              </button>
              <button className={activeTab === "fitness" ? "active" : ""} onClick={() => setActiveTab("fitness")}>
                <Activity size={18} /> Fitness Progress
              </button>
              <button className={activeTab === "saved" ? "active" : ""} onClick={() => setActiveTab("saved")}>
                <Bookmark size={18} /> Saved Items
              </button>
              <button className={activeTab === "payment" ? "active" : ""} onClick={() => setActiveTab("payment")}>
                <CreditCard size={18} /> Payment History
              </button>
              <button className="logout-tab" onClick={handleLogout}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN - MAIN CONTENT */}
        <motion.div
          className="profile-v2-main"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="profile-v2-card">

            {error && <div className="profile-v2-feedback error">{error}</div>}

            <AnimatePresence mode="wait">

              {/* TAB 1: PERSONAL INFO */}
              {activeTab === "personal" && (
                <motion.div key="personal" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <h3 className="profile-v2-tab-title">Personal & Fitness Details</h3>
                  <form onSubmit={handleProfileUpdate} className="profile-v2-form">
                    <div className="form-row">
                      <div className="input-group">
                        <label>Full Name</label>
                        <input type="text" value={profileForm.name || ""} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                      </div>
                      <div className="input-group">
                        <label>Phone Number</label>
                        <input type="text" value={profileForm.phone || ""} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />

                      </div>
                    </div>
                    <div className="form-row">
                      <div className="input-group">
                        <label>Date of Birth</label>
                        <input type="date" value={profileForm.date_of_birth || ""} onChange={(e) => setProfileForm({ ...profileForm, date_of_birth: e.target.value })} />
                      </div>
                      <div className="input-group">
                        <label>Gender</label>
                        <select value={profileForm.gender || ""} onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}>
                          <option value="">Select Gender</option>
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                          <option value="O">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Bio</label>
                      <textarea value={profileForm.bio || ""} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} rows="3"></textarea>
                    </div>

                    <h4 className="profile-v2-subheading">Fitness Profile</h4>
                    <div className="form-row">
                      <div className="input-group">
                        <label>Weight (kg)</label>
                        <input type="number" step="0.1" value={profileForm.weight || ""} onChange={(e) => setProfileForm({ ...profileForm, weight: e.target.value })} />
                      </div>
                      <div className="input-group">
                        <label>Height (cm)</label>
                        <input type="number" step="0.1" value={profileForm.height || ""} onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value })} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="input-group">
                        <label>Fitness Goal</label>
                        <select value={profileForm.fitness_goal || ""} onChange={(e) => setProfileForm({ ...profileForm, fitness_goal: e.target.value })}>
                          <option value="">Select Goal</option>
                          <option value="weight_loss">Weight Loss</option>
                          <option value="muscle_gain">Muscle Gain</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="endurance">Endurance</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Experience Level</label>
                        <select value={profileForm.experience_level || ""} onChange={(e) => setProfileForm({ ...profileForm, experience_level: e.target.value })}>
                          <option value="">Select Level</option>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div className="profile-v2-footer">
                      {feedback && <span className={`profile-v2-feedback ${feedback.type}`}>{feedback.text}</span>}
                      <button type="submit" className="profile-v2-save-btn" disabled={saving}>
                        <Save size={18} /> {saving ? "Saving..." : "Save Profile"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* TAB 2: ADDRESSES */}
              {activeTab === "addresses" && (
                <motion.div key="addresses" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <div className="profile-v2-flex-between">
                    <h3 className="profile-v2-tab-title">Saved Addresses</h3>
                    {!showAddressForm && (
                      <button className="profile-v2-small-btn" onClick={() => setShowAddressForm(true)}>
                        <Plus size={16} /> Add New
                      </button>
                    )}
                  </div>

                  {showAddressForm && (
                    <form onSubmit={handleAddAddress} className="profile-v2-form" style={{ marginBottom: '20px', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px' }}>
                      <div className="form-row">
                        <div className="input-group">
                          <label>Address Type</label>
                          <select value={newAddress.address_type} onChange={(e) => setNewAddress({ ...newAddress, address_type: e.target.value })}>
                            <option value="home">Home</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="input-group">
                          <label>Street Address</label>
                          <input type="text" value={newAddress.street_address} onChange={(e) => setNewAddress({ ...newAddress, street_address: e.target.value })} required />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="input-group">
                          <label>City</label>
                          <input type="text" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} required />
                        </div>
                        <div className="input-group">
                          <label>State</label>
                          <input type="text" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} required />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="input-group">
                          <label>Postal Code</label>
                          <input type="text" value={newAddress.postal_code} onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })} required />
                        </div>
                        <div className="input-group">
                          <label>Country</label>
                          <input type="text" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} required />
                        </div>
                      </div>
                      <div className="profile-v2-footer" style={{ marginTop: '10px', paddingTop: 0, border: 'none' }}>
                        <button type="button" className="profile-v2-cancel-btn" onClick={() => setShowAddressForm(false)}>Cancel</button>
                        <button type="submit" className="profile-v2-save-btn">Save Address</button>
                      </div>
                    </form>
                  )}

                  <div className="profile-v2-list-grid">
                    {addresses.length > 0 ? addresses.map((addr) => (
                      <div key={addr.id} className="profile-v2-list-card">
                        <div className="card-header">
                          <h4>{addr.address_type.toUpperCase()}</h4>
                          <button onClick={() => deleteAddress(addr.id)} className="delete-btn"><Trash2 size={16}/></button>
                        </div>
                        <p>{addr.street_address}</p>
                        <p>{addr.city}, {addr.state} {addr.postal_code}</p>
                        <p>{addr.country}</p>
                      </div>
                    )) : <p className="profile-v2-empty">No addresses saved yet.</p>}
                  </div>
                </motion.div>
              )}

              {/* TAB 3: SUBSCRIPTION */}
              {activeTab === "subscription" && (
                <motion.div key="subscription" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <h3 className="profile-v2-tab-title">Active Plan</h3>
                  {subscription && subscription.is_active ? (
                    <div className="profile-v2-plan-card">
                      <div className="plan-glow"></div>
                      <h2>{subscription.plan.toUpperCase()} MEMBERSHIP</h2>
                      <div className="plan-stats">
                        <div>
                          <span>Price</span>
                          <strong>₹{subscription.price}/month</strong>
                        </div>
                        <div>
                          <span>Status</span>
                          <strong>{subscription.days_remaining} Days Left</strong>
                        </div>
                        <div>
                          <span>Expires</span>
                          <strong>{new Date(subscription.end_date).toLocaleDateString()}</strong>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="profile-v2-empty-state">
                      <CreditCard size={40} />
                      <p>You have no active subscription.</p>
                      <button className="profile-v2-save-btn" onClick={() => navigate("/subscribe")}>View Plans</button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 4: FITNESS PROGRESS */}
              {activeTab === "fitness" && (
                <motion.div key="fitness" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <div className="profile-v2-flex-between">
                    <h3 className="profile-v2-tab-title">Fitness Progress</h3>
                    <button className="profile-v2-small-btn" onClick={() => navigate("/performance-lab")}>
                      Go to Performance Lab
                    </button>
                  </div>
                  <div className="profile-v2-list-grid">
                    {fitnessProgress.length > 0 ? fitnessProgress.map((entry, idx) => (
                      <div key={idx} className="profile-v2-list-card">
                        <div className="card-header">
                          <h4>{new Date(entry.date_recorded).toLocaleDateString()}</h4>
                        </div>
                        {entry.weight && <p><strong>Weight:</strong> {entry.weight} kg</p>}
                        {entry.body_fat_percentage && <p><strong>Body Fat:</strong> {entry.body_fat_percentage}%</p>}
                        {entry.muscle_mass && <p><strong>Muscle:</strong> {entry.muscle_mass} kg</p>}
                        {entry.notes && <p className="notes">"{entry.notes}"</p>}
                      </div>
                    )) : <p className="profile-v2-empty">No fitness progress recorded yet.</p>}
                  </div>
                </motion.div>
              )}

              {/* TAB 5: SAVED ITEMS */}
              {activeTab === "saved" && (
                <motion.div key="saved" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <h3 className="profile-v2-tab-title">Saved Content</h3>
                  <div className="profile-v2-list-grid">
                    {savedItems.length > 0 ? savedItems.map((item) => (
                      <div key={item.id} className="profile-v2-list-card">
                        <span className="profile-v2-badge">{item.item_type}</span>
                        <h4 style={{marginTop: '10px'}}>{item.item_title}</h4>
                        {item.item_description && <p>{item.item_description}</p>}
                      </div>
                    )) : <p className="profile-v2-empty">No saved items yet.</p>}
                  </div>
                </motion.div>
              )}

              {/* TAB 6: PAYMENTS */}
              {activeTab === "payment" && (
                <motion.div key="payment" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <h3 className="profile-v2-tab-title">Payment History</h3>
                  <div className="profile-v2-list-grid vertical">
                    {paymentHistory.length > 0 ? paymentHistory.map((payment) => (
                      <div key={payment.id} className="profile-v2-payment-row">
                        <div>
                          <h4>{payment.payment_id}</h4>
                          <p>{payment.plan}</p>
                        </div>
                        <div className="payment-right">
                          <strong>₹{payment.amount}</strong>
                          <span className={`status-badge ${payment.status.toLowerCase()}`}>{payment.status}</span>
                        </div>
                      </div>
                    )) : <p className="profile-v2-empty">No transactions found.</p>}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
