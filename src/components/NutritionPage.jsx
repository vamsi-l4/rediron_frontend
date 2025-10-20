// src/components/NutritionPage.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "./Api";

import ArticleCard from "./ArticleCard";
import "./NutritionPage.css";

export default function NutritionPage() {
  const [articles, setArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

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

  const filteredArticles =
    activeCategory === "All"
      ? articles
      : articles.filter(
          (a) =>
            a.category &&
            a.category.toLowerCase() === activeCategory.toLowerCase()
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
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="articles-grid" aria-live="polite">
        {loading ? (
          <p className="loading-text">Loading nutrition articles...</p>
        ) : errorMsg ? (
          <p className="loading-text">{errorMsg}</p>
        ) : filteredArticles.length === 0 ? (
          <p className="no-articles">No nutrition articles found.</p>
        ) : (
          <AnimatePresence>
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.slug}
                className="article-card-wrapper"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
