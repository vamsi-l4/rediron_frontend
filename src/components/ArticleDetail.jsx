import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "./Api";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./ArticleCard.css";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    API.get(`/api/nutrition-articles/${id}/`)
      .then((res) => setArticle(res.data))
      .catch((err) => {
        console.error("Error fetching article:", err);
        if (err.response && err.response.status === 404) {
          setTimeout(() => navigate("/articles"), 1500);
        }
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="article-page-container">
          <p>Loading article…</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Navbar />
        <div className="article-page-container">
          <p>Article not found — redirecting...</p>
        </div>
        <Footer />
      </>
    );
  }

  const img =
    article.image_url || article.featured_image_url || "/img/default-article.jpg";

  return (
    <>
      <Navbar />
      <div className="article-page-container">
        <div className="article-header">
          <h1 className="article-title">{article.title}</h1>
          {article.excerpt && <p>{article.excerpt}</p>}
        </div>

        <img
          src={img}
          alt={article.title}
          style={{
            width: "100%",
            maxHeight: 480,
            objectFit: "cover",
            borderRadius: 12,
          }}
        />

        <div
          style={{ marginTop: 20, color: "#ddd" }}
          dangerouslySetInnerHTML={{ __html: article.content || "" }}
        />
      </div>
      <Footer />
    </>
  );
}
