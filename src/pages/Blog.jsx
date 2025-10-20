import React, { useEffect, useState } from "react";
import "./Blog.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";

const API_BASE = "http://localhost:8000/api";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      let endpoint = `${API_BASE}/shop-blogs/?page=${page}`;
      if (catFilter) endpoint += `&tags=${catFilter}`;
      const res = await fetch(endpoint);
      const json = await res.json();
      setPosts(json.results ? json.results : json);
      setPageCount(json.count ? Math.ceil(json.count / 10) : 1);
      setLoading(false);
    }
    fetchPosts();
  }, [catFilter, page]);

  if (loading) return <Loader />;

  return (
    <div className="blog-main rediron-theme">
      <Header />
      <div className="blog-title">Rediron Gym – Fitness Blog</div>
      <div className="blog-content">
        {/* Sidebar: Tag/category filter */}
        <div className="blog-sidebar">
          <h3>Categories</h3>
          <button onClick={() => setCatFilter("")} className={!catFilter ? "active" : ""}>All</button>
          <button onClick={() => setCatFilter("Protein")} className={catFilter === "Protein" ? "active" : ""}>Protein</button>
          <button onClick={() => setCatFilter("Workout")} className={catFilter === "Workout" ? "active" : ""}>Workout</button>
          <button onClick={() => setCatFilter("Nutrition")} className={catFilter === "Nutrition" ? "active" : ""}>Nutrition</button>
          <button onClick={() => setCatFilter("Ayurveda")} className={catFilter === "Ayurveda" ? "active" : ""}>Ayurveda</button>
        </div>
        {/* Main blog post list */}
        <div className="blog-list">
          {posts.length === 0 ? (
            <div className="blog-empty">No blog posts found.</div>
          ) : (
            posts.map(post => (
              <a href={`/shop-blogs/${post.slug}`} key={post.id} className="blog-card">
                <img src={post.image || "/imgs/blog-default.jpg"} alt={post.title} className="blog-card-img" />
                <div className="blog-card-content">
                  <div className="blog-card-title">{post.title}</div>
                  <div className="blog-card-meta">
                    <span className="blog-card-date">{new Date(post.published_at).toLocaleDateString()}</span>
                    {post.tags && <span className="blog-card-tags">{post.tags}</span>}
                  </div>
                  <div className="blog-card-desc">
                    {post.content.length > 160 ? post.content.substring(0, 157) + "..." : post.content}
                  </div>
                  <span className="blog-read-more">Read More &rarr;</span>
                </div>
              </a>
            ))
          )}
          {/* Pagination */}
          {pageCount > 1 && (
            <div className="blog-pagination">
              {Array.from({length: pageCount}).map((_, idx) => (
                <button
                  key={idx + 1}
                  className={page === idx + 1 ? "active" : ""}
                  onClick={() => setPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
