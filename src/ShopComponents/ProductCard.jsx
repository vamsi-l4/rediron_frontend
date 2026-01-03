import React, { useState, useEffect, useContext, useCallback } from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";
import API from "../components/Api";
import { AuthContext } from "../contexts/AuthContext";

const ProductCard = ({ product }) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // If your product object has nested variant info, adapt as needed
  const img = product.image || (product.variants && product.variants[0]?.image);
  const price = product.price;
  const mrp = product.mrp;
  const discount = product.discount_percent || (mrp && price ? Math.round(100 - (price / mrp) * 100) : 0);
  const rating = product.rating || product.avg_rating;

  const checkWishlistStatus = useCallback(async () => {
    try {
      const res = await API.get('/api/shop-wishlists/');
      const wishlist = res.data.results?.find(w => w.user === user.id);
      if (wishlist) {
        const itemRes = await API.get(`/api/shop-wishlistitems/?wishlist=${wishlist.id}&product=${product.id}`);
        setInWishlist(itemRes.data.results?.length > 0);
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  }, [user, product.id]);

  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    }
  }, [user, checkWishlistStatus]);

  const toggleWishlist = async () => {
    if (!user) {
      alert('Please login to add to wishlist');
      return;
    }
    setActionLoading(true);
    try {
      let wishlist;
      const wishlistRes = await API.get('/api/shop-wishlists/');
      wishlist = wishlistRes.data.results?.find(w => w.user === user.id);

      if (!wishlist) {
        const createRes = await API.post('/api/shop-wishlists/', {});
        wishlist = createRes.data;
      }

      if (inWishlist) {
        const itemRes = await API.get(`/api/shop-wishlistitems/?wishlist=${wishlist.id}&product=${product.id}`);
        const item = itemRes.data.results?.[0];
        if (item) {
          await API.delete(`/api/shop-wishlistitems/${item.id}/`);
        }
      } else {
        await API.post('/api/shop-wishlistitems/', {
          wishlist: wishlist.id,
          product: product.id
        });
      }
      setInWishlist(!inWishlist);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Error updating wishlist');
    }
    setActionLoading(false);
  };

  return (
    <div className="productcard-main">
      <div className="productcard-wishlist">
        <button
          onClick={toggleWishlist}
          disabled={actionLoading}
          className="wishlist-btn"
        >
          {inWishlist ? '❤️' : '🤍'}
        </button>
      </div>
      <Link to={`/shop-products/${product.id}`} className="productcard-img-link">
        <img src={img} alt={product.name} className="productcard-img" />
      </Link>
      <div className="productcard-content">
        <Link to={`/shop-products/${product.id}`} className="productcard-title">
          {product.name}
        </Link>
        {product.variant_name &&
          <div className="productcard-variant">{product.variant_name}</div>
        }
        <div className="productcard-price-row">
          <span className="productcard-price">
            ₹{price?.toLocaleString()}
          </span>
          {mrp && (
            <span className="productcard-mrp">₹{mrp?.toLocaleString()}</span>
          )}
          {discount > 0 && (
            <span className="productcard-discount">{discount}% off</span>
          )}
        </div>
        {typeof rating === "number" && (
          <div className="productcard-rating">
            <span className="star">★</span> {rating?.toFixed(1)}
          </div>
        )}
        <Link to={`/shop-products/${product.id}`}>
          <button className="productcard-cart-btn">View / Add to Cart</button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
