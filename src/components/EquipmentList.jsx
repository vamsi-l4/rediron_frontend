import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import API from "./Api";
import "./EquipmentList.css";

const categories = ["Cardio", "Strength", "Core"];

const EquipmentList = () => {
  const [equipments, setEquipments] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Cardio");

  const categoryImages = {
    Cardio: "/img/Cardio.jpg",
    Strength: "/img/weightlifting.jpg",
    Core: "/img/Core.jpg",
  };

  useEffect(() => {
    API.get("/api/equipment/")
      .then((res) => {
        setEquipments(res.data);
      })
      .catch((err) => {
        console.error("Error fetching equipment:", err);
      });
  }, []);

  const filteredEquipments = equipments.filter(
    (equip) => equip.category.toLowerCase() === activeCategory.toLowerCase()
  );

  return (
    <div className="equipment-page">
      <Navbar />
      <h1>💪 Explore RedIron Equipment</h1>

      <div className="equipment-categories">
        {categories.map((cat, index) => (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`category-card ${activeCategory === cat ? "active" : ""}`}
            key={cat}
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
          <p className="no-equipment">
            No equipment found for {activeCategory}
          </p>
        )}
      </div>
    </div>
  );
};

export default EquipmentList;
