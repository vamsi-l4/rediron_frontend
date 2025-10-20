import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "./Api";  // your dynamic baseURL axios instance
import "./EquipmentList.css";

const categories = ["Cardio", "Strength", "Core"];

const EquipmentList = () => {
  const [equipments, setEquipments] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Cardio");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // For example, if you want to add new equipment with a form (optional)
  const [formData, setFormData] = useState({
    name: "",
    usage: "",
    category: "Cardio",
    image: "",
    video_link: "",
  });

  const categoryImages = {
    Cardio: "/img/Cardio.jpg",
    Strength: "/img/weightlifting.jpg",
    Core: "/img/Core.jpg",
  };

  // Fetch equipment list on mount
  useEffect(() => {
    setLoading(true);
    API.get("/api/equipment/")
      .then((res) => {
        setEquipments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching equipment:", err);
        setError("Failed to load equipment.");
        setLoading(false);
      });
  }, []);

  const filteredEquipments = equipments.filter(
    (equip) => equip.category.toLowerCase() === activeCategory.toLowerCase()
  );

  // Example function to add new equipment (optional)
  const handleAddEquipment = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.post("/api/equipment/", formData, {
        headers: { "Content-Type": "application/json" },
      });
      setEquipments((prev) => [...prev, response.data]); // add new equipment to state
      setFormData({ name: "", usage: "", category: "Cardio", image: "", video_link: "" });
    } catch (err) {
      console.error("Failed to add equipment:", err);
      setError("Failed to add equipment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="equipment-page">
      <h1>💪 Explore RedIron Equipment</h1>

      <div className="equipment-categories">
        {categories.map((cat, index) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`category-card ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
            style={{
              backgroundImage: `url(${categoryImages[cat]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="glass-overlay">
              <h2>{cat} Training</h2>
              <p>Explore our best-in-class {cat.toLowerCase()} equipment</p>
              <button>Explore</button>
            </div>
          </motion.div>
        ))}
      </div>

      {loading && <p>Loading equipment...</p>}
      {error && <p className="error">{error}</p>}

      <div className="equipment-grid">
        {filteredEquipments.length > 0 ? (
          filteredEquipments.map((equip) => (
            <motion.div
              className="equipment-card"
              key={equip.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={`${API.defaults.baseURL}${equip.image}`}
                alt={equip.name}
              />
              <h3>{equip.name}</h3>
              <p>{equip.usage}</p>
              {equip.video_link && (
                <a href={equip.video_link} target="_blank" rel="noreferrer">
                  ▶ Watch Video
                </a>
              )}
            </motion.div>
          ))
        ) : (
          !loading && <p className="no-equipment">No equipment found for {activeCategory}</p>
        )}
      </div>

      {/* Optional: Add new equipment form */}
      
      <div className="add-equipment-form">
        <h2>Add New Equipment</h2>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <input
          type="text"
          placeholder="Usage"
          value={formData.usage}
          onChange={(e) => setFormData({...formData, usage: e.target.value})}
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Image URL or path"
          value={formData.image}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
        />
        <input
          type="text"
          placeholder="Video Link (optional)"
          value={formData.video_link}
          onChange={(e) => setFormData({...formData, video_link: e.target.value})}
        />
        <button onClick={handleAddEquipment} disabled={loading}>Add Equipment</button>
      </div>
      

    </div>
  );
};

export default EquipmentList;
