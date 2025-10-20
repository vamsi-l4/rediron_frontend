// src/components/ArticleDetail.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "./Api";
import ArticleCard from "./ArticleCard";
import "./ArticleCard.css";
import "./ArticleDetail.css";

function stripHtml(html = "") {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}
function estimateReadTime(html = "") {
  const words = stripHtml(html).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const scrollerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErrorMsg(null);

    const fetchArticle = async () => {
      try {
        const res = await API.get(`/api/nutrition/${slug}/`);
        if (!mounted) return;
        setArticle(res.data);

        const cat = res.data?.category;
        if (cat) {
          try {
            const r = await API.get("/api/nutrition-list/", {
              params: { category: cat },
            });
            const list = Array.isArray(r.data)
              ? r.data
              : Array.isArray(r.data?.results)
              ? r.data.results
              : [];
            setRelated(list.filter((a) => a.slug !== res.data.slug));
          } catch {
            setRelated([]);
          }
        }
      } catch (err) {
        setArticle(null);
        setErrorMsg("Article not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const img =
    article?.featured_image_url ||
    article?.image_url ||
    "/img/default-article.jpg";
  const dateStr = article?.published_at || article?.created_at;
  const readMins = useMemo(
    () => (article ? estimateReadTime(article.content) : 1),
    [article]
  );

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    } catch {}
  };

  const onShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.excerpt || "",
          url,
        });
      } else {
        await copyLink();
      }
    } catch {
      await copyLink();
    }
  };

  const scrollRelated = (dir = 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="article-page-container">Loading article…</div>
    );
  }

  if (!article) {
    return (
      <div className="article-page-container">
        {errorMsg || "Article not found — redirecting…"}
      </div>
    );
  }

  return (
    <motion.div
      className="article-page-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
    >
      {/* Hero Section */}
      <div className="article-hero-container">
        <img src={img} alt={article.title} className="article-hero-img" />
        <div className="article-hero-overlay">
          <h1 className="article-hero-title">{article.title}</h1>
          <div className="article-meta">
            {dateStr && (
              <span>{new Date(dateStr).toLocaleDateString()}</span>
            )}
            <span>•</span>
            <span>{readMins} min read</span>
            {article.author && (
              <>
                <span>•</span>
                <span>By {article.author}</span>
              </>
            )}
            {article.category && (
              <>
                <span>•</span>
                <button
                  className="category-badge"
                  onClick={() => navigate("/articles/nutrition")}
                >
                  {article.category}
                </button>
              </>
            )}
          </div>
          <div className="article-hero-buttons">
            <button onClick={onShare} className="share-btn">
              Share
            </button>
            <button onClick={copyLink} className="copy-btn">
              Copy link
            </button>
            <button onClick={() => navigate(-1)} className="back-btn-hero">
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Excerpt */}
      {article.excerpt && (
        <p className="article-excerpt-detail">{article.excerpt}</p>
      )}

      {/* Content */}
      <div
        className="article-content-detail"
        dangerouslySetInnerHTML={{ __html: article.content || "" }}
      />

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="related-articles-section">
          <h2>Related Articles</h2>
          <div className="related-articles-wrapper">
            <button
              className="scroll-btn left"
              onClick={() => scrollRelated(-1)}
            >
              ‹
            </button>
            <div ref={scrollerRef} className="related-articles-scroller">
              {related.map((ra) => (
                <div key={ra.slug} className="related-article-card">
                  <ArticleCard article={ra} />
                </div>
              ))}
            </div>
            <button
              className="scroll-btn right"
              onClick={() => scrollRelated(1)}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Back to All */}
      <div className="back-to-all">
        <Link to="/articles/nutrition">← Back to all articles</Link>
      </div>
    </motion.div>
  );
}
