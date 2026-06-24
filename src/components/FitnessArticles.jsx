import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import API, { makeAbsolute } from "./Api";
import "./FitnessArticles.css";

const getImage = (article) => {
  const featuredImageUrl = article?.featuredImage?.imageUrl || article?.featured_image_url;
  const imageUrl = article?.image_url || article?.imageUrl;
  return makeAbsolute(featuredImageUrl || imageUrl) || "/logo.png";
};


export default function FitnessArticles() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    const loadArticles = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await API.get("/api/fitness-articles/");
        const list = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.results) ? res.data.results : [];
        if (mounted) setArticles(list);
      } catch {
        if (mounted) {
          setArticles([]);
          setErrorMsg("Failed to load fitness articles.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadArticles();
    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const discovered = articles.map((item) => item.category).filter(Boolean);
    return ["All", ...Array.from(new Set(discovered))];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCategory = activeCategory === "All" || article.category === activeCategory;
const matchesSearch =
        !query ||
        `${article.title} ${article.overview || article.excerpt || ""} ${article.category}`
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [articles, activeCategory, search]);

  return (
    <div className="fitness-article-page">
      <button className="fitness-article-back" onClick={() => navigate(-1)} aria-label="Go Back">
        <ArrowLeft size={22} />
      </button>

      <motion.header
        className="fitness-article-landing-header"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <span className="fitness-article-kicker">RedIron Fitness Articles</span>
        <h1>Fitness</h1>
        <p>Science-backed training, recovery, fat loss, and performance guides built for real gym progress.</p>
      </motion.header>

      <div className="fitness-article-toolbar">
        <div className="fitness-article-tabs" role="tablist" aria-label="Fitness article categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`fitness-article-tab ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <label className="fitness-article-search">
          <Search size={17} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search articles" />
        </label>
      </div>

      <main className="fitness-article-list" aria-live="polite">
        {loading ? (
          <div className="fitness-article-state">Loading fitness articles...</div>
        ) : errorMsg ? (
          <div className="fitness-article-state error">{errorMsg}</div>
        ) : filteredArticles.length === 0 ? (
          <div className="fitness-article-state">No fitness articles found.</div>
        ) : (
          <motion.div
            className="fitness-article-grid"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {filteredArticles.map((article) => (
              <motion.article
                key={article.id || article.slug}
                className="fitness-article-card"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/articles/fitness/${article.slug}`)}
              >
                <div className="fitness-article-card-image">
                  <img src={getImage(article)} alt={article.title} loading="lazy" onError={(event) => { event.currentTarget.src = "/logo.png"; }} />
                  <span>{article.category}</span>
                </div>
                <div className="fitness-article-card-body">
                  <h2>{article.title}</h2>
<p>{article.excerpt || article.overview || ""}</p>

                  <button type="button" className="fitness-article-read-more">
                    Read More <ArrowRight size={16} />
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
