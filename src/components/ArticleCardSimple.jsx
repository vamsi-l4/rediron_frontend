// src/components/ArticleCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./ArticleCard.css";

export default function ArticleCard({ article }) {
  const img =
    article.featured_image_url ||
    article.image_url ||
    "/img/default-article.jpg";

  return (
    <Link to={`/articles/${article.slug}`} className="article-card">
      <div className="article-img">
        <img src={img} alt={article.title} />
        <div className="overlay">
          <span className="category">{article.category}</span>
        </div>
      </div>
      <div className="article-content">
        <h3 className="article-title">{article.title}</h3>
        <p className="article-excerpt">{article.excerpt}</p>
        <div className="article-meta">
          <span>{new Date(article.published_at).toLocaleDateString()}</span>
          {article.author && <span> · {article.author}</span>}
        </div>
      </div>
    </Link>
  );
}
