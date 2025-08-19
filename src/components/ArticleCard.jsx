import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./ArticleCard.css";

export default function ArticleCard({ article, onReadMore }) {
  const img =
    article.image_url ||
    article.featured_image_url ||
    article.featured_image ||
    "/img/default-article.jpg";

  const dateStr = article.published_at || article.created_at || null;

  return (
    <motion.div
      className="article-card"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 140, damping: 12 }}
      layout
      onClick={onReadMore}
    >
      <img className="article-image" src={img} alt={article.title} />
      <div className="card-content">
        <p className="article-date">
          {dateStr ? new Date(dateStr).toLocaleDateString() : ""}
        </p>
        <h3 className="article-title">{article.title}</h3>
        {article.excerpt && <p className="excerpt">{article.excerpt}</p>}
        <Link
          to={`/article/${article.id}`}
          className="read-more-link"
          onClick={(e) => e.stopPropagation()}
        >
          Read More <span className="link-icon">→</span>
        </Link>
      </div>
    </motion.div>
  );
}
