// src/components/WorkoutArticles.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import API from "./Api";
import Navbar from "./Navbar";
import ArticleCard from "./ArticleCard";
import "./NutritionPage.css"; // reuse same CSS

export default function WorkoutArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
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
      <div className="rediron-nutrition-container" style={{ backgroundColor: "#000000", minHeight: "100vh", position: "relative" }}>
        <button className="rediron-nutrition-back-btn" onClick={() => navigate(-1)} aria-label="Go Back">
          <ArrowLeft size={24} />
        </button>
        <motion.div
          className="rediron-nutrition-hero"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="rediron-nutrition-hero-overlay">
            <h1 className="rediron-nutrition-title">
              {category ? `${category} Articles` : "Workout Articles"}
            </h1>
            <p className="rediron-nutrition-subtitle">
              Explore expert articles curated for your workout journey.
            </p>
          </div>
        </motion.div>

        <div className="rediron-nutrition-body" style={{ marginTop: '3rem' }}>
          <div className="rediron-nutrition-grid">
          {loading ? (
              <div className="rediron-nutrition-message"><div className="rediron-nutrition-spinner"></div><p>Loading workout articles...</p></div>
          ) : errorMsg ? (
              <div className="rediron-nutrition-message error"><p>{errorMsg}</p></div>
          ) : articles.length === 0 ? (
              <div className="rediron-nutrition-message"><p>No workout articles found.</p></div>
          ) : (
            <AnimatePresence>
              {articles.map((article, index) => (
                <motion.div
                  key={article.slug}
                  className="rediron-nutrition-card-wrapper"
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
      </div>
    </>

  );
}
