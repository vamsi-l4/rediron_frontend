// src/components/NutritionPage.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "./Api";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ArticleCard from "./ArticleCard";
import "./NutritionPage.css";

export default function NutritionPage() {
  const [articles, setArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const categories = ["All", "Nutrition", "Supplements", "Recipes"];

  const fetchArticles = async (category = null) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const params = {};
      if (category && category !== "All") params.category = category;
      const res = await API.get("/api/nutrition-articles/", { params });
      // DRF pagination returns { count, next, previous, results: [...] }
      const data = res.data && res.data.results ? res.data.results : res.data;
      if (Array.isArray(data)) {
        setArticles(data);
      } else {
        // Unexpected shape -> attempt to read 'results' or fallback to empty
        setArticles(Array.isArray(res.data.results) ? res.data.results : []);
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      setErrorMsg("Failed to load articles. Check backend.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial fetch (All)
    fetchArticles();
  }, []);

  // handle category click: prefer server-side filtering
  const onCategoryClick = (cat) => {
    setActiveCategory(cat);
    if (cat === "All") {
      fetchArticles(null);
    } else {
      fetchArticles(cat);
    }
  };

  // still compute filteredArticles in case server returns unfiltered list
  const filteredArticles =
    activeCategory === "All"
      ? articles
      : articles.filter(
          (a) => a.category && a.category.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <>
      <Navbar />
      <div className="nutrition-container">
        <motion.div
          className="hero-banner"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-overlay">
            <h1 className="hero-title">Fuel Your Gains</h1>
            <p className="hero-subtitle">
              Explore expert advice on nutrition, supplements, and recipes to power your fitness journey.
            </p>
          </div>
        </motion.div>

        <div className="category-tabs" role="tablist" aria-label="Article categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => onCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="articles-grid" aria-live="polite">
          {loading ? (
            <p className="loading-text">Loading articles...</p>
          ) : errorMsg ? (
            <p className="loading-text">{errorMsg}</p>
          ) : filteredArticles.length === 0 ? (
            <p className="no-articles">No articles found in this category.</p>
          ) : (
            <AnimatePresence>
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
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
      <Footer />
    </>
  );
}
