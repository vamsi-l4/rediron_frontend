
import React, { useEffect, useState } from 'react';
import './Home.css';
import { ShieldCheck, Lock, Truck, Gift, ChevronLeft, ChevronRight } from 'lucide-react';

import Header from '../ShopComponents/Header';
import Footer from '../ShopComponents/Footer';
import CategoryMenu from '../ShopComponents/CategoryMenu';
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
        // Fetch categories
        const catRes = await API.get('/shop-categories/');
        const catData = catRes.data;

        // Fetch featured products - you could use a "featured" flag or just get products
        const prodRes = await API.get('/shop-products/?ordering=-rating');
        const prodData = prodRes.data;

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
    <div className="home-main rediron-theme">
      <Header />

      {/* Hero Banner Section */}
      <section className="hero-banner">
        <div className="banner-carousel">
          <div className="carousel-container">
            {banners.map((banner, index) => (
              <div
                key={index}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              >
                <OfferBanner img={banner.img} alt={banner.alt} url={banner.url} />
              </div>
            ))}
          </div>
          <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>
            <ChevronLeft />
          </button>
          <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>
            <ChevronRight />
          </button>
          <div className="carousel-dots">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories as horizontal scroll */}
      <section className="category-row">
        <h2>Shop by Category</h2>
        <div className="category-scroll">
          {categories.map(cat => (
            <CategoryMenu key={cat.id} name={cat.name} image={cat.image} slug={cat.slug} />
          ))}
        </div>
      </section>

      {/* Featured/Popular Products */}
      <section className="featured-products">
        <h2>Top Products</h2>
        <div className="products-grid">
          {featured.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <div className="trust-scroll">
          <div className="trust-block">
            <ShieldCheck className="trust-icon" />
            <div>Authenticity Guaranteed</div>
          </div>
          <div className="trust-block">
            <Lock className="trust-icon" />
            <div>100% Secure Payments</div>
          </div>
          <div className="trust-block">
            <Truck className="trust-icon" />
            <div>Free Shipping</div>
          </div>
          <div className="trust-block">
            <Gift className="trust-icon" />
            <div>Earn Rediron Points</div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="newsletter-section">
        <h3>Subscribe to our Newsletter</h3>
        <p>Get the latest deals, news, and training tips from Rediron.</p>
        {/* Use your NewsletterForm component */}
        {/* <NewsletterForm /> */}
        <form className="newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button className="subscribe-btn" type="submit">Subscribe</button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
