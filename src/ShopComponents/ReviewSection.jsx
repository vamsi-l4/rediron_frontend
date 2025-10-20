import React, { useState } from "react";
import "./ReviewSection.css";
import RatingStars from "./RatingStars"; // Adjust path as needed

const ReviewSection = ({ reviews, onAddReview }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 0, comment: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAddReview) onAddReview(form);
    setForm({ name: "", rating: 0, comment: "" });
    setShowForm(false);
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
          <input
            type="text"
            value={form.name}
            required
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Your Name"
          />
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
          <button type="submit" className="reviewsection-savebtn">
            Submit Review
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
                {r.name?.[0]?.toUpperCase() || "?"}
              </span>
              <div>
                <span className="reviewsection-user-name">{r.name}</span>
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
