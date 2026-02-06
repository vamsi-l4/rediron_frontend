import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Heart, Menu, X } from "lucide-react";
import Input from "../components/ui/Input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/DropdownMenu";
import Badge from "../components/ui/Badge";
import API from "../components/Api";
import { AuthContext } from "../contexts/AuthContext";
import { UserDataContext } from "../contexts/UserDataContext";
import { useUser } from "@clerk/clerk-react";
import { ModeContext } from "../contexts/ModeContext";
import "./Header.css";

const Header = ({ user, cartCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("solidBloodRed");
  const [currentBanner, setCurrentBanner] = useState(0);
  const [categories, setCategories] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);
  const { user: clerkUser } = useUser();
  const { userData } = useContext(UserDataContext);
  const { toggleMode, mode } = useContext(ModeContext);

  // Use UserDataContext (which has fresh data from server)
  // Fall back to Clerk user if context data not available
  const displayUser = userData ? {
    name: userData.name || userData.username || userData.email || 'User',
    email: userData.email || null,
    profile_image: userData.profile_image || null
  } : clerkUser ? {
    name: clerkUser.firstName || clerkUser.username || 'User',
    email: clerkUser.emailAddresses?.[0]?.emailAddress || null,
    profile_image: clerkUser.profileImageUrl || null
  } : null;

  // Fetch categories for dropdown
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await API.get('/api/shop-categories/');
        const data = res.data.results ? res.data.results : res.data;
        setCategories(data);
      } catch (error) {
        console.warn('Failed to fetch categories:', error.message);
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  const banners = [
    "🔥 Premium Lab-Tested Supplements | Free Shipping Above ₹999 🔥",
    "💪 Build Muscle with REDIRON | 30-Day Guarantee 💪",
    "🏆 Certified Quality | Trusted by Athletes Worldwide 🏆",
    "🚚 Fast Delivery | Secure Payments | Best Prices 🚚",
    "🎁 Exclusive Offers | Join REDIRON Family Today 🎁",
  ];

  // Auto-rotate banners every 4 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(id);
  }, [banners.length]);

  return (
    <header className={`header ${theme}`}>
      {/* Top Banner Carousel */}
      <div className="header-banner-carousel">
        <div className="banner-content">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`banner-slide ${index === currentBanner ? "active" : ""}`}
            >
              {banner}
            </div>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <div className="header-container">
        <div className="header-main">
          {/* Logo */}
          <div className="header-logo">
            <div
              className="logo-text"
              onClick={() =>
                setTheme(
                  theme === "solidBloodRed" ? "glassmorphism" : "solidBloodRed"
                )
              }
              style={{ cursor: "pointer" }}
            >
              <span className="logo-icon">RI</span>
              <span className="logo-name">REDIRON</span>
            </div>
            <div className="logo-dot"></div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="header-search-desktop">
            <div className="header-search-wrapper">
              <Search className="search-icon" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="header-search-input"
              />
              <div className="search-highlight"></div>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="header-icons">
            {/* Wishlist */}
            <Link to="/shop-rewards" className="wishlist-btn" aria-label="Wishlist">
              <Heart className="icon-heart" />
              <Badge className="wishlist-badge">0</Badge>
            </Link>

            {/* Cart */}
            <Link to="/shop-carts" className="cart-btn" aria-label="Cart">
              <ShoppingCart className="icon-cart" />
              <Badge className="cart-badge">{cartCount || 0}</Badge>
            </Link>

            {/* Login/Profile Button */}
            {isAuthenticated && displayUser ? (
              <Link to="/profile" className="profile-link" title={displayUser.email || displayUser.name}>
                <div className="profile-wrapper">
                  {displayUser.profile_image ? (
                    <img
                      src={displayUser.profile_image}
                      alt="Profile"
                      className="profile-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="profile-placeholder" style={displayUser.profile_image ? { display: 'none' } : {}}>
                    {displayUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-info-tooltip">
                    <div className="profile-name">{displayUser.name}</div>
                    <div className="profile-email">{displayUser.email || 'No email'}</div>
                  </div>
                </div>
              </Link>
            ) : (
              <a href="/login" className="login-btn" style={{ textDecoration: "none" }}>
                Login / Signup
              </a>
            )}

            {/* Mode Switch Button */}
            <button
              onClick={() => {
                const newMode = toggleMode();
                if (newMode === "shop") {
                  window.location.href = "/shop";
                } else {
                  window.location.href = "/";
                }
              }}
              className="mode-switch-btn"
            >
              {mode === "shop" ? "Gym" : "Shop"}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              style={{ display: "none" }}
            >
              {isMenuOpen ? <X className="menu-icon" /> : <Menu className="menu-icon" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="header-search-mobile">
          <div className="header-search-wrapper">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="header-search-input"
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`header-nav ${theme}`}>
        <div className="nav-container">
          <div className={isMenuOpen ? "nav-links open" : "nav-links"}>
            <div className="nav-list">
              <DropdownMenu>
                <DropdownMenuTrigger className="nav-link">
                  ALL PRODUCTS
                </DropdownMenuTrigger>
                <DropdownMenuContent className="nav-dropdown">
                  <DropdownMenuItem
                    className="nav-dropdown-item"
                    onClick={() =>
                      (window.location.href = "/shop-categories/proteins")
                    }
                  >
                    Protein
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="nav-dropdown-item"
                    onClick={() =>
                      (window.location.href = "/shop-categories/mass-gainers")
                    }
                  >
                    Mass Gainer
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="nav-dropdown-item"
                    onClick={() =>
                      (window.location.href = "/shop-categories/pre-workouts")
                    }
                  >
                    Pre-Workout
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="nav-dropdown-item"
                    onClick={() =>
                      (window.location.href = "/shop-categories/vitamins")
                    }
                  >
                    Vitamins
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="nav-dropdown-item"
                    onClick={() =>
                      (window.location.href = "/shop-categories/health-food")
                    }
                  >
                    Health Food
                  </DropdownMenuItem>

                  {/* Dynamic categories */}
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      className="nav-dropdown-item"
                      onClick={() =>
                        (window.location.href = `/shop-categories/${category.slug}`)
                      }
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/shop-coupons" className="nav-link">
                OFFERS
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="nav-link">STORES</DropdownMenuTrigger>
                <DropdownMenuContent className="nav-dropdown">
                  <DropdownMenuItem
                    className="nav-dropdown-item"
                    onClick={() => (window.location.href = "/shop-dealers")}
                  >
                    Store Locator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="nav-dropdown-item"
                    onClick={() =>
                      (window.location.href = "/shop-business-inquiries")
                    }
                  >
                    Franchise
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/about" className="nav-link">
                OUR STORY
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="nav-link">
                  AUTHENTICITY
                </DropdownMenuTrigger>
                <DropdownMenuContent className="nav-dropdown">
                  <DropdownMenuItem
                    className="nav-dropdown-item"
                    onClick={() => (window.location.href = "/shop-faqs")}
                  >
                    Lab Reports
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="nav-dropdown-item"
                    onClick={() => (window.location.href = "/shop-faqs")}
                  >
                    Batch Verification
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="nav-dropdown-item"
                    onClick={() => (window.location.href = "/shop-faqs")}
                  >
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
