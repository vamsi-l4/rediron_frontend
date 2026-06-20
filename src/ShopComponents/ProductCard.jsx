import React, { useState, useEffect, useContext, useCallback } from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import API, { makeAbsolute } from "../components/Api";
import { AuthContext } from "../contexts/AuthContext";

const ProductCard = ({ product }) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  // If your product object has nested variant info, adapt as needed
  const img = makeAbsolute(

    product.image2 ||
    product.image ||
    product.gallery_images?.[0]?.image ||
    (product.variants && product.variants[0]?.image)
  );
  const price = product.price;
  const mrp = product.mrp;
  const discount = product.discount_percent || (mrp && price ? Math.round(100 - (price / mrp) * 100) : 0);
  const rating = product.rating || product.avg_rating;

  const checkWishlistStatus = useCallback(async () => {
    try {
      const res = await API.get('/api/shop-wishlists/');
      const wishlist = res.data.results ? res.data.results[0] : res.data?.[0];
      if (wishlist) {
        const itemRes = await API.get(`/api/shop-wishlistitems/?wishlist=${wishlist.id}&product=${product.id}`);
        const items = itemRes.data.results || itemRes.data || [];
        setInWishlist(items.some(item => item.product?.id === product.id || item.product === product.id));
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  }, [product.id]);

  useEffect(() => {
    if (isAuthenticated) {
      checkWishlistStatus();
    }
  }, [isAuthenticated, checkWishlistStatus]);

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      alert('Please login to add to wishlist');
      return;
    }
    setActionLoading(true);
    try {
      let wishlist;
      const wishlistRes = await API.get('/api/shop-wishlists/');
      wishlist = wishlistRes.data.results ? wishlistRes.data.results[0] : wishlistRes.data?.[0];

      if (!wishlist) {
        const createRes = await API.post('/api/shop-wishlists/', {});
        wishlist = createRes.data;
      }

      if (inWishlist) {
        const itemRes = await API.get(`/api/shop-wishlistitems/?wishlist=${wishlist.id}&product=${product.id}`);
        const items = itemRes.data.results || itemRes.data || [];
        const item = items.find(row => row.product?.id === product.id || row.product === product.id);
        if (item) {
          await API.delete(`/api/shop-wishlistitems/${item.id}/`);
        }
      } else {
        await API.post('/api/shop-wishlistitems/', {
          wishlist: wishlist.id,
          product_id: product.id
        });
      }
      setInWishlist(!inWishlist);
      window.dispatchEvent(new Event('wishlistUpdated'));
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
          className={`productcard-wishlist-btn ${inWishlist ? 'active' : ''}`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          type="button"
        >
          <Heart size={18} strokeWidth={2.2} fill={inWishlist ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      </div>
      <Link to={`/shop-products/${product.id}`} className="productcard-img-link">
        <div className="productcard-image-wrapper">
          <img
            src={img}
            alt={product.name}
            className="productcard-img"
            loading="lazy"
          />
        </div>
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
            <Star className="productcard-star" size={15} fill="currentColor" aria-hidden="true" />
            {rating?.toFixed(1)}
          </div>
        )}
        <Link to={`/shop-products/${product.id}`} className="productcard-action-link">
          <span className="productcard-cart-btn"><ShoppingBag size={16} /> View Product</span>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
