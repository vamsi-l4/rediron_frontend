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
import { categories } from "../data/mockData";
import { AuthContext } from "../contexts/AuthContext";
import API from "../components/Api";

import "./ShopNavbar.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("solidBloodRed");
  const { isAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      API.get('/accounts/profile/')
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleStorageChange = () => {
      if (!localStorage.getItem('accessToken')) {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
            <div className="logo-text" onClick={() => setTheme(theme === "solidBloodRed" ? "glassmorphism" : "solidBloodRed")} style={{ cursor: 'pointer' }}>
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
            {/* Theme Switcher */}
            <div className="theme-switcher">
              <button onClick={() => setTheme("solidBloodRed")} className="theme-btn">Solid</button>
              <button onClick={() => setTheme("glassmorphism")} className="theme-btn">Glass</button>
              <button onClick={() => setTheme("gradient")} className="theme-btn">Gradient</button>
            </div>

            {/* Wishlist */}
            <button className="wishlist-btn" aria-label="Wishlist">
              <Heart className="icon-heart" />
              <Badge className="wishlist-badge">0</Badge>
            </button>

            {/* Cart */}
            <button className="cart-btn" aria-label="Cart">
              <ShoppingCart className="icon-cart" />
              <Badge className="cart-badge">2</Badge>
            </button>

            {/* Login/Profile Button */}
            {isAuthenticated && user ? (
              <Link to="/profile" className="profile-link">
                {user.profile_image ? (
                  <img src={user.profile_image} alt="Profile" className="profile-image" />
                ) : (
                  <div className="profile-placeholder">{user.name.charAt(0).toUpperCase()}</div>
                )}
              </Link>
            ) : (
              <a href="/login" className="login-btn">Login</a>
            )}

            {/* Mobile Menu Button - only visible on mobile */}
            <button
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              style={{ display: 'none' }}
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
                {/* Add the requested categories in the first section */}
                <DropdownMenuItem className="nav-dropdown-item">Protein</DropdownMenuItem>
                <DropdownMenuItem className="nav-dropdown-item">Mass Gainer</DropdownMenuItem>
                <DropdownMenuItem className="nav-dropdown-item">Pre-Workout</DropdownMenuItem>
                <DropdownMenuItem className="nav-dropdown-item">Vitamins</DropdownMenuItem>
                <DropdownMenuItem className="nav-dropdown-item">Health Food</DropdownMenuItem>
                {/* Then render the existing categories */}
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    className="nav-dropdown-item"
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

              <a href="#offers" className="nav-link">
                OFFERS
              </a>

              <DropdownMenu>
                <DropdownMenuTrigger className="nav-link">STORES</DropdownMenuTrigger>
                <DropdownMenuContent className="nav-dropdown">
                  <DropdownMenuItem className="nav-dropdown-item">
                    Store Locator
                  </DropdownMenuItem>
                  <DropdownMenuItem className="nav-dropdown-item">
                    Franchise
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <a href="#story" className="nav-link">
                OUR STORY
              </a>

              <DropdownMenu>
                <DropdownMenuTrigger className="nav-link">
                  AUTHENTICITY
                </DropdownMenuTrigger>
                <DropdownMenuContent className="nav-dropdown">
                  <DropdownMenuItem className="nav-dropdown-item">
                    Lab Reports
                  </DropdownMenuItem>
                  <DropdownMenuItem className="nav-dropdown-item">
                    Batch Verification
                  </DropdownMenuItem>
                  <DropdownMenuItem className="nav-dropdown-item">
                    Certifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <a href="#support" className="nav-link">
                CHAT SUPPORT
              </a>

              <a href="#business" className="nav-link">
                BUSINESS ENQUIRY
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
