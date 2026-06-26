import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './ProductDetail.css';
import { makeAbsolute } from '../components/Api';
import {
  CheckCircle2,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  Ruler,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  Zap
} from 'lucide-react';

import Header from './ShopNavbar';
import Footer from '../ShopComponents/Footer';
import RatingStars from '../ShopComponents/RatingStars';
import ReviewSection from '../ShopComponents/ReviewSection';
import Loader from '../ShopComponents/Loader';
import ProductCard from '../ShopComponents/ProductCard';
import API from '../components/Api';
import { AuthContext } from '../contexts/AuthContext';
import { addProductToCart } from '../lib/shopCart';
import { addProductToWishlist, fetchWishlistItems, getCurrentWishlist, getOrCreateWishlist } from '../lib/shopWishlist';

const RECENT_KEY = "rediron_recent_products";

const valueRows = (rows) => rows.filter(row => row.value !== undefined && row.value !== null && row.value !== "");

const InfoGrid = ({ title, rows }) => {
  const cleanRows = valueRows(rows || []);
  if (!cleanRows.length) return null;
  return (
    <section className="pd-section">
      <h3>{title}</h3>
      <div className="pd-spec-grid">
        {cleanRows.map(row => (
          <div key={row.label} className="pd-spec-card">
            <span>{row.label}</span>
            <strong>{Array.isArray(row.value) ? row.value.join(", ") : row.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [error, setError] = useState(null);

  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    let cancelled = false;
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(`/api/shop-products/${id}/`);
        const prod = res.data;
        if (cancelled) return;
        setProduct(prod);
        setMainImage(makeAbsolute(prod.image || prod.featured_image_url || prod.gallery_images?.[0]?.image));

        const sizes = prod.clothing?.sizes || prod.footwear?.available_sizes || [];
        setSelectedSize(sizes[0] || "");

        const relRes = await API.get(`/api/shop-products/${id}/related/`).catch(() => null);
        if (relRes?.data) {
          setRelated(relRes.data.results || relRes.data || []);
        } else if (prod.category?.id) {
          const fallback = await API.get(`/api/shop-products/?category=${prod.category.id}&catalog=shop&ordering=-rating`);
          setRelated((fallback.data.results || fallback.data || []).filter(p => p.id !== prod.id).slice(0, 8));
        }

        const stored = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]").filter(item => String(item.id) !== String(prod.id));
        setRecent(stored.slice(0, 8));
        localStorage.setItem(RECENT_KEY, JSON.stringify([
          {
            id: prod.id,
            name: prod.name,
            image: prod.image || prod.featured_image_url,
            price: prod.price,
            mrp: prod.mrp,
            rating: prod.rating,
            category: prod.category,
            brand: prod.brand,
            discount_percent: prod.discount_percent,
            short_description: prod.short_description
          },
          ...stored
        ].slice(0, 10)));
      } catch (err) {
        console.error("Failed to fetch product:", err);
        if (!cancelled) setError(err.response?.status === 404 ? "Product not found." : "Failed to load product details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProduct();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && product) {
      async function checkWishlist() {
        try {
          const wishlistData = await getCurrentWishlist();
          if (wishlistData) {
            const items = await fetchWishlistItems(wishlistData.id, product.id);
            setInWishlist(items.some(item => item.product === product.id || item.product?.id === product.id));
          }
        } catch (error) {
          console.error('Error checking wishlist:', error);
        }
      }
      checkWishlist();
    }
  }, [isAuthenticated, product]);

  const images = useMemo(() => {
    if (!product) return [];
    const urls = [
      product.image || product.featured_image_url,
      ...(product.gallery_images || []).map(item => item.image)
    ].filter(Boolean);
    return Array.from(new Set(urls)).map(makeAbsolute);
  }, [product]);

  const benefits = useMemo(() => {
    if (!product) return [];
    return product.nutrition?.benefits || product.benefits || [];
  }, [product]);

  const sizeOptions = product?.clothing?.sizes || product?.footwear?.available_sizes || [];
  const needsSize = sizeOptions.length > 0;
  const price = Number(product?.price || 0);
  const mrp = Number(product?.mrp || 0);
  const stock = Number(product?.stock || 0);
  const isAvailable = product?.in_stock ?? (product?.is_active && stock > 0);

  const addToCart = async () => {
    if (needsSize && !selectedSize) {
      alert('Please select a size first.');
      return;
    }
    if (!isAvailable || stock < quantity) {
      alert('Not enough stock available. Please reduce quantity.');
      return;
    }
    setActionLoading(true);
    try {
      await addProductToCart({ productId: product.id, quantity });
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Added to cart.');
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const buyNow = async () => {
    const added = await addToCart();
    if (added) navigate('/shop-checkout');
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      alert('Please login to add to wishlist.');
      navigate('/login');
      return;
    }
    setActionLoading(true);
    try {
      const wishlistData = await getCurrentWishlist();
      if (inWishlist && wishlistData) {
        const items = await fetchWishlistItems(wishlistData.id, product.id);
        const item = items.find(i => i.product === product.id || i.product?.id === product.id);
        if (item) await API.delete(`/api/shop-wishlistitems/${item.id}/`);
        setInWishlist(false);
      } else {
        const wishlist = wishlistData || await getOrCreateWishlist();
        await addProductToWishlist(product.id, wishlist.id);
        setInWishlist(true);
      }
      window.dispatchEvent(new Event('wishlistUpdated'));
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
        <div className="pd-empty">
          <h2>{error || "Product not found"}</h2>
          <p>The product you are looking for may have been removed or is unavailable.</p>
          <Link to="/shop-categories/proteins" className="red-cta">Return to Shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isNutrition = product.product_type === "nutrition" || Object.keys(product.nutrition || {}).length > 0;
  const isClothing = product.product_type === "clothing" || Object.keys(product.clothing || {}).length > 0;
  const isFootwear = product.product_type === "footwear" || Object.keys(product.footwear || {}).length > 0;
  const isAccessory = product.product_type === "accessory" || Object.keys(product.accessory || {}).length > 0;

  return (
    <div className="pd-main rediron-theme">
      <Header />

      <div className="breadcrumb">
        <Link to="/shop">Home</Link>
        <span> / </span>
        <Link to={`/shop-categories/${product.category?.slug || product.category?.id}`}>{product.category?.name}</Link>
        <span> / </span>
        <span className="current">{product.name}</span>
      </div>

      <motion.main className="product-main-block" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <section className="pd-gallery-column">
          <div className="pd-img-gallery">
            {product.discount_percent > 0 && <span className="pd-image-badge">{product.discount_percent}% OFF</span>}
            <img src={mainImage || "/assets/placeholder.png"} alt={product.name} />
          </div>
          <div className="pd-thumbs">
            {(images.length ? images : [mainImage]).map((img, index) => (
              <button key={`${img}-${index}`} className={img === mainImage ? "active" : ""} onClick={() => setMainImage(img)} type="button">
                <img src={img || "/assets/placeholder.png"} alt="" />
              </button>
            ))}
          </div>
        </section>

        <section className="pd-info">
          <div className="pd-badge-row">
            {product.category?.name && <Link to={`/shop-categories/${product.category.slug}`} className="pd-chip">{product.category.name}</Link>}
            {product.subcategory?.name && <span className="pd-chip muted">{product.subcategory.name}</span>}
          </div>
          {product.brand?.name && <div className="pd-brand">{product.brand.name}</div>}
          <h1 className="pd-title">{product.name}</h1>
          <div className="pd-rating-line">
            <RatingStars rating={Number(product.rating)} />
            <span><Star size={15} fill="currentColor" /> {Number(product.rating || 0).toFixed(1)}</span>
          </div>
          <p className="pd-short">{product.short_description || product.description}</p>

          {benefits.length > 0 && (
            <div className="pd-benefit-strip">
              {benefits.slice(0, 4).map((item, index) => (
                <span key={`${item}-${index}`}><CheckCircle2 size={15} /> {typeof item === "string" ? item : item.title}</span>
              ))}
            </div>
          )}

          <InfoGrid title="Specifications" rows={[
            { label: "SKU", value: product.sku },
            { label: "Product Type", value: product.product_type },
            { label: "Stock", value: isAvailable ? `${stock} available` : "Out of stock" },
            { label: "Tags", value: product.tags?.slice(0, 5) }
          ]} />
        </section>

        <aside className="pd-purchase-card">
          <div className="pd-price-row">
            <span className="price">₹{price.toLocaleString()}</span>
            {mrp > price && <span className="mrp">₹{mrp.toLocaleString()}</span>}
            {product.discount_percent > 0 && <span className="discount">Save {product.discount_percent}%</span>}
          </div>

          <div className={isAvailable ? "pd-stock in" : "pd-stock out"}>
            <PackageCheck size={17} /> {isAvailable ? `${stock} in stock` : "Out of stock"}
          </div>

          {needsSize && (
            <div className="pd-size-block">
              <div className="pd-size-head"><Ruler size={16} /> Select Size</div>
              <div className="pd-size-options">
                {sizeOptions.map(size => (
                  <button type="button" key={size} className={selectedSize === size ? "active" : ""} onClick={() => setSelectedSize(size)}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="quantity-section">
            <label>Quantity</label>
            <div className="quantity-control">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity" type="button"><Minus size={16} /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(Math.max(stock, 1), quantity + 1))} aria-label="Increase quantity" type="button"><Plus size={16} /></button>
            </div>
          </div>

          <div className="pd-purchase-row">
            <button className="add-cart" onClick={addToCart} disabled={actionLoading || !isAvailable} type="button">
              <ShoppingCart size={18} /> Add To Cart
            </button>
            <button className="buy-now" onClick={buyNow} disabled={actionLoading || !isAvailable} type="button">
              <Zap size={18} /> Buy Now
            </button>
            <button className="wishlist-btn1" onClick={toggleWishlist} disabled={actionLoading} type="button" aria-label="Wishlist">
              <Heart fill={inWishlist ? "#e53935" : "none"} color={inWishlist ? "#e53935" : "currentColor"} />
            </button>
          </div>

          <div className="pd-trust">
            <div><ShieldCheck size={16} /> Authenticity verified</div>
            <div><Truck size={16} /> Fast delivery</div>
            <div><Sparkles size={16} /> RedIron rewards</div>
          </div>
        </aside>
      </motion.main>

      <section className="pd-detail-layout">
        <section className="pd-section pd-description">
          <h3>Product Details</h3>
          <p>{product.description}</p>
        </section>

        {isNutrition && (
          <>
            <InfoGrid title="Nutrition Facts" rows={[
              { label: "Protein", value: product.nutrition?.protein },
              { label: "Carbs", value: product.nutrition?.carbohydrates },
              { label: "Fat", value: product.nutrition?.fat },
              { label: "Calories", value: product.nutrition?.calories },
              { label: "Serving Size", value: product.nutrition?.serving_size },
              { label: "Flavor", value: product.nutrition?.flavor },
              { label: "Container Size", value: product.nutrition?.container_size }
            ]} />
            <InfoGrid title="Usage And Safety" rows={[
              { label: "Ingredients", value: product.nutrition?.ingredients },
              { label: "Usage", value: product.nutrition?.usage },
              { label: "Warnings", value: product.nutrition?.warnings }
            ]} />
          </>
        )}

        {isClothing && (
          <InfoGrid title="Clothing Details" rows={[
            { label: "Available Sizes", value: product.clothing?.sizes },
            { label: "Material", value: product.clothing?.material },
            { label: "Fit Type", value: product.clothing?.fit_type },
            { label: "Gender", value: product.clothing?.gender },
            { label: "Care Instructions", value: product.clothing?.care_instructions }
          ]} />
        )}

        {isFootwear && (
          <InfoGrid title="Footwear Details" rows={[
            { label: "Available Sizes", value: product.footwear?.available_sizes },
            { label: "Sole Material", value: product.footwear?.sole_material },
            { label: "Upper Material", value: product.footwear?.upper_material },
            { label: "Usage", value: product.footwear?.usage },
            { label: "Weight", value: product.footwear?.weight }
          ]} />
        )}

        {isAccessory && (
          <InfoGrid title="Accessory Details" rows={[
            { label: "Material", value: product.accessory?.material },
            { label: "Durability", value: product.accessory?.durability },
            { label: "Usage", value: product.accessory?.usage },
            { label: "Included Items", value: product.accessory?.included_items }
          ]} />
        )}
      </section>

      <section className="pd-reviews">
        <ReviewSection productId={product.id} />
      </section>

      <section className="related-products-block">
        <h3>Related Products</h3>
        <div className="related-products-list">
          {related.map(prod => <ProductCard key={prod.id} product={prod} />)}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="related-products-block">
          <h3>Recently Viewed</h3>
          <div className="related-products-list">
            {recent.map(prod => <ProductCard key={prod.id} product={prod} />)}
          </div>
        </section>
      )}

      <AnimatePresence>
        <motion.div className="pd-mobile-sticky" initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }}>
          <div>
            <strong>₹{price.toLocaleString()}</strong>
            {mrp > price && <span>₹{mrp.toLocaleString()}</span>}
          </div>
          <button onClick={addToCart} disabled={actionLoading || !isAvailable} type="button">
            <ShoppingCart size={17} /> Add
          </button>
        </motion.div>
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ProductDetail;
