import React, { useEffect, useState } from "react";
import "./BlogDetail.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";
import API from "../components/Api";

const BlogDetail = ({ match }) => {
  // With react-router: slug param
  const slug = match?.params?.slug || "";

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      setLoading(true);
      const res = await API.get(`/shop-blogs/?slug=${slug}`);
      setPost(res.data.results ? res.data.results[0] : res.data[0]);
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
