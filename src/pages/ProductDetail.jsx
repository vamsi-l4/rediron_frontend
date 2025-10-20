import React, { useEffect, useState } from 'react';
import './ProductDetail.css';

import Header from '../ShopComponents/Header';
import Footer from '../ShopComponents/Footer';
import RatingStars from '../ShopComponents/RatingStars';
import ReviewSection from '../ShopComponents/ReviewSection';
import Loader from '../ShopComponents/Loader';
import ProductCard from '../ShopComponents/ProductCard';

const API_BASE = 'http://localhost:8000/api'; // Adjust as needed

const ProductDetail = ({ match }) => {
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get product ID from URL
  const id = match?.params?.id || 1;

  useEffect(() => {
    setLoading(true);
    async function fetchProduct() {
      const res = await fetch(`${API_BASE}/shop-products/${id}/`);
      const prod = await res.json();
      setProduct(prod);
      setSelectedVariant(prod.variants && prod.variants.length > 0 ? prod.variants[0] : null);

      // Fetch related products (same category, different ID)
      const relRes = await fetch(`${API_BASE}/shop-products/?category=${prod.category.id}&page=1`);
      const relProd = await relRes.json();
      setRelated(relProd.results ? relProd.results.filter(p => p.id !== prod.id).slice(0, 6) : []);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading || !product) return <Loader />;

  return (
    <div className="pd-main rediron-theme">
      <Header />
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>Home</span>
        <span> / </span>
        <span>{product.category.name}</span>
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
          <div className="pd-purchase-row">
            <button className="add-cart">Add to Cart</button>
            <button className="buy-now">Buy Now</button>
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
