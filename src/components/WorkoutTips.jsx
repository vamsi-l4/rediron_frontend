import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Search } from "lucide-react";
import API, { makeAbsolute } from "./Api";
import Pagination from "./Pagination";
import "./WorkoutTips.css";

const FALLBACK_CATEGORIES = ["All", "Beginner", "Form", "Recovery", "Strength", "Advanced"];
const ITEMS_PER_PAGE = 12;

const getImage = (tip) => makeAbsolute(tip.thumbnail || tip.image_url || tip.featured_image_url) || "/logo.png";

export default function WorkoutTips() {
  const [tips, setTips] = useState([]);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const loadCategories = async () => {
      try {
        const res = await API.get("/api/workout-tips/categories/");
        if (mounted && Array.isArray(res.data) && res.data.length) {
          setCategories(res.data);
        }
      } catch {
        if (mounted) setCategories(FALLBACK_CATEGORIES);
      }
    };
    loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadTips = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const params = {
          page: currentPage,
          page_size: ITEMS_PER_PAGE,
        };
        if (activeCategory !== "All") params.category = activeCategory;
        if (search.trim()) params.search = search.trim();
        const res = await API.get("/api/workout-tips/", { params });
        if (!mounted) return;
        const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
        setTotalCount(Array.isArray(res.data) ? data.length : res.data?.count || data.length);
        setTips(data);
      } catch (error) {
        if (mounted) {
          setErrorMsg("Failed to load workout tips. Check backend.");
          setTips([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadTips();
    return () => {
      mounted = false;
    };
  }, [activeCategory, currentPage, search]);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  }, [totalCount]);

  const handleCategory = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="workoutTips-container">
      <button className="workoutTips-backButton" onClick={() => navigate(-1)} aria-label="Go Back">
        <ArrowLeft size={22} />
      </button>

      <motion.header
        className="workoutTips-header"
        initial={{ opacity: 0, y: -22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <h1 className="workoutTips-title">Workout Tips</h1>
        <p className="workoutTips-subtitle">
          Short, practical tips to improve form, recovery and progress.
        </p>
      </motion.header>

      <div className="workoutTips-toolbar">
        <div className="workoutTips-categories" role="tablist" aria-label="Workout tip categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`workoutTips-categoryPill ${activeCategory === category ? "active" : ""}`}
              onClick={() => handleCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
        <label className="workoutTips-search">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search tips..."
          />
        </label>
      </div>

      <main className="workoutTips-body" aria-live="polite">
        {loading ? (
          <div className="workoutTips-state">Loading workout tips...</div>
        ) : errorMsg ? (
          <div className="workoutTips-state error">{errorMsg}</div>
        ) : tips.length === 0 ? (
          <div className="workoutTips-state">No workout tips found.</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${currentPage}-${search}`}
              className="workoutTips-grid"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
              }}
            >
              {tips.map((tip) => (
                <motion.article
                  key={tip.id || tip.slug}
                  className="workoutTips-card"
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
                  }}
                  whileHover={{ y: -6 }}
                  onClick={() => navigate(`/articles/workout-tips/${tip.slug}`)}
                >
                  <div className="workoutTips-cardImageWrap">
                    <img
                      className="workoutTips-cardImage"
                      src={getImage(tip)}
                      alt={tip.title}
                      loading="lazy"
                      onError={(event) => { event.currentTarget.src = "/logo.png"; }}
                    />
                    <span className="workoutTips-badge">{tip.category}</span>
                  </div>
                  <div className="workoutTips-cardContent">
                    <h2>{tip.title}</h2>
                    <p>{tip.excerpt || tip.overview}</p>
                    <div className="workoutTips-cardMeta">
                      <span><Calendar size={14} /> {new Date(tip.published_at || "2026-01-01").toLocaleDateString()}</span>
                      <strong>Read More <ArrowRight size={14} /></strong>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && !errorMsg && tips.length > 0 && pageCount > 1 && (
          <Pagination page={currentPage} pageCount={pageCount} onPage={setCurrentPage} />
        )}
      </main>
    </div>
  );
}
