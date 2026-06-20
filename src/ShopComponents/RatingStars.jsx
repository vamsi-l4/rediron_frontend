import React from "react";
import "./RatingStars.css";
import { Star } from "lucide-react";

const RatingStars = ({ rating, count }) => {
  const stars = [];
  const rounded = Math.round((rating || 0) * 2) / 2; // Half-star steps
  for (let i = 1; i <= 5; i++) {
    if (rounded >= i) {
      stars.push(<Star key={i} className="ratingstars-star full" size={18} fill="currentColor" aria-hidden="true" />);
    } else if (rounded >= i - 0.5) {
      stars.push(<Star key={i} className="ratingstars-star half" size={18} fill="currentColor" aria-hidden="true" />);
    } else {
      stars.push(<Star key={i} className="ratingstars-star empty" size={18} aria-hidden="true" />);
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
