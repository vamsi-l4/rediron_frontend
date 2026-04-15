import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './EquipmentDetail.css';

import Header from '../ShopComponents/Header';
import Footer from '../ShopComponents/Footer';
import Loader from '../ShopComponents/Loader';
import API from '../components/Api';
import { AuthContext } from '../contexts/AuthContext';

// Icon mapping for features and stats
const iconMap = {
  heart: '❤️',
  star: '⭐',
  speed: '⚡',
  power: '💪',
  weight: '⚖️',
  target: '🎯',
  check: '✓',
  award: '🏆',
  fire: '🔥',
  bolt: '⚡',
  dumbbell: '🏋️',
  running: '🏃',
  shield: '🛡️',
};

const EquipmentDetail = () => {
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [quantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id, category } = useParams();

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/api/shop-products/${id}/`);
        const prod = res.data;
        setProduct(prod);
        setMainImage(prod.image); // Use main image initially
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // Check wishlist status
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const res = await API.get('/api/shop-wishlists/');
        if (res.data.length > 0) {
          const wishlist = res.data[0];
          const item = wishlist.items.find(item => item.product === product.id);
          setInWishlist(!!item);
        }
      } catch (error) {
        console.error('Error checking wishlist:', error);
      }
    };

    if (isAuthenticated && product) {
      checkWishlist();
    }
  }, [isAuthenticated, product]);

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
    } finally {
      setActionLoading(false);
    }
  };

  const addToCart = async () => {
    setActionLoading(true);
    try {
      let cartId = localStorage.getItem('cartId');
      if (!cartId) {
        const cartRes = await API.post('/api/shop-carts/', {});
        cartId = cartRes.data.id;
        localStorage.setItem('cartId', cartId);
      }

      await API.post('/api/shop-cartitems/', {
        cart: cartId,
        product_variant: product.variants?.[0]?.id || product.id,
        quantity: quantity
      });

      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleThumbnailClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  if (loading || !product) return <Loader />;

  const youtubeId = extractYouTubeId(product.video_url);
  const allImages = product.gallery_images && product.gallery_images.length > 0
    ? product.gallery_images.map(img => img.image)
    : [product.image];

  return (
    <div className="equipment-detail rediron-theme">
      <Header />

      {/* ===== TOP NAV AREA ===== */}
      <div className="ed-top-nav">
        <div className="ed-breadcrumb">
          <span className="home-icon">🏠</span>
          <Link to="/">Home</Link>
          <span className="sep">/</span>
          <Link to="/category">Equipment</Link>
          {category && (
            <>
              <span className="sep">/</span>
              <span>{category}</span>
            </>
          )}
          <span className="sep">/</span>
          <span className="current">{product.name}</span>
        </div>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Category
        </button>
      </div>

      {/* ===== HERO SECTION ===== */}
      <div className="ed-hero">
        <div className="ed-hero-background" />

        {/* LEFT: Content Block */}
        <div className="ed-hero-left">
          <div className="ed-category-tag">{product.category?.name || 'Equipment'}</div>
          <h1 className="ed-hero-title">{product.name}</h1>
          <p className="ed-hero-subtitle">{product.description}</p>

          {/* Stats Row */}
          <div className="ed-stats-row">
            {product.additional_stats && product.additional_stats.length > 0 ? (
              product.additional_stats.slice(0, 3).map((stat, idx) => (
                <div key={idx} className="ed-stat-card">
                  <div className="ed-stat-icon">{iconMap[stat.icon] || '📊'}</div>
                  <div className="ed-stat-value">{stat.value}</div>
                  <div className="ed-stat-label">{stat.label}</div>
                </div>
              ))
            ) : (
              <>
                <div className="ed-stat-card">
                  <div className="ed-stat-icon">⭐</div>
                  <div className="ed-stat-value">{product.rating}</div>
                  <div className="ed-stat-label">Rating</div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="ed-action-buttons">
            <button
              className="ed-btn ed-btn-primary"
              onClick={addToCart}
              disabled={actionLoading}
            >
              🔴 Check Availability
            </button>
            <button
              className="ed-btn ed-btn-secondary"
              onClick={toggleWishlist}
              disabled={actionLoading}
            >
              {inWishlist ? '❤️' : '🤍'} Add to Compare
            </button>
          </div>
        </div>

        {/* RIGHT: Visual Block (Images) */}
        <div className="ed-hero-right">
          <div className="ed-main-image-container">
            <img src={mainImage} alt={product.name} className="ed-main-image" />
          </div>

          {/* Thumbnail Strip */}
          <div className="ed-thumbnail-strip">
            {allImages.map((img, idx) => (
              <div
                key={idx}
                className={`ed-thumbnail ${mainImage === img ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(img)}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== SPLIT SECTION: Features + Video ===== */}
      <div className="ed-split-section">
        {/* LEFT: Key Features */}
        <div className="ed-features-block">
          <h2 className="ed-section-title">🔥 Key Features</h2>
          <div className="ed-features-grid">
            {product.key_features && product.key_features.length > 0 ? (
              product.key_features.map((feature, idx) => (
                <div key={idx} className="ed-feature-card">
                  <div className="ed-feature-icon">{iconMap[feature.icon] || '✓'}</div>
                  <h3 className="ed-feature-title">{feature.title}</h3>
                  <p className="ed-feature-desc">{feature.description}</p>
                </div>
              ))
            ) : (
              <p className="ed-no-data">No features available</p>
            )}
          </div>
        </div>

        {/* RIGHT: Video Section */}
        <div className="ed-video-block">
          <h2 className="ed-section-title">📺 Watch & Learn</h2>
          {youtubeId && !videoError ? (
            <div className="ed-video-container">
              <iframe
                width="100%"
                height="300"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="Equipment Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onError={() => setVideoError(true)}
              />
            </div>
          ) : (
            <div className="ed-no-video">
              <p>📺 No video available</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== SPECIFICATIONS + BENEFITS ===== */}
      <div className="ed-split-section">
        {/* LEFT: Specifications */}
        <div className="ed-specs-block">
          <h2 className="ed-section-title">📋 Specifications</h2>
          <div className="ed-specs-table">
            {product.specifications && product.specifications.length > 0 ? (
              product.specifications.map((spec, idx) => (
                <div key={idx} className="ed-spec-row">
                  <div className="ed-spec-label">{spec.label}</div>
                  <div className="ed-spec-value">{spec.value}</div>
                </div>
              ))
            ) : (
              <p className="ed-no-data">No specifications available</p>
            )}
          </div>
        </div>

        {/* RIGHT: Why Choose */}
        <div className="ed-benefits-block">
          <h2 className="ed-section-title">✨ Why Choose This?</h2>
          <div className="ed-benefits-list">
            {product.benefits && product.benefits.length > 0 ? (
              product.benefits.map((benefit, idx) => (
                <div key={idx} className="ed-benefit-item">
                  <span className="ed-benefit-icon">✓</span>
                  <div>
                    <h4 className="ed-benefit-title">{benefit.title}</h4>
                    <p className="ed-benefit-desc">{benefit.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="ed-no-data">No benefits available</p>
            )}
          </div>
        </div>
      </div>

      {/* ===== PERFECT FOR SECTION ===== */}
      <div className="ed-perfect-for-section">
        <div className="ed-perfect-for-card">
          <h2 className="ed-pf-title">✅ Perfect For</h2>
          <div className="ed-perfect-for-grid">
            {product.perfect_for && product.perfect_for.length > 0 ? (
              product.perfect_for.map((item, idx) => (
                <div key={idx} className="ed-pf-item">
                  <div className="ed-pf-icon">{iconMap[item.icon] || '✓'}</div>
                  <p className="ed-pf-label">{item.label}</p>
                </div>
              ))
            ) : (
              <p className="ed-no-data">No use cases listed</p>
            )}
          </div>
        </div>
      </div>

      {/* ===== FINAL CTA SECTION ===== */}
      <div className="ed-cta-banner">
        <div className="ed-cta-content">
          <h2>Ready to Upgrade Your Workout?</h2>
          <div className="ed-cta-features">
            <div className="ed-cta-feature">
              <span className="ed-cta-icon">✓</span>
              <span>2 Year Warranty</span>
            </div>
            <div className="ed-cta-feature">
              <span className="ed-cta-icon">✓</span>
              <span>Free Installation</span>
            </div>
            <div className="ed-cta-feature">
              <span className="ed-cta-icon">✓</span>
              <span>24/7 Support</span>
            </div>
          </div>
          <button
            className="ed-cta-button"
            onClick={addToCart}
            disabled={actionLoading}
          >
            🔴 Check Availability & Price
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EquipmentDetail;
