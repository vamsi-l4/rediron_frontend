import React from "react";
import "./RatingStars.css";

const RatingStars = ({ rating, count }) => {
  const stars = [];
  const rounded = Math.round((rating || 0) * 2) / 2; // Half-star steps
  for (let i = 1; i <= 5; i++) {
    if (rounded >= i) {
      stars.push(<span key={i} className="star full">★</span>);
    } else if (rounded >= i - 0.5) {
      stars.push(<span key={i} className="star half">★</span>);
    } else {
      stars.push(<span key={i} className="star empty">☆</span>);
    }
  }

  return (
    <span className="ratingstars-main">
      {stars}
      {typeof rating === "number" && (
        <span className="rating-value">{rating.toFixed(1)}</span>
      )}
      {typeof count === "number" && (
        <span className="rating-count">({count}+)</span>
      )}
    </span>
  );
};

export default RatingStars;
