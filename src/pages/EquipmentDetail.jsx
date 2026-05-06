import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './EquipmentDetail.css';
import placeholderAsset from '../assets/placeholder.png';

import API from '../components/Api';

const Loader = () => (
  <div className="ed-loading">
    <div className="ed-spinner"></div>
    <p>Loading equipment details...</p>
  </div>
);

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

const categoryLabelMap = {
  cardio: 'Cardio Equipment',
  gym: 'Strength Equipment',
  abs: 'Core Equipment',
  bodyweight: 'Core Equipment',
  other: 'Core Equipment',
};

const EquipmentDetail = () => {
  const [equipment, setEquipment] = useState(null);
  const [product, setProduct] = useState(null);
  const [imageUrls, setImageUrls] = useState([placeholderAsset]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [slideTransitioning, setSlideTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [error, setError] = useState(null);
  const mainImage = imageUrls[currentSlide] || placeholderAsset;

  const navigate = useNavigate();
  const { id, category } = useParams();

  const getMediaUrl = (imageUrl) => {
    if (!imageUrl) return placeholderAsset;
    return imageUrl.startsWith('http') ? imageUrl : `${API.defaults.baseURL}${imageUrl}`;
  };

  const sanitizeImagePrefix = (name) => {
    return name ? name.replace(/[^A-Za-z0-9]/g, '') : '';
  };

  const preloadImage = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => resolve(null);
      img.src = src;
    });

  const buildEquipmentImageCandidates = useCallback((equipmentObj) => {
    const urls = [];
    if (equipmentObj?.image_urls?.length) {
      urls.push(...equipmentObj.image_urls.map(getMediaUrl));
    } else if (equipmentObj?.image) {
      urls.push(getMediaUrl(equipmentObj.image));
    }

    // Add image1, image2, image3, image4 if available
    if (equipmentObj?.image1) urls.push(getMediaUrl(equipmentObj.image1));
    if (equipmentObj?.image2) urls.push(getMediaUrl(equipmentObj.image2));
    if (equipmentObj?.image3) urls.push(getMediaUrl(equipmentObj.image3));
    if (equipmentObj?.image4) urls.push(getMediaUrl(equipmentObj.image4));

    const prefix = sanitizeImagePrefix(equipmentObj?.name);
    if (prefix) {
      for (let i = 1; i <= 4; i += 1) {
        urls.push(`${API.defaults.baseURL}/media/equipment/${prefix}${i}.png`);
      }
    }

    const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));
    return uniqueUrls.length > 0 ? uniqueUrls : [placeholderAsset];
  }, []);

  const fetchMatchingProduct = async (equipmentName, equipmentCategory) => {
    try {
      const searchRes = await API.get(`/api/shop-products/?search=${encodeURIComponent(equipmentName)}`);
      const candidateProducts = Array.isArray(searchRes.data)
        ? searchRes.data
        : searchRes.data.results || [];

      const exactMatch = candidateProducts.find(
        (item) => item.name?.toLowerCase() === equipmentName.toLowerCase()
      );
      if (exactMatch) return exactMatch;
      if (candidateProducts.length > 0) return candidateProducts[0];

      const slug = ['cardio', 'strength', 'core'].includes(equipmentCategory)
        ? equipmentCategory
        : 'core';
      const fallbackRes = await API.get(`/api/shop-products/?category__slug=${slug}`);
      return Array.isArray(fallbackRes.data)
        ? fallbackRes.data[0]
        : fallbackRes.data.results?.[0] || null;
    } catch (error) {
      console.error('Error fetching matching product:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        setLoading(true);
        console.log(`[EquipmentDetail] Loading equipment with id=${id}`);
        
        const equipmentRes = await API.get(`/api/equipment/${id}/`);
        const equipmentData = equipmentRes.data;
        console.log('[EquipmentDetail] Equipment loaded:', equipmentData);
        setEquipment(equipmentData);

        const candidateUrls = buildEquipmentImageCandidates(equipmentData);
        const loadedUrls = await Promise.all(candidateUrls.map(preloadImage));
        const validUrls = loadedUrls.filter(Boolean);
        setImageUrls(validUrls.length > 0 ? validUrls : [placeholderAsset]);
        setCurrentSlide(0);

        const matchedProduct = await fetchMatchingProduct(equipmentData.name, equipmentData.category);
        setProduct(matchedProduct);
      } catch (error) {
        console.error('[EquipmentDetail] Error loading equipment:', error);
        if (error.response?.status === 404) {
          console.error('[EquipmentDetail] Equipment not found with id:', id);
          setError(`Equipment with ID ${id} not found`);
        } else {
          setError('Failed to load equipment details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadEquipment();
    }
  }, [id, buildEquipmentImageCandidates]);

  useEffect(() => {
    if (imageUrls.length <= 1) return undefined;
    const intervalId = window.setInterval(() => {
      setSlideTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((current) => (current + 1) % imageUrls.length);
        setSlideTransitioning(false);
      }, 600); // Match transition duration
    }, 2500);
    return () => window.clearInterval(intervalId);
  }, [imageUrls]);

  useEffect(() => {
    setImageLoaded(false);
    setSlideTransitioning(false);
  }, [mainImage]);

  const handleCheckAvailability = () => {
    if (product?.id) {
      navigate(`/shop-products/${product.id}`);
    } else {
      alert('This equipment is not yet available as a shop product. Please sync backend data first.');
    }
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="ed-error-container">
        <div className="ed-error-content">
          <h2>⚠️ Equipment Not Found</h2>
          <p>{error}</p>
          <Link to="/equipment" className="ed-error-btn">
            ← Back to Equipment
          </Link>
        </div>
      </div>
    );
  }

  if (!equipment && !product) {
    return (
      <div className="ed-error-container">
        <div className="ed-error-content">
          <h2>⚠️ No Data Available</h2>
          <p>This equipment could not be loaded. Please check the URL and try again.</p>
          <Link to="/equipment" className="ed-error-btn">
            ← Back to Equipment
          </Link>
        </div>
      </div>
    );
  }

  const youtubeId = extractYouTubeId(product?.video_url || equipment?.video_link);

  return (
    <div className="equipment-detail rediron-theme">
      {/* ===== TOP NAV AREA ===== */}
      <div className="ed-top-nav">
        <div className="ed-breadcrumb">
          <span className="home-icon">🏠</span>
          <Link to="/">Home</Link>
          <span className="sep">/</span>
          <Link to="/equipment">Equipment</Link>
          {category && (
            <>
              <span className="sep">/</span>
              <Link to={`/equipment/${category}`}>{category}</Link>
            </>
          )}
          <span className="sep">/</span>
          <span className="current">{product?.name || equipment?.name}</span>
        </div>
        <button className="back-btn" onClick={() => navigate(`/equipment/${category}`)}>
          ← Back to Category
        </button>
      </div>

      {/* ===== HERO SECTION ===== */}
      <div className="ed-hero">
        <div className="ed-hero-background" />

        {/* LEFT: Content Block */}
        <div className="ed-hero-left">
          <div className="ed-category-tag">{product?.category?.name || categoryLabelMap[category] || 'Equipment'}</div>
          <h1 className="ed-hero-title">{product?.name || equipment?.name}</h1>
          <p className="ed-hero-subtitle">{product?.description || equipment?.usage || 'Premium equipment for your workouts.'}</p>

          {/* Stats Row */}
          <div className="ed-stats-row">
            {product?.additional_stats?.length > 0 ? (
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
                  <div className="ed-stat-value">{product?.rating || 'N/A'}</div>
                  <div className="ed-stat-label">Rating</div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="ed-action-buttons">
            <button
              className="ed-btn ed-btn-primary"
              onClick={handleCheckAvailability}
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* RIGHT: Visual Block (Images) */}
        <div className="ed-hero-right">
          <div className="ed-main-image-container">
            <img
              src={mainImage || placeholderAsset}
              alt={product?.name || equipment?.name}
              className={`ed-main-image ${imageLoaded && !slideTransitioning ? 'loaded' : 'loading'}`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>
      </div>

      {/* ===== SPLIT SECTION: Features + Video ===== */}
      <div className="ed-split-section">
        {/* LEFT: Key Features */}
        <div className="ed-features-block">
          <h2 className="ed-section-title">🔥 Key Features</h2>
          <div className="ed-features-grid">
            {product?.key_features?.length > 0 ? (
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
            {product?.specifications?.length > 0 ? (
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
            {product?.benefits?.length > 0 ? (
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
            {product?.perfect_for?.length > 0 ? (
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
            onClick={handleCheckAvailability}
          >
            🔴 Check Availability
          </button>
        </div>
      </div>

    </div>
  );
};

export default EquipmentDetail;
