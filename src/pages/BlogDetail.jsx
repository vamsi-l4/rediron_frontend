import React, { useEffect, useState } from "react";
import "./BlogDetail.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";

const API_BASE = "http://localhost:8000/api";

const BlogDetail = ({ match }) => {
  // With react-router: slug param
  const slug = match?.params?.slug || "";

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      setLoading(true);
      const res = await fetch(`${API_BASE}/shop-blogs/?slug=${slug}`);
      const json = await res.json();
      setPost(json.results ? json.results[0] : json[0]);
      setLoading(false);
    }
    fetchBlog();
  }, [slug]);

  if (loading || !post) return <Loader />;

  return (
    <div className="blogdetail-main rediron-theme">
      <Header />
      <div className="blogdetail-content">
        <div className="blogdetail-title">{post.title}</div>
        <div className="blogdetail-meta">
          <span>
            {new Date(post.published_at).toLocaleDateString()}
          </span>
          {post.author && (
            <span>
              {" "} | By <b>{post.author}</b>
            </span>
          )}
          {post.tags && (
            <span className="blogdetail-tags">| {post.tags}</span>
          )}
        </div>
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="blogdetail-img"
          />
        )}
        <div className="blogdetail-body">
          {post.content.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetail;
