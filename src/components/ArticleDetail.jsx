// src/components/ArticleDetail.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "./Api";
import ArticleCard from "./ArticleCard";
import "./ArticleCard.css";
import "./ArticleDetail.css";

// Helper to get YouTube/Vimeo embed URL
const getEmbedUrl = (url) => {
  if (!url) return null;
  const s = String(url).trim();
  try {
    const maybeUrl = s.includes("://") ? new URL(s) : new URL(`https://${s}`);
    if (maybeUrl.hostname.includes("youtube") || maybeUrl.hostname.includes("youtu.be")) {
      const v = maybeUrl.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      const parts = maybeUrl.pathname.split("/").filter(Boolean);
      if (parts.length) return `https://www.youtube.com/embed/${parts[parts.length - 1]}`;
    }
    if (maybeUrl.hostname.includes("vimeo")) {
      const idMatch = maybeUrl.pathname.match(/\/(\d+)/);
      if (idMatch) return `https://player.vimeo.com/video/${idMatch[1]}`;
    }
    return s;
  } catch {
    const yt = s.match(/(?:v=|\/embed\/|youtu\.be\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/i);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vm = s.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
    return s;
  }
};

// Helper to format image paths
const formatImage = (imgPath) => {
  const defaultImage = "/img/default-article.jpg";
  if (!imgPath || typeof imgPath !== "string") return defaultImage;
  const path = imgPath.trim();
  if (path.startsWith("http")) return path;
  if (path.startsWith("/media/")) return path;
  if (path.startsWith("media/")) return `/${path}`;
  return `/media/${path.replace(/^\/+/, "")}`;
};

// Helper to parse Markdown-like content into layout sections
const parseSections = (text) => {
  if (!text) return [];
  // Split the text whenever a new line starts with ##
  const parts = text.split(/(?=^##\s)/m).filter(Boolean);
  return parts.map((part) => {
    const lines = part.split("\n");
    let title = lines[0].startsWith("##") ? lines[0].replace(/^##\s*/, "").trim() : "";
    let content = (title ? lines.slice(1) : lines).join("\n").trim();

    // Simple markdown parsing to HTML
    content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    content = content.replace(/^- (.*)$/gm, "<li>$1</li>");
    if (content.includes("<li>")) {
      content = content.replace(/(<li>.*<\/li>)/s, '<ul style="padding-left: 20px;">$1</ul>');
    }
    return { title, content };
  });
};

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

  const img = formatImage(article?.featured_image_url || article?.image_url || article?.featured_image);
  const dateStr = article?.published_at || article?.created_at;
  const readMins = useMemo(
    () => (article ? estimateReadTime(article.content) : 1),
    [article]
  );

  const videoEmbed = getEmbedUrl(article?.video_url || article?.video);
  const sections = parseSections(article?.content || "");
  const hasSections = sections.length > 0 && sections.some((s) => s.title);

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
      <div className="article-detail-container">Loading article…</div>
    );
  }

  if (!article) {
    return (
      <div className="article-detail-container">
        {errorMsg || "Article not found — redirecting…"}
      </div>
    );
  }

  return (
    <motion.main
      className="article-detail-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
    >
      {/* Hero Section */}
      <section className="article-detail-hero">
        <img src={img} alt={article.title} className="article-detail-hero-img" />
        <div className="article-detail-hero-overlay">
          <h1>{article.title}</h1>
          <p className="article-detail-meta">
            {dateStr && (
              <span>{new Date(dateStr).toLocaleDateString()}</span>
            )}
            <span>|</span>
            <span>{readMins} min read</span>
            {article.author && (
              <>
                <span>|</span>
                <span>By {article.author}</span>
              </>
            )}
            {article.category && (
              <>
                <span>|</span>
                <Link
                  className="clickable-category"
                  to="/articles/nutrition"
                >
                  {article.category}
                </Link>
              </>
            )}
          </p>
          <div className="article-detail-hero-buttons">
            <button onClick={onShare} className="article-detail-action-btn share-btn">
              Share
            </button>
            <button onClick={copyLink} className="article-detail-action-btn copy-btn">
              Copy link
            </button>
          </div>
        </div>
      </section>

      <section className="article-detail-content">

      {/* Excerpt */}
      {article.excerpt && (
        <div className="article-detail-section-card">
          <h2>Overview</h2>
          <p>{article.excerpt}</p>
        </div>
      )}

      {/* Content */}
      {hasSections ? (
        sections.map((sec, i) => (
          <div key={i} className="article-detail-section-card">
            {sec.title && <h2>{sec.title}</h2>}
            <div dangerouslySetInnerHTML={{ __html: sec.content }} />
          </div>
        ))
      ) : (
        <div
          className="article-detail-section-card"
          dangerouslySetInnerHTML={{ __html: article.content || "" }}
        />
      )}

      {/* Related Video */}
      {article?.video_url && (
        <div className="article-detail-section-card">
          <h2>Related Video</h2>
          <p>
            <a href={article.video_url} target="_blank" rel="noreferrer">
              Watch the related video
            </a>
          </p>
          {videoEmbed && (
            <div className="article-detail-video">
              <iframe src={videoEmbed} allowFullScreen title="Article Video" />
            </div>
          )}
        </div>
      )}

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
      <div className="article-detail-back">
        <button
          className="article-detail-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back to articles
        </button>
      </div>
      </section>
    </motion.main>
  );
}
