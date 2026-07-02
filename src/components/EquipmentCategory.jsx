import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API, { makeAbsolute } from './Api';
import { ArrowLeft } from 'lucide-react';
import './EquipmentCategory.css';

const EquipmentCategory = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const validCategories = useMemo(() => ["cardio", "strength", "core"], []);

  const getImage = (item) => {
    const img = item.image2 || item.image || item.gallery_images?.[0]?.image || item.gallery_images?.[1]?.image || item.variants?.[0]?.image;
    return img ? makeAbsolute(img) : null;
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
        let data = [];
        if (response.data && Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && response.data.results) {
          data = response.data.results;
        }
        setEquipment(data);
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="rediron-eqcat-page" style={{ position: "relative" }}>
      <button className="rediron-eqcat-back-btn" onClick={() => navigate("/equipment")} aria-label="Back to Equipment">
        <ArrowLeft size={24} />
      </button>
      <div className="rediron-eqcat-content">
        <motion.div className="rediron-eqcat-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="rediron-eqcat-title">
            {{ cardio: "Cardio Equipment", strength: "Strength Equipment", core: "Core Equipment" }[type] || "Equipment"}
          </h1>
          <p className="rediron-eqcat-subtitle">
            {{ cardio: "High-performance cardio equipment built for stamina, speed, and endurance.", strength: "Power-packed strength systems designed for heavy lifts and muscle growth.", core: "Precision core training tools for stability, balance, and athletic performance." }[type] || "Explore premium gym equipment for unmatched performance."}
          </p>
        </motion.div>

        <div className="rediron-eqcat-body">
          {loading ? (
            <div className="rediron-eqcat-loading">
              <div className="rediron-eqcat-spinner"></div>
              <p>Loading equipment...</p>
            </div>
          ) : error ? (
            <div className="rediron-eqcat-error">
              <p>{error}</p>
            </div>
          ) : equipment.length === 0 ? (
            <div className="rediron-eqcat-empty">
              <p>No equipment available in this category yet.</p>
            </div>
          ) : (
            <motion.div className="rediron-eqcat-grid" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }} initial="hidden" animate="visible">
              {equipment.map((item) => (
                <motion.div key={item.id} className="rediron-eqcat-item" variants={cardVariants} whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.3 }}>
                  <div className="rediron-eqcat-image-wrapper">
                    {getImage(item) ? (
                      <img src={getImage(item)} alt={item.name} className="rediron-eqcat-image" loading="lazy" />
                    ) : (
                      <div className="rediron-eqcat-placeholder">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="rediron-eqcat-item-content">
                    <h3 className="rediron-eqcat-name">{item.name}</h3>
                    {item.usage && <p className="rediron-eqcat-usage">{item.usage}</p>}
                    <Link to={`/equipment/${type}/${item.id}`} className="rediron-eqcat-button">View Details</Link>
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
