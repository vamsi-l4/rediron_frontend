import React, { useCallback, useContext, useEffect, useState } from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import API, { makeAbsolute } from "../components/Api";
import { AuthContext } from "../contexts/AuthContext";
import { addProductToCart } from "../lib/shopCart";
import { addProductToWishlist, fetchWishlistItems, getCurrentWishlist, getOrCreateWishlist } from "../lib/shopWishlist";

const ProductCard = ({ product }) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  const img = makeAbsolute(product.image || product.featured_image_url || product.gallery_images?.[0]?.image);
  const price = Number(product.price || 0);
  const mrp = Number(product.mrp || 0);
  const discount = product.discount_percent || (mrp && price ? Math.round(100 - (price / mrp) * 100) : 0);
  const rating = Number(product.rating || product.avg_rating || 0);
  const stock = Number(product.stock || 0);
  const brandName = product.brand?.name || product.brand_name || "";
  const categoryName = product.category?.name || "";
  const description = product.short_description || product.description || "";
  const isAvailable = product.in_stock ?? (product.is_active && stock > 0);

  const checkWishlistStatus = useCallback(async () => {
    try {
      const wishlist = await getCurrentWishlist();
      if (wishlist) {
        const items = await fetchWishlistItems(wishlist.id, product.id);
        setInWishlist(items.some(item => item.product?.id === product.id || item.product === product.id));
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  }, [product.id]);

  useEffect(() => {
    if (isAuthenticated) checkWishlistStatus();
  }, [isAuthenticated, checkWishlistStatus]);

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      alert('Please login to add to wishlist');
      return;
    }
    setActionLoading(true);
    try {
      const wishlist = await getOrCreateWishlist();
      if (inWishlist) {
        const items = await fetchWishlistItems(wishlist.id, product.id);
        const item = items.find(row => row.product?.id === product.id || row.product === product.id);
        if (item) await API.delete(`/api/shop-wishlistitems/${item.id}/`);
      } else {
        await addProductToWishlist(product.id);
      }
      setInWishlist(!inWishlist);
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Error updating wishlist');
    } finally {
      setActionLoading(false);
    }
  };

  const addToCart = async () => {
    if (!isAvailable) {
      alert('This product is currently out of stock.');
      return;
    }
    setActionLoading(true);
    try {
      await addProductToCart({ productId: product.id, quantity: 1 });
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Added to cart.');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add to cart.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <article className="productcard-main">
      <div className="productcard-badges">
        {discount > 0 && <span className="productcard-discount-badge">{discount}% OFF</span>}
        {categoryName && <span className="productcard-category-badge">{categoryName}</span>}
      </div>

      <button
        onClick={toggleWishlist}
        disabled={actionLoading}
        className={`productcard-wishlist-btn ${inWishlist ? 'active' : ''}`}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        type="button"
      >
        <Heart size={18} strokeWidth={2.2} fill={inWishlist ? 'currentColor' : 'none'} aria-hidden="true" />
      </button>

      <Link to={`/shop-products/${product.id}`} className="productcard-img-link">
        <div className="productcard-image-wrapper">
          <img src={img || "/assets/placeholder.png"} alt={product.name} className="productcard-img" loading="lazy" />
        </div>
      </Link>

      <div className="productcard-content">
        {brandName && <div className="productcard-brand">{brandName}</div>}
        <Link to={`/shop-products/${product.id}`} className="productcard-title">{product.name}</Link>
        {description && <p className="productcard-desc">{description}</p>}

        <div className="productcard-rating-row">
          <span className="productcard-rating">
            <Star className="productcard-star" size={15} fill="currentColor" aria-hidden="true" />
            {rating ? rating.toFixed(1) : "New"}
          </span>
          <span className={isAvailable ? "productcard-stock in" : "productcard-stock out"}>
            {isAvailable ? "In stock" : "Out of stock"}
          </span>
        </div>

        <div className="productcard-price-row">
          <span className="productcard-price">₹{price.toLocaleString()}</span>
          {mrp > price && <span className="productcard-mrp">₹{mrp.toLocaleString()}</span>}
        </div>

        <div className="productcard-actions">
          <button className="productcard-cart-btn" type="button" onClick={addToCart} disabled={actionLoading || !isAvailable}>
            <ShoppingBag size={16} /> Add
          </button>
          <Link to={`/shop-products/${product.id}`} className="productcard-view-btn" aria-label={`View ${product.name}`}>
            <Eye size={16} /> View
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
