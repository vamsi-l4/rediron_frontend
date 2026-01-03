import React, { useEffect, useState, useContext } from "react";
import "./Reviews.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";
import API from "../components/Api";
import { AuthContext } from "../contexts/AuthContext";

const Reviews = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await API.get('/api/shop-userreviews/');
        setReviews(res.data.results || res.data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="reviews-main rediron-theme">
      <Header />
      <div className="reviews-content">
        <h2>Product Reviews</h2>
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <h4>{review.product.name}</h4>
                <p>Rating: {review.rating}/5</p>
                <p>{review.comment}</p>
                <small>By: {review.user.email}</small>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reviews">
            <h3>No reviews yet.</h3>
            {isAuthenticated && <a href="/shop" className="shop-link">Start Shopping</a>}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Reviews;
