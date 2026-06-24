import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ProductDetail.css';
import { makeAbsolute } from '../components/Api';
import { ShoppingCart, Heart, Zap, CheckCircle2, ShieldCheck, Gift, AlertTriangle, Minus, Plus } from 'lucide-react';

import Header from './ShopNavbar';
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
  const [error, setError] = useState(null);

  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Get product ID from URL
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    setError(null);
    async function fetchProduct() {
      try {
        const res = await API.get(`/api/shop-products/${id}/`);
        const prod = res.data;
        setProduct(prod);
        setSelectedVariant(prod.variants && prod.variants.length > 0 ? prod.variants[0] : null);

        // Fetch related products (same category, different ID)
        if (prod.category) {
          const categoryId = typeof prod.category === 'object' ? prod.category.id : prod.category;
          const relRes = await API.get(`/api/shop-products/?category=${categoryId}&page=1`);
          const relProd = relRes.data;
          setRelated(relProd.results ? relProd.results.filter(p => p.id !== prod.id).slice(0, 6) : []);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(err.response?.status === 404 ? "Product not found." : "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  // Check if product is in wishlist
  useEffect(() => {
    if (isAuthenticated && product) {
      async function checkWishlist() {
        try {
          const res = await API.get('/api/shop-wishlists/');
          const wishlistData = res.data.results ? res.data.results[0] : (res.data.length > 0 ? res.data[0] : null);
          if (wishlistData) {
            const itemsRes = await API.get(`/api/shop-wishlistitems/?wishlist=${wishlistData.id}`);
            const items = itemsRes.data.results || itemsRes.data || [];
            const item = items.find(item => item.product === product.id || item.product?.id === product.id);
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

  const buildCartItemPayload = (cartId) => {
    const hasVariants = product?.variants && product.variants.length > 0;
    const payload = {
      cart: Number(cartId),
      product_id: product.id,
      quantity: quantity
    };
    if (hasVariants && selectedVariant?.id) {
      payload.product_variant_id = selectedVariant.id;
    }
    return payload;
  };

  const buildLegacyCartItemPayload = (cartId) => {
    const hasVariants = product?.variants && product.variants.length > 0;
    const payload = {
      cart_id: Number(cartId),
      cart: Number(cartId),
      product: product.id,
      product_id: product.id,
      quantity
    };
    if (hasVariants && selectedVariant?.id) {
      payload.product_variant = selectedVariant.id;
      payload.product_variant_id = selectedVariant.id;
    }
    return payload;
  };

  const createCartItem = async (cartId) => {
    try {
      return await API.post('/api/shop-cartitems/', buildCartItemPayload(cartId));
    } catch (error) {
      if (error.response?.status === 400) {
        console.warn('Cart item primary payload failed, retrying compatible payload:', error.response?.data);
        return API.post('/api/shop-cartitems/', buildLegacyCartItemPayload(cartId));
      }
      throw error;
    }
  };

  const createWishlistItem = async (wishlistId) => {
    try {
      return await API.post('/api/shop-wishlistitems/', {
        wishlist: wishlistId,
        product_id: product.id
      });
    } catch (error) {
      if (error.response?.status === 400) {
        return API.post('/api/shop-wishlistitems/', {
          wishlist: wishlistId,
          product: product.id
        });
      }
      throw error;
    }
  };

  const addToCart = async () => {
    const hasVariants = product?.variants && product.variants.length > 0;

    if (hasVariants && !selectedVariant) {
      alert('Please select a variant first.');
      return;
    }
    
    // Check inventory
    if (hasVariants && (!selectedVariant.in_stock || selectedVariant.inventory < quantity)) {
      alert('Not enough inventory available for this variant. Please reduce quantity.');
      return;
    }
    
    setActionLoading(true);
    try {
      const cartId = await getOrCreateCart();
      // Check if item already in cart
      const cartRes = await API.get(`/api/shop-carts/${cartId}/`);
      const existingItem = cartRes.data.items.find(item => 
        hasVariants ? item.product_variant?.id === selectedVariant.id : (item.product?.id === product.id || item.product_variant?.product?.id === product.id)
      );
      
      if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        if (hasVariants && newQty > selectedVariant.inventory) {
          alert(`Only ${selectedVariant.inventory} units available for this variant.`);
          setActionLoading(false);
          return;
        }
        // Update quantity
        await API.patch(`/api/shop-cartitems/${existingItem.id}/`, { quantity: newQty });
      } else {
        // Add new item
        await createCartItem(cartId);
      }
      alert('Added to cart.');
      setQuantity(1); // Reset quantity
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const buyNow = async () => {
    const hasVariants = product?.variants && product.variants.length > 0;

    if (hasVariants && !selectedVariant) {
      alert('Please select a variant first.');
      return;
    }
    
    if (hasVariants && (!selectedVariant.in_stock || selectedVariant.inventory < quantity)) {
      alert('Not enough inventory available. Please check the variant.');
      return;
    }
    
    setActionLoading(true);
    try {
      const cartId = await getOrCreateCart();
      // Check if item already in cart
      const cartRes = await API.get(`/api/shop-carts/${cartId}/`);
      const existingItem = cartRes.data.items.find(item => 
        hasVariants ? item.product_variant?.id === selectedVariant.id : (item.product?.id === product.id || item.product_variant?.product?.id === product.id)
      );
      
      if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        if (hasVariants && newQty > selectedVariant.inventory) {
          alert(`Only ${selectedVariant.inventory} units available for this variant.`);
          setActionLoading(false);
          return;
        }
        await API.patch(`/api/shop-cartitems/${existingItem.id}/`, { quantity: newQty });
      } else {
        await createCartItem(cartId);
      }
      window.dispatchEvent(new Event('cartUpdated'));
      // Navigate to checkout
      navigate('/shop-checkout');
    } catch (error) {
      console.error('Error in buy now:', error);
      alert('Failed to proceed. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      alert('Please login to add to wishlist.');
      navigate('/login');
      return;
    }
    setActionLoading(true);
    try {
      const res = await API.get('/api/shop-wishlists/');
      const wishlistData = res.data.results ? res.data.results[0] : (res.data.length > 0 ? res.data[0] : null);

      if (inWishlist) {
        // Remove from wishlist
        if (wishlistData) {
          const itemsRes = await API.get(`/api/shop-wishlistitems/?wishlist=${wishlistData.id}`);
          const items = itemsRes.data.results || itemsRes.data || [];
          const item = items.find(i => i.product === product.id || i.product?.id === product.id);
          if (item) {
            await API.delete(`/api/shop-wishlistitems/${item.id}/`);
            setInWishlist(false);
            window.dispatchEvent(new Event('wishlistUpdated'));
          }
        }
      } else {
        // Add to wishlist
        let wishlistId;
        if (wishlistData) {
          wishlistId = wishlistData.id;
        } else {
          const newWishlist = await API.post('/api/shop-wishlists/', {});
          wishlistId = newWishlist.data.id;
        }
        await createWishlistItem(wishlistId);
        setInWishlist(true);
        window.dispatchEvent(new Event('wishlistUpdated'));
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader />;
  
  if (error || !product) {
    return (
      <div className="pd-main rediron-theme">
        <Header />
        <div style={{ padding: "100px 20px", textAlign: "center", color: "white", minHeight: "60vh" }}>
          <h2>{error || "Product not found"}</h2>
          <p style={{ color: "#999", marginTop: "10px" }}>The product you are looking for may have been removed or is unavailable.</p>
          <Link to="/shop-categories/proteins" style={{ display: "inline-block", marginTop: "20px", padding: "10px 20px", backgroundColor: "#e53935", color: "white", textDecoration: "none", borderRadius: "5px", fontWeight: "bold" }}>
            Return to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="pd-main rediron-theme">
      <Header />
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span> / </span>
        <Link to={`/shop-categories/${product.category.slug || product.category.id}`}>{product.category.name}</Link>
        <span> / </span>
        <span className="current">{product.name}</span>
      </div>

      {/* Main product block */}
      <div className="product-main-block">
        {/* Image Gallery */}
        <div className="pd-img-gallery">
          <img
            src={makeAbsolute(
              selectedVariant?.image || product.image2 || product.image || product.gallery_images?.[0]?.image
            )}
            alt={product.name}
          />
        </div>

        {/* Product info */}
        <div className="pd-info">
          <h2 className="pd-title">{product.name}</h2>
          <RatingStars rating={product.rating} />

          {/* Variant selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="variant-section">
              <label>Select Variant:</label>
              {product.variants.length === 1 ? (
                <div className="variant-badge">
                  <span className="selected-variant">{product.variants[0].variant_name}</span>
                  {!product.variants[0].in_stock && <span className="out-of-stock"> (Out of Stock)</span>}
                </div>
              ) : (
                <select
                  value={selectedVariant?.id || ""}
                  onChange={e => {
                    const v = product.variants.find(v => v.id === parseInt(e.target.value));
                    setSelectedVariant(v);
                  }}
                  className="variant-select"
                >
                  <option value="">-- Choose a variant --</option>
                  {product.variants.map(v => (
                    <option key={v.id} value={v.id} disabled={!v.in_stock}>
                      {v.variant_name} {!v.in_stock ? '(Out of Stock)' : `(${v.inventory} left)`}
                    </option>
                  ))}
                </select>
              )}
              {selectedVariant && !selectedVariant.in_stock && (
                <div className="variant-warning"><AlertTriangle size={16} /> This variant is currently out of stock</div>
              )}
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
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={16} /></button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity"><Plus size={16} /></button>
          </div>

          <div className="pd-purchase-row">
            <button className="add-cart" onClick={addToCart} disabled={actionLoading}>
              {actionLoading ? 'Adding...' : <><ShoppingCart size={18} /> Add to Cart</>}
            </button>
            <button className="buy-now" onClick={buyNow} disabled={actionLoading}>
              {actionLoading ? 'Processing...' : <><Zap size={18} /> Buy Now</>}
            </button>
            <button className="wishlist-btn1" onClick={toggleWishlist} disabled={actionLoading}>
              <Heart fill={inWishlist ? "#e53935" : "none"} color={inWishlist ? "#e53935" : "currentColor"} /> 
            </button>
          </div>

          {/* Trust Info */}
          <div className="pd-trust">
            <div><CheckCircle2 size={16} color="#10b981" /> Authenticity Verified</div>
            <div><ShieldCheck size={16} color="#3b82f6" /> Secure Payment</div>
            <div><Gift size={16} color="#e53935" /> Earn Rediron Points</div>
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
