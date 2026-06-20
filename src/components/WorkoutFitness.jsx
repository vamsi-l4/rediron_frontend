import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import API from "./Api";
import Pagination from "./Pagination";
import "./NutritionPage.css"; // Reuse the perfect Nutrition UI

export default function WorkoutFitness() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const fetchItems = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await API.get("/api/workout-articles/", {
        params: { category: "Fitness", ordering: "-published_at" },
      });
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.results)
        ? res.data.results
        : [];
      setArticles(list);
    } catch (e) {
      console.error("Error fetching fitness articles:", e);
      setErrorMsg("Failed to load fitness articles. Check backend.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const pageCount = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="rediron-nutrition-container" style={{ backgroundColor: "#000000", minHeight: "100vh", position: "relative" }}>
      <button className="rediron-nutrition-back-btn" onClick={() => navigate(-1)} aria-label="Go Back">
          <ArrowLeft size={24} />
        </button>

      {/* Hero Section */}
      <motion.div
        className="rediron-nutrition-hero"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="rediron-nutrition-hero-overlay">
          <h1 className="rediron-nutrition-title">Fitness</h1>
          <p className="rediron-nutrition-subtitle">
            Fitness articles — training, recovery, and lifestyle.
          </p>
        </div>
      </motion.div>

      {/* Articles Grid */}
      <div className="rediron-nutrition-body" aria-live="polite" style={{ marginTop: '2rem' }}>
        {loading ? (
          <div className="rediron-nutrition-message">
            <div className="rediron-nutrition-spinner"></div>
            <p>Loading fitness articles...</p>
          </div>
        ) : errorMsg ? (
          <div className="rediron-nutrition-message error">
            <p>{errorMsg}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="rediron-nutrition-message">
            <p>No fitness articles found.</p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              className="rediron-nutrition-grid"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
              }}
              initial="hidden"
              animate="visible"
            >
              {paginatedArticles.map((article) => {
                const imageUrl = article.image_url || article.featured_image_url || article.featured_image || "/img/default-article.jpg";
                return (
                  <motion.div
                    key={article.slug || article.id}
                    className="rediron-nutrition-card"
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
                    }}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                    exit={{ opacity: 0 }}
                    onClick={() => navigate(`/article/${article.slug}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="rediron-nutrition-img-wrap">
                      <img
                        src={imageUrl.startsWith("http") ? imageUrl : `${API.defaults?.baseURL || ""}${imageUrl}`}
                        alt={article.title || article.name}
                        className="rediron-nutrition-img"
                        loading="lazy"
                      />
                    </div>
                    <div className="rediron-nutrition-content">
                      <h3 className="rediron-nutrition-name">{article.title || article.name}</h3>
                      {article.excerpt && <p className="rediron-nutrition-excerpt">{article.excerpt}</p>}
                      <span className="rediron-nutrition-btn">Read More</span>
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
