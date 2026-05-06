import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API, { makeAbsolute } from "./Api";
import "./EquipmentCategory.css";

const EquipmentCategory = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pageBackgroundStyle = {
    background: 'radial-gradient(circle at top left, rgba(255, 30, 30, 0.18), transparent 28%), radial-gradient(circle at bottom right, rgba(255, 0, 0, 0.12), transparent 25%), #030303',
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

  const categoryDescription = {
    cardio: "High-performance cardio equipment built for stamina, speed, and endurance.",
    strength: "Power-packed strength systems designed for heavy lifts and muscle growth.",
    core: "Precision core training tools for stability, balance, and athletic performance.",
  };

  const getItemImageUrl = (item) => {
    const candidate = item.image2 || item.image || item.gallery_images?.[0]?.image || item.gallery_images?.[1]?.image || (item.variants && item.variants[0]?.image);
    return candidate ? makeAbsolute(candidate) : null;
  };

  useEffect(() => {
    if (!validCategories.includes(type)) {
      navigate("/equipment");
      return;
    }

    const fetchEquipment = async () => {
      try {
        setLoading(true);

        // Fetch from equipment API with category filter
        const response = await API.get(`/api/equipment/?category=${type}`);
        let products = [];

        if (response.data && Array.isArray(response.data)) {
          products = response.data;
        } else if (response.data && response.data.results) {
          products = response.data.results;
        }

        console.log(`[EquipmentCategory] Loaded ${products.length} ${type} items`);
        setEquipment(products);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {categoryDescription[type] || "Explore premium gym equipment for unmatched performance."}
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
                    {getItemImageUrl(item) ? (
                      <img
                        src={getItemImageUrl(item)}
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
                    <Link 
                      to={`/equipment/${type}/${item.id}`}
                      className="equipment-item-button"
                    >
                      View Details
                    </Link>
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
