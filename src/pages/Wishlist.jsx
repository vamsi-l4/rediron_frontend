import React, { useEffect, useState, useContext } from "react";
import "./Wishlist.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import ProductCard from "../ShopComponents/ProductCard";
import Loader from "../ShopComponents/Loader";
import API from "../components/Api";
import { AuthContext } from "../contexts/AuthContext";

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
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="wishlist-main rediron-theme">
        <Header />
        <div className="wishlist-content">
          <h2>Please log in to view your wishlist.</h2>
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
        <h2>My Wishlist</h2>
        {wishlist && wishlist.items && wishlist.items.length > 0 ? (
          <div className="wishlist-grid">
            {wishlist.items.map((item) => (
              <div key={item.id} className="wishlist-item">
                <ProductCard product={item.product} />
                <button onClick={() => handleRemove(item.id)} className="remove-btn">Remove</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-wishlist">
            <h3>Your wishlist is empty.</h3>
            <a href="/shop" className="shop-link">Start Shopping</a>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
