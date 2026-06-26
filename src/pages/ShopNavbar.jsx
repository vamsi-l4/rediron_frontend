import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Dumbbell, Gift, Heart, RefreshCw, Search, ShieldCheck, ShoppingCart, TestTube2, Truck, UserRound } from "lucide-react";
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
import { UserDataContext } from "../contexts/UserDataContext";
import API, { makeAbsolute } from "../components/Api";
import { fetchStoredCart } from "../lib/shopCart";
import { fetchWishlistItems, getCurrentWishlist } from "../lib/shopWishlist";

import "./ShopNavbar.css";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = React.useRef(null);
  const { isAuthenticated } = useContext(AuthContext);
  const { toggleMode } = useContext(ModeContext);
  const { user: clerkUser } = useUser();
  const { userData } = useContext(UserDataContext);
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();

  // Prefer backend user profile data when available, fallback to Clerk user
  const user = userData ? {
    name: userData.name || userData.username || clerkUser?.firstName || clerkUser?.username || 'User',
    profile_image: userData.profile_image || clerkUser?.profileImageUrl || null
  } : clerkUser ? {
    name: clerkUser.firstName || clerkUser.username || 'User',
    profile_image: clerkUser.profileImageUrl || null
  } : null;

  const resolvedProfileImage = user && user.profile_image ? makeAbsolute(String(user.profile_image).split('?')[0]) : null;




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
        const wishlistData = await getCurrentWishlist();
        if (wishlistData) {
          const items = await fetchWishlistItems(wishlistData.id);
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
      const cart = await fetchStoredCart().catch(() => null);
      if (cart) {
        const totalItems = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
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
    <header className="shopnavbar-header">

      {/* Top Banner */}


      {/* Showcase Strip */}
      <div className="header-showcase" aria-label="Shop highlights">
        <div className="header-showcase-track">
          <span className="header-showcase-pill"><TestTube2 size={14} /> Premium Lab-Tested</span>
          <span className="header-showcase-pill"><Truck size={14} /> Free Shipping ₹999+</span>
          <span className="header-showcase-pill"><ShieldCheck size={14} /> Secure Checkout</span>
          <span className="header-showcase-pill"><CheckCircle2 size={14} /> Genuine Products</span>
          <span className="header-showcase-pill"><RefreshCw size={14} /> Easy Returns</span>
          <span className="header-showcase-pill"><Gift size={14} /> Best Offers Weekly</span>
        </div>
      </div>


      {/* Main Header */}
      <div className="shopnavbar-header-container">
        <div className="shopnavbar-header-main">
          {/* Logo */}
          <div className="shopnavbar-header-logo">
            <Link to="/shop" aria-label="Rediron shop home">
              <img className="shopnavbar-logo-img" src="/logo.png" alt="Rediron" />
            </Link>
          </div>


          {/* Search Bar - Desktop */}
          <div className="shopnavbar-header-search-desktop" ref={searchRef} style={{ position: "relative" }}>
            <div className="header-search-wrapper">
              <Search className="shopnavbar-search-icon" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="shopnavbar-header-search-input"
              />
              <div className="shopnavbar-search-highlight"></div>
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
          <div className="shopnavbar-header-icons">
            {/* Wishlist */}
            <Link to="/shop-wishlist" className="shopnavbar-wishlist-btn" aria-label="Wishlist">
              <Heart className="shopnavbar-icon-heart" />
              <Badge className="shopnavbar-wishlist-badge">{wishlistCount}</Badge>
            </Link>

            {/* Cart */}
            <Link to="/shop-carts" className="shopnavbar-cart-btn" aria-label="Cart">
              <ShoppingCart className="shopnavbar-icon-cart" />
              <Badge className="shopnavbar-cart-badge">{cartCount}</Badge>
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
              <Dumbbell size={16} aria-hidden="true" />
              <span>Gym</span>
            </button>

            {/* Login/Profile Button */}
            {isAuthenticated && user ? (
              <Link to="/profile" className="profile-link" aria-label="Account">
                {resolvedProfileImage ? (
                  <img src={resolvedProfileImage} alt="" className="profile-image" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }} />
                ) : null}
                <div className="profile-placeholder" style={{ display: resolvedProfileImage ? 'none' : 'flex' }}>
                  <UserRound size={18} aria-hidden="true" />
                </div>
              </Link>
            ) : (
            <a href="/login" className="shopnavbar-login-btn">Login</a>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="shopnavbar-header-nav">
        <div className="shopnavbar-nav-container">
          <div className="shopnavbar-nav-links">
            <div className="shopnavbar-nav-list">
              <DropdownMenu>
              <DropdownMenuTrigger className="shopnavbar-nav-link">
                  ALL PRODUCTS
                </DropdownMenuTrigger>
              <DropdownMenuContent className="shopnavbar-nav-dropdown">
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
                <DropdownMenuTrigger className="shopnavbar-nav-link">STORES</DropdownMenuTrigger>
                <DropdownMenuContent className="shopnavbar-nav-dropdown">
                  <DropdownMenuItem className="shopnavbar-nav-dropdown-item" onClick={() => navigate('/shop-dealers')}>
                    Store Locator
                  </DropdownMenuItem>
                  <DropdownMenuItem className="shopnavbar-nav-dropdown-item" onClick={() => navigate('/shop-business-inquiries')}>
                    Franchise
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>





              <Link to="/shop-contacts" className="nav-link">
                CHAT SUPPORT
              </Link>

              <Link to="/shop-about" className="nav-link">
                OUR STORY
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

