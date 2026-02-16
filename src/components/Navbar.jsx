import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "../contexts/AuthContext";
import { ModeContext } from "../contexts/ModeContext";
import { UserDataContext } from "../contexts/UserDataContext";
import { useUser } from "@clerk/clerk-react";

const Navbar = ({ onModeSwitch }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const { user: clerkUser } = useUser();
  const { userData } = useContext(UserDataContext);
  const mode = useContext(ModeContext);

  // Use UserDataContext (which has fresh data from server)
  // Fall back to Clerk user if context data not available
  const user = userData ? {
    name: userData.name || userData.username || userData.email || 'User',
    email: userData.email || null,
    profile_image: userData.profile_image || null
  } : clerkUser ? {
    name: clerkUser.firstName || clerkUser.username || 'User',
    email: clerkUser.emailAddresses?.[0]?.emailAddress || null,
    profile_image: clerkUser.profileImageUrl || null
  } : null;

  // Get first letter for avatar
  const getFirstLetter = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest('.navbar')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  const getHomeRoute = () => {
    return mode === "shop" ? "/shop" : "/";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to={getHomeRoute()}>RedIron</Link>
        </div>

        {/* Desktop Nav Links */}
        <ul className="navbar-links">
          <li><Link to={getHomeRoute()} className="navbar-link-box">{mode === "shop" ? "Shop Home" : "Home"}</Link></li>
          {mode !== "shop" && (
            <>
              <li><Link to="/equipment" className="navbar-link-box">Equipment</Link></li>
              <li><Link to="/articles" className="navbar-link-box">Articles</Link></li>
              
            </>
          )}
          <li><Link to={mode === "shop" ? "/shop-contacts" : "/contact"} className="navbar-link-box">Contact</Link></li>
          <li><Link to={mode === "shop" ? "/shop-about" : "/about"} className="navbar-link-box">About</Link></li>
        </ul>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          <button onClick={onModeSwitch} className="navbar-btn">
            {mode === "shop" ? "Gym" : "Shop"}
          </button>
          
          {isAuthenticated && user ? (
            <Link to={mode === "shop" ? "/shop-userprofile" : "/profile"} className="navbar-btn profile-btn" title={user.email || user.name}>
              <div className="profile-wrapper">
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt="Profile"
                    className="profile-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="profile-placeholder" style={user.profile_image ? { display: 'none' } : {}}>
                  {getFirstLetter(user.name)}
                </div>
                <div className="profile-info-tooltip">
                  <div className="profile-name">{user.name}</div>
                  <div className="profile-email">{user.email || 'No email'}</div>
                </div>
              </div>
            </Link>
          ) : (
            <Link to="/login" className="navbar-btn navbar-btn-login">Login</Link>
          )}
        </div>

        {/* Hamburger Menu for Mobile */}
        <div
          className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          role="button"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          tabIndex="0"
          onKeyDown={(e) => e.key === 'Enter' && setMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />}
      <div className={`mobile-menu-drawer ${isMobileMenuOpen ? "active" : ""}`}>
        <ul className="mobile-menu-links">
          <li><Link to={getHomeRoute()} onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">
            {mode === "shop" ? "Shop Home" : "Home"}
          </Link></li>
          {mode !== "shop" && (
            <>
              <li><Link to="/equipment" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">Equipment</Link></li>
              <li><Link to="/articles" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">Articles</Link></li>
              <li><Link to="/workouts/exercises" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">Exercise Videos</Link></li>
            </>
          )}
          <li><Link to={mode === "shop" ? "/shop-contacts" : "/contact"} onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">Contact</Link></li>
          <li><Link to={mode === "shop" ? "/shop-about" : "/about"} onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item">About</Link></li>
        </ul>

        <div className="mobile-menu-actions">
          <button onClick={() => { onModeSwitch(); setMobileMenuOpen(false); }} className="mobile-menu-btn">
            {mode === "shop" ? "Gym Mode" : "Shop Mode"}
          </button>
          
          {isAuthenticated && user ? (
            <Link to={mode === "shop" ? "/shop-userprofile" : "/profile"} onClick={() => setMobileMenuOpen(false)} className="mobile-menu-btn mobile-profile-btn">
              <span className="mobile-profile-letter">{getFirstLetter(user.name)}</span>
              Profile
            </Link>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-btn mobile-login-btn">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
