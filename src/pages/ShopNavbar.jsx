import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import Input from "../components/ui/Input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/DropdownMenu";
import Badge from "../components/ui/Badge";
import { AuthContext } from "../contexts/AuthContext";
import { ModeContext } from "../contexts/ModeContext";
import API, { makeAbsolute } from "../components/Api";

import "./ShopNavbar.css";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = React.useRef(null);
  const [theme] = useState("gradient");

  const { isAuthenticated } = useContext(AuthContext);
  const { toggleMode } = useContext(ModeContext);
  const { user: clerkUser } = useUser();
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();

  // Use Clerk user directly - NO backend API calls
  const user = clerkUser ? {
    name: clerkUser.firstName || clerkUser.username || 'User',
    profile_image: clerkUser.profileImageUrl || null
  } : null;

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await API.get('/api/shop-categories/');
        setCategories(res.data.results || res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  const fetchCounts = useCallback(async () => {
    // Fetch Wishlist count
    if (isAuthenticated) {
      try {
        const wlRes = await API.get('/api/shop-wishlists/');
        const wishlistData = wlRes.data.results ? wlRes.data.results[0] : (wlRes.data.length > 0 ? wlRes.data[0] : null);
        if (wishlistData) {
          const itemsRes = await API.get(`/api/shop-wishlistitems/?wishlist=${wishlistData.id}`);
          const items = itemsRes.data.results || itemsRes.data || [];
          setWishlistCount(items.length);
        } else {
          setWishlistCount(0);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist count", error);
      }
    } else {
      setWishlistCount(0);
    }

    // Fetch Cart count
    try {
      const cartId = localStorage.getItem('cartId');
      if (cartId) {
        const cartRes = await API.get(`/api/shop-carts/${cartId}/`);
        const totalItems = cartRes.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch cart count", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCounts();
    window.addEventListener('cartUpdated', fetchCounts);
    window.addEventListener('wishlistUpdated', fetchCounts);
    return () => {
      window.removeEventListener('cartUpdated', fetchCounts);
      window.removeEventListener('wishlistUpdated', fetchCounts);
    };
  }, [fetchCounts]);

  // Live Search Effect
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      setIsSearching(true);
      const delayDebounceFn = setTimeout(() => {
        API.get(`/api/shop-products/?search=${encodeURIComponent(searchQuery)}`)
          .then((res) => {
            setSearchResults(res.data.results || res.data || []);
          })
          .catch((err) => console.error("Error fetching search results:", err))
          .finally(() => setIsSearching(false));
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Handle click outside search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`header ${theme}`}>
      {/* Top Banner */}
      <div className="header-banner">
        🔥 Premium Lab-Tested Supplements | Free Shipping Above ₹999 🔥
      </div>

      {/* Main Header */}
      <div className="header-container">
        <div className="header-main">
          {/* Logo */}
          <div className="header-logo">
            <div className="logo-text">
              <span className="logo-icon">RI</span>
              <span className="logo-name">REDIRON</span>
            </div>
            <div className="logo-dot"></div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="header-search-desktop" ref={searchRef} style={{ position: "relative" }}>
            <div className="header-search-wrapper">
              <Search className="search-icon" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="header-search-input"
              />
              <div className="search-highlight"></div>
            </div>
            
            {/* Live Search Results Dropdown */}
            {searchQuery.trim().length > 2 && showDropdown && (
              <div className="search-results-dropdown">
                {isSearching ? (
                  <div className="search-dropdown-message">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="search-dropdown-item"
                      onClick={() => {
                        navigate(`/shop-products/${product.id}`);
                        setSearchQuery("");
                        setSearchResults([]);
                        setShowDropdown(false);
                      }}
                    >
                      <img
                        src={makeAbsolute(product.image || product.image2 || product.gallery_images?.[0]?.image)}
                        alt={product.name}
                        className="search-dropdown-img"
                        onError={(e) => { e.target.src = '/img/default-product.jpg'; }}
                      />
                      <div className="search-dropdown-info">
                        <div className="search-dropdown-name">{product.name}</div>
                        <div className="search-dropdown-price">₹{product.price}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="search-dropdown-message">No products found</div>
                )}
              </div>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="header-icons">
            {/* Wishlist */}
            <Link to="/shop-wishlist" className="wishlist-btn" aria-label="Wishlist">
              <Heart className="icon-heart" />
              <Badge className="wishlist-badge">{wishlistCount}</Badge>
            </Link>

            {/* Cart */}
            <Link to="/shop-carts" className="cart-btn" aria-label="Cart">
              <ShoppingCart className="icon-cart" />
              <Badge className="cart-badge">{cartCount}</Badge>
            </Link>

            {/* Switch to Gym Mode Button */}
            <button 
              onClick={() => {
                toggleMode();
                window.location.href = "/";
              }} 
              className="switch-mode-btn" 
              aria-label="Switch to Gym"
              title="Switch to Gym Mode"
            >
              Back to Gym
            </button>

            {/* Login/Profile Button */}
            {isAuthenticated && user ? (
              <Link to="/profile" className="profile-link">
                {user.profile_image ? (
                  <img src={user.profile_image} alt="Profile" className="profile-image" style={{width: '20px', height: '20px'}} />
                ) : (
                  <div className="profile-placeholder" style={{width: '20px', height: '20px'}}>{user.name.charAt(0).toUpperCase()}</div>
                )}
              </Link>
            ) : (
              <a href="/login" className="login-btn">Login</a>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`header-nav ${theme}`}>
        <div className="nav-container">
          <div className="nav-links">
            <div className="nav-list">
              <DropdownMenu>
                <DropdownMenuTrigger className="nav-link">
                  ALL PRODUCTS
                </DropdownMenuTrigger>
              <DropdownMenuContent className="nav-dropdown">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    className="nav-dropdown-item"
                    onClick={() => navigate(`/shop-categories/${category.slug}`)}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

              <Link to="/shop-offers" className="nav-link">
                OFFERS
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="nav-link">STORES</DropdownMenuTrigger>
                <DropdownMenuContent className="nav-dropdown">
                  <DropdownMenuItem className="nav-dropdown-item" onClick={() => navigate('/shop-dealers')}>
                    Store Locator
                  </DropdownMenuItem>
                  <DropdownMenuItem className="nav-dropdown-item" onClick={() => navigate('/shop-business-inquiries')}>
                    Franchise
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/shop-about" className="nav-link">
                OUR STORY
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="nav-link">
                  AUTHENTICITY
                </DropdownMenuTrigger>
                <DropdownMenuContent className="nav-dropdown">
                  <DropdownMenuItem className="nav-dropdown-item" onClick={() => navigate('/shop-faqs')}>
                    Lab Reports
                  </DropdownMenuItem>
                  <DropdownMenuItem className="nav-dropdown-item" onClick={() => navigate('/shop-faqs')}>
                    Batch Verification
                  </DropdownMenuItem>
                  <DropdownMenuItem className="nav-dropdown-item" onClick={() => navigate('/shop-faqs')}>
                    Certifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/shop-contacts" className="nav-link">
                CHAT SUPPORT
              </Link>

              <Link to="/shop-business-inquiries" className="nav-link">
                BUSINESS ENQUIRY
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
