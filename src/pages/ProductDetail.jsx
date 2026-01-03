import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ProductDetail.css';

import Header from '../ShopComponents/Header';
import Footer from '../ShopComponents/Footer';
import RatingStars from '../ShopComponents/RatingStars';
import ReviewSection from '../ShopComponents/ReviewSection';
import Loader from '../ShopComponents/Loader';
import ProductCard from '../ShopComponents/ProductCard';
import API from '../components/Api';
import { AuthContext } from '../contexts/AuthContext';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Get product ID from URL
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    async function fetchProduct() {
      const res = await API.get(`/api/shop-products/${id}/`);
      const prod = res.data;
      setProduct(prod);
      setSelectedVariant(prod.variants && prod.variants.length > 0 ? prod.variants[0] : null);

      // Fetch related products (same category, different ID)
      const relRes = await API.get(`/api/shop-products/?category=${prod.category.id}&page=1`);
      const relProd = relRes.data;
      setRelated(relProd.results ? relProd.results.filter(p => p.id !== prod.id).slice(0, 6) : []);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  // Check if product is in wishlist
  useEffect(() => {
    if (isAuthenticated && product) {
      async function checkWishlist() {
        try {
          const res = await API.get('/api/shop-wishlists/');
          if (res.data.length > 0) {
            const wishlist = res.data[0]; // Assuming one wishlist per user
            const item = wishlist.items.find(item => item.product === product.id);
            setInWishlist(!!item);
          }
        } catch (error) {
          console.error('Error checking wishlist:', error);
        }
      }
      checkWishlist();
    }
  }, [isAuthenticated, product]);

  const getOrCreateCart = async () => {
    let cartId = localStorage.getItem('cartId');
    if (cartId) {
      try {
        await API.get(`/api/shop-carts/${cartId}/`);
        return cartId;
      } catch (error) {
        // Cart doesn't exist, create new
        localStorage.removeItem('cartId');
      }
    }
    const res = await API.post('/api/shop-carts/', {});
    cartId = res.data.id;
    localStorage.setItem('cartId', cartId);
    return cartId;
  };

  const addToCart = async () => {
    if (!selectedVariant) {
      alert('Please select a variant.');
      return;
    }
    setActionLoading(true);
    try {
      const cartId = await getOrCreateCart();
      // Check if item already in cart
      const cartRes = await API.get(`/api/shop-carts/${cartId}/`);
      const existingItem = cartRes.data.items.find(item => item.product_variant.id === selectedVariant.id);
      if (existingItem) {
        // Update quantity
        await API.patch(`/api/shop-cartitems/${existingItem.id}/`, { quantity: existingItem.quantity + quantity });
      } else {
        // Add new item
        await API.post('/api/shop-cartitems/', {
          cart: cartId,
          product_variant: selectedVariant.id,
          quantity: quantity
        });
      }
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const buyNow = async () => {
    await addToCart();
    navigate('/checkout');
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      alert('Please login to add to wishlist.');
      navigate('/login');
      return;
    }
    setActionLoading(true);
    try {
      if (inWishlist) {
        // Remove from wishlist
        const res = await API.get('/api/shop-wishlists/');
        if (res.data.length > 0) {
          const wishlist = res.data[0];
          const item = wishlist.items.find(item => item.product === product.id);
          if (item) {
            await API.delete(`/api/shop-wishlistitems/${item.id}/`);
            setInWishlist(false);
          }
        }
      } else {
        // Add to wishlist
        let wishlistId;
        const res = await API.get('/api/shop-wishlists/');
        if (res.data.length > 0) {
          wishlistId = res.data[0].id;
        } else {
          const newWishlist = await API.post('/api/shop-wishlists/', {});
          wishlistId = newWishlist.data.id;
        }
        await API.post('/api/shop-wishlistitems/', {
          wishlist: wishlistId,
          product: product.id
        });
        setInWishlist(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !product) return <Loader />;

  return (
    <div className="pd-main rediron-theme">
      <Header />
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span> / </span>
        <Link to={`/category/${product.category.id}`}>{product.category.name}</Link>
        <span> / </span>
        <span className="current">{product.name}</span>
      </div>

      {/* Main product block */}
      <div className="product-main-block">
        {/* Image Gallery */}
        <div className="pd-img-gallery">
          <img src={selectedVariant?.image || product.image} alt={product.name} />
        </div>

        {/* Product info */}
        <div className="pd-info">
          <h2 className="pd-title">{product.name}</h2>
          <RatingStars rating={product.rating} />

          {/* Variant selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="variant-section">
              <label>Choose variant:</label>
              <select
                value={selectedVariant?.id || ""}
                onChange={e => {
                  const v = product.variants.find(v => v.id === parseInt(e.target.value));
                  setSelectedVariant(v);
                }}
              >
                {product.variants.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.variant_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pricing block */}
          <div className="pd-price-row">
            <span className="price">
              ₹{selectedVariant?.price || product.price}
            </span>
            {product.mrp && (
              <span className="mrp">MRP: ₹{product.mrp}</span>
            )}
            {product.discount_percent > 0 && (
              <span className="discount">{product.discount_percent}% off</span>
            )}
          </div>

          {/* Quantity selector */}
          <div className="quantity-section">
            <label>Quantity:</label>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <div className="pd-purchase-row">
            <button className="add-cart" onClick={addToCart} disabled={actionLoading}>
              {actionLoading ? 'Adding...' : 'Add to Cart'}
            </button>
            <button className="buy-now" onClick={buyNow} disabled={actionLoading}>
              {actionLoading ? 'Processing...' : 'Buy Now'}
            </button>
            <button className="wishlist-btn" onClick={toggleWishlist} disabled={actionLoading}>
              {inWishlist ? '❤️' : '🤍'} {actionLoading ? 'Updating...' : ''}
            </button>
          </div>

          {/* Trust Info */}
          <div className="pd-trust">
            <div>✅ Authenticity Verified</div>
            <div>🔒 Secure Payment</div>
            <div>🎁 Earn Rediron Points</div>
          </div>

          {/* Nutrition Highlights */}
          {product.description && (
            <div className="nutrition-highlights">
              <h4>Nutrition Highlights</h4>
              {/* Example, replace with actual values */}
              <ul>
                <li>Protein: {product.protein_per_serving || 'N/A'} g</li>
                <li>BCAA: {product.bcaa_per_serving || 'N/A'} g</li>
                <li>Calories: {product.kcal_per_serving || 'N/A'} kcal</li>
                {/* Add more if needed */}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Tabs/Below product info */}
      <div className="pd-tabs">
        <div className="tab-block">
          <h3>About/Description</h3>
          <div className="desc-block">{product.description}</div>
        </div>
        {/* Could expand with tabs: Key Benefits, Combo Offers, etc. */}
      </div>

      {/* Reviews */}
      <div className="pd-reviews">
        <ReviewSection productId={product.id} />
      </div>

      {/* Suggested Products */}
      <div className="related-products-block">
        <h3>Related Products</h3>
        <div className="related-products-list">
          {related.map(prod => <ProductCard key={prod.id} product={prod} />)}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
