import React, { useEffect, useState } from "react";
import "./ReviewSection.css";
import RatingStars from "./RatingStars";
import API from "../components/Api";

const ReviewSection = ({ productId, reviews: suppliedReviews, onAddReview }) => {
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState(suppliedReviews || []);
  const [form, setForm] = useState({ rating: 0, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (suppliedReviews) {
      setReviews(suppliedReviews);
      return;
    }
    if (!productId) return;

    let active = true;
    API.get(`/api/shop-userreviews/?product=${productId}`)
      .then(res => {
        if (active) setReviews(res.data.results || res.data || []);
      })
      .catch(error => console.error("Failed to load product reviews:", error));

    return () => {
      active = false;
    };
  }, [productId, suppliedReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Number(form.rating)) {
      setMessage("Select a rating before submitting.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      if (onAddReview) {
        await onAddReview(form);
      } else {
        const res = await API.post("/api/shop-userreviews/", {
          product: productId,
          rating: Number(form.rating),
          comment: form.comment
        });
        setReviews(current => [res.data, ...current]);
      }
      setForm({ rating: 0, comment: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Failed to submit review:", error);
      setMessage("Please sign in before submitting a review.");
    } finally {
      setSubmitting(false);
    }
  };

  const avg =
    reviews?.length
      ? (reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
      : "—";

  return (
    <div className="reviewsection-main">
      <div className="reviewsection-header">
        <span className="reviewsection-title">Customer Reviews</span>
        <span className="reviewsection-summary">
          <RatingStars rating={Number(avg)} count={reviews?.length || 0} />
        </span>
        <button
          className="reviewsection-addbtn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Review"}
        </button>
      </div>
      {showForm && (
        <form className="reviewsection-form" onSubmit={handleSubmit}>
          <select
            required
            value={form.rating}
            onChange={e => setForm(f => ({ ...f, rating: e.target.value }))}
          >
            <option value={0}>Rating</option>
            {[5, 4, 3, 2, 1].map(r => (
              <option key={r} value={r}>
                {r} star{r > 1 && "s"}
              </option>
            ))}
          </select>
          <textarea
            required
            value={form.comment}
            onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
            rows={3}
            placeholder="Your review"
          />
          {message && <div className="reviewsection-message">{message}</div>}
          <button type="submit" className="reviewsection-savebtn" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
      <div className="reviewsection-list">
        {reviews?.length === 0 && (
          <div className="reviewsection-empty">No reviews yet.</div>
        )}
        {reviews?.map((r, idx) => (
          <div key={idx} className="reviewsection-item">
            <div className="reviewsection-user">
              <span className="reviewsection-user-initial">
                {(r.name || r.user?.name || r.user?.email)?.[0]?.toUpperCase() || "R"}
              </span>
              <div>
                <span className="reviewsection-user-name">{r.name || r.user?.name || r.user?.email || "Verified customer"}</span>
                <RatingStars rating={Number(r.rating)} />
              </div>
            </div>
            <div className="reviewsection-comment">{r.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
