
import React, { useEffect, useState } from 'react';
import './Home.css';
import { ShieldCheck, Lock, Truck, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import Header from '../ShopComponents/Header';
import Footer from '../ShopComponents/Footer';
import ProductCard from '../ShopComponents/ProductCard';
import OfferBanner from '../ShopComponents/OfferBanner';
import Loader from '../ShopComponents/Loader';
import API from '../components/Api';

// Import banner images
import Banner1 from '../assets/Banner1.png';
import Banner2 from '../assets/Banner2.png';
import Banner3 from '../assets/Banner3.png';
import Banner4 from '../assets/Banner4.png';
import Banner5 from '../assets/Banner5.png';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch categories - handle 404 gracefully
        let catData = [];
        try {
          const catRes = await API.get('/api/shop-categories/');
          catData = catRes.data;
        } catch (catError) {
          console.warn('Categories endpoint not available:', catError.message);
        }

        // Fetch featured products - you could use a "featured" flag or just get products
        let prodData = [];
        try {
          const prodRes = await API.get('/api/shop-products/?ordering=-rating');
          prodData = prodRes.data;
        } catch (prodError) {
          console.warn('Products endpoint not available:', prodError.message);
        }

        // Example banners (replace with data-driven if dynamic)
        const bannersData = [
          { img: Banner1, alt: 'Protein Discount', url: '/shop-coupons' },
          { img: Banner2, alt: 'Combo Offers', url: '/shop-coupons' },
          { img: Banner3, alt: 'Fitness Gear Sale', url: '/shop-coupons' },
          { img: Banner4, alt: 'New Arrivals', url: '/shop-coupons' },
          { img: Banner5, alt: 'Bulk Supplements', url: '/shop-coupons' }
        ];

        setCategories(catData.results ? catData.results.slice(0, 8) : (Array.isArray(catData) ? catData.slice(0, 8) : []));
        setFeatured(prodData.results ? prodData.results.slice(0, 8) : (Array.isArray(prodData) ? prodData.slice(0, 8) : []));
        setBanners(bannersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategories([]);
        setFeatured([]);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Auto-scroll effect for carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading) return <Loader />;

  return (
    <div className="shophome-main rediron-theme">
      <Header />

      {/* Hero Banner Section */}
      <section className="shophome-hero-banner">
        <div className="shophome-banner-carousel">
          <div className="shophome-carousel-container">
            {banners.map((banner, index) => (
              <div
                key={index}
                className={`shophome-carousel-slide ${index === currentSlide ? 'active' : ''}`}
              >
                <OfferBanner img={banner.img} alt={banner.alt} url={banner.url} />
              </div>
            ))}
          </div>
          <button className="shophome-carousel-arrow shophome-carousel-arrow-left" onClick={prevSlide}>
            <ChevronLeft />
          </button>
          <button className="shophome-carousel-arrow shophome-carousel-arrow-right" onClick={nextSlide}>
            <ChevronRight />
          </button>
          <div className="shophome-carousel-dots">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`shophome-carousel-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* All Products Section - showing categories as "All Products" */}
      <section className="shophome-all-products-section">
        <h2>All Products</h2>
        <div className="shophome-category-scroll">
          {categories.map(cat => (
            <div key={cat.id} className="shophome-category-item">
              <Link to={`/shop-categories/${cat.slug}`} className="shophome-category-link">
                <div className="shophome-category-image">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} />
                  ) : (
                    <div className="shophome-category-placeholder">
                      <span>{cat.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="shophome-category-name">{cat.name}</div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Featured/Popular Products */}
      <section className="shophome-featured-products">
        <h2>Top Products</h2>
        <div className="shophome-products-grid">
          {featured.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="shophome-trust-section">
        <div className="shophome-trust-scroll">
          <div className="shophome-trust-block">
            <ShieldCheck className="shophome-trust-icon" />
            <div>Authenticity Guaranteed</div>
          </div>
          <div className="shophome-trust-block">
            <Lock className="shophome-trust-icon" />
            <div>100% Secure Payments</div>
          </div>
          <div className="shophome-trust-block">
            <Truck className="shophome-trust-icon" />
            <div>Free Shipping</div>
          </div>
          <div className="shophome-trust-block">
            <Gift className="shophome-trust-icon" />
            <div>Earn Rediron Points</div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="shophome-newsletter-section">
        <h3>Subscribe to our Newsletter</h3>
        <p>Get the latest deals, news, and training tips from Rediron.</p>
        {/* Use your NewsletterForm component */}
        {/* <NewsletterForm /> */}
        <form className="shophome-newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button className="shophome-subscribe-btn" type="submit">Subscribe</button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
