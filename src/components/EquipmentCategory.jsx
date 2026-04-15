import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "./Api";
import "./EquipmentCategory.css";

const EquipmentCategory = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pageBackgroundStyle = {
    background: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url('/assets/eqp_bg.png') no-repeat center/cover",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  // Validate category
  const validCategories = useMemo(() => ["cardio", "strength", "core"], []);
  const categoryLabel = {
    cardio: "Cardio Equipment",
    strength: "Strength Equipment",
    core: "Core Equipment",
  };

  useEffect(() => {
    if (!validCategories.includes(type)) {
      navigate("/equipment");
      return;
    }

    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/api/equipment/?category=${type}`);
        
        if (response.data && Array.isArray(response.data)) {
          setEquipment(response.data);
        } else if (response.data && response.data.results) {
          setEquipment(response.data.results);
        } else {
          setEquipment([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching equipment:", err);
        setError("Failed to load equipment. Please try again.");
        setEquipment([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [type, navigate, validCategories]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="equipment-page" style={pageBackgroundStyle}>
      <div className="equipment-content">
        <motion.div
          className="equipment-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="equipment-title">
            {categoryLabel[type] || "Equipment"}
          </h1>
          <p className="equipment-subtitle">
            Explore our premium {type} training equipment designed for peak performance.
          </p>
        </motion.div>

        <div className="equipment-body">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading equipment...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
            </div>
          ) : equipment.length === 0 ? (
            <div className="empty-state">
              <p>No equipment available in this category yet.</p>
            </div>
          ) : (
            <motion.div
              className="equipment-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {equipment.map((item) => (
                <motion.div
                  key={item.id}
                  className="equipment-item"
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="equipment-item-image-wrapper">
                    {item.image ? (
                      <img
                        src={
                          item.image.startsWith("http")
                            ? item.image
                            : `${API.defaults.baseURL}${item.image}`
                        }
                        alt={item.name}
                        className="equipment-item-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="equipment-item-placeholder">
                        <span>No Image</span>
                      </div>
                    )}
                    <div className="equipment-item-overlay"></div>
                  </div>

                  <div className="equipment-item-content">
                    <h3 className="equipment-item-name">{item.name}</h3>
                    {item.usage && (
                      <p className="equipment-item-usage">{item.usage}</p>
                    )}
                    <button className="equipment-item-button">
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentCategory;
