import React, { useEffect, useState, useContext } from "react";
import "./Wishlist.css";

import Header from "./ShopNavbar";
import Footer from "../ShopComponents/Footer";
import ProductCard from "../ShopComponents/ProductCard";
import Loader from "../ShopComponents/Loader";
import API from "../components/Api";
import { AuthContext } from "../contexts/AuthContext";
import { Trash2, HeartCrack } from "lucide-react";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    async function fetchWishlist() {
      try {
        const res = await API.get('/api/shop-wishlists/');
        const wishlistData = res.data.results ? res.data.results[0] : res.data[0]; // Assuming one wishlist per user
        if (wishlistData) {
          const itemsRes = await API.get(`/api/shop-wishlistitems/?wishlist=${wishlistData.id}`);
          setWishlist({ ...wishlistData, items: itemsRes.data.results || itemsRes.data });
        }
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, [isAuthenticated]);

  const handleRemove = async (itemId) => {
    try {
      await API.delete(`/api/shop-wishlistitems/${itemId}/`);
      // Refetch wishlist
      const res = await API.get('/api/shop-wishlists/');
      const wishlistData = res.data.results ? res.data.results[0] : res.data[0];
      if (wishlistData) {
        const itemsRes = await API.get(`/api/shop-wishlistitems/?wishlist=${wishlistData.id}`);
        setWishlist({ ...wishlistData, items: itemsRes.data.results || itemsRes.data });
      }
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="wishlist-main rediron-theme">
        <Header />
        <div className="wishlist-content">
          <div className="wishlist-empty">
            <HeartCrack size={64} className="empty-icon" />
            <h2>Please log in to view your wishlist.</h2>
            <p>Save your favorite items and track their prices!</p>
            <Link to="/login" className="shop-link">Login Now</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) return <Loader />;

  return (
    <div className="wishlist-main rediron-theme">
      <Header />
      <div className="wishlist-content">
        <h2 className="wishlist-title">My Wishlist <span className="wishlist-count">({wishlist?.items?.length || 0})</span></h2>
        {wishlist && wishlist.items && wishlist.items.length > 0 ? (
          <div className="wishlist-products">
            {wishlist.items.map((item) => (
              <div key={item.id} className="wishlist-item">
                <div className="wishlist-product-wrapper">
                  <ProductCard product={item.product} />
                </div>
                <button onClick={() => handleRemove(item.id)} className="remove-btn" title="Remove from Wishlist">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-wishlist">
            <HeartCrack size={64} className="empty-icon" />
            <h2>Your wishlist is empty.</h2>
            <p>Explore our products and find something you love!</p>
            <Link to="/shop" className="shop-link">Start Shopping</Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
