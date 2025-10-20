// src/components/WorkoutArticles.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "./Api";
import Navbar from "./Navbar";
import ArticleCard from "./ArticleCard";
import "./NutritionPage.css"; // reuse same CSS

export default function WorkoutArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category"); // "Workout Tips" or "Fitness"

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const params = { section: "Workout" }; // filter only workout section
      if (category) params.category = category;

      const res = await API.get("/api/articles/", { params });
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.results)
        ? res.data.results
        : [];
      setArticles(data);
    } catch (err) {
      console.error("Error fetching workout articles:", err);
      setErrorMsg("Failed to load workout articles. Check backend.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

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
            <h1 className="hero-title">
              {category ? `${category} Articles` : "Workout Articles"}
            </h1>
            <p className="hero-subtitle">
              Explore expert articles curated for your workout journey.
            </p>
          </div>
        </motion.div>

        <div className="articles-grid">
          {loading ? (
            <p className="loading-text">Loading workout articles...</p>
          ) : errorMsg ? (
            <p className="loading-text">{errorMsg}</p>
          ) : articles.length === 0 ? (
            <p className="no-articles">No workout articles found.</p>
          ) : (
            <AnimatePresence>
              {articles.map((article, index) => (
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
    </>
  );
}
