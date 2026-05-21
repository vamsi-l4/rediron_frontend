// src/components/NutritionPage.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "./Api";
import Pagination from "./Pagination";

import "./NutritionPage.css";

export default function NutritionPage() {
  const [articles, setArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const categories = ["All", "Nutrition", "Supplements", "Recipes"];

  const fetchArticles = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await API.get("/api/nutrition-list/");
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.results)
        ? res.data.results
        : [];
      setArticles(data);
    } catch (err) {
      console.error("Error fetching nutrition articles:", err);
      setErrorMsg("Failed to load nutrition articles. Check backend.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const filteredArticles =
    activeCategory === "All"
      ? articles
      : articles.filter(
          (a) =>
            a.category &&
            a.category.toLowerCase() === activeCategory.toLowerCase()
        );

  const pageCount = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="nutrition-container">
      {/* Hero Section */}
      <motion.div
        className="hero-banner"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-overlay">
          <h1 className="hero-title">Fuel Your Gains</h1>
          <p className="hero-subtitle">
            Expert advice on nutrition, supplements, and recipes to power your fitness journey.
          </p>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <div className="category-tabs" role="tablist" aria-label="Article categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tab-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="equipment-body" aria-live="polite">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading nutrition articles...</p>
          </div>
        ) : errorMsg ? (
          <div className="error-state">
            <p>{errorMsg}</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="empty-state">
            <p>No nutrition articles found.</p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              className="equipment-grid"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
              }}
              initial="hidden"
              animate="visible"
            >
              {paginatedArticles.map((article, index) => {
                const imageUrl = article.image_url || article.featured_image_url || article.featured_image || "/img/default-article.jpg";
                return (
                  <motion.div
                    key={article.slug}
                    className="equipment-item"
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
                    }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    exit={{ opacity: 0 }}
                    onClick={() => navigate(`/article/${article.slug}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="equipment-item-image-wrapper">
                      <img
                        src={imageUrl.startsWith("http") ? imageUrl : `${API.defaults?.baseURL || ""}${imageUrl}`}
                        alt={article.title}
                        className="equipment-item-image"
                        loading="lazy"
                      />
                      <div className="equipment-item-overlay"></div>
                    </div>
                    <div className="equipment-item-content">
                      <h3 className="equipment-item-name">{article.title}</h3>
                      {article.excerpt && <p className="equipment-item-usage">{article.excerpt}</p>}
                      <button className="equipment-item-button">Read More</button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
        
        {/* Pagination Controls */}
        {pageCount > 1 && !loading && !errorMsg && (
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            onPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
