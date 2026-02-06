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

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

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
              <li><Link to="/workouts/exercises" className="navbar-link-box">Exercise Videos</Link></li>
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
                  {user.name && user.name.length > 0 ? user.name.charAt(0).toUpperCase() : 'U'}
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

        {/* Hamburger Menu */}
        <div
          className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          role="button"
          aria-label="Toggle menu"
          tabIndex="0"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <ul className="navbar-links">
          <li><Link to={getHomeRoute()} onClick={() => setMobileMenuOpen(false)} className="navbar-link-box">
            {mode === "shop" ? "Shop Home" : "Home"}
          </Link></li>
          {mode !== "shop" && (
            <>
              <li><Link to="/equipment" onClick={() => setMobileMenuOpen(false)} className="navbar-link-box">Equipment</Link></li>
              <li><Link to="/articles" onClick={() => setMobileMenuOpen(false)} className="navbar-link-box">Articles</Link></li>
              <li><Link to="/workouts/exercises" onClick={() => setMobileMenuOpen(false)} className="navbar-link-box">Exercise Videos</Link></li>
            </>
          )}
          <li><Link to={mode === "shop" ? "/shop-contacts" : "/contact"} onClick={() => setMobileMenuOpen(false)} className="navbar-link-box">Contact</Link></li>
          <li><Link to={mode === "shop" ? "/shop-about" : "/about"} onClick={() => setMobileMenuOpen(false)} className="navbar-link-box">About</Link></li>
        </ul>
        <div className="navbar-actions">
          <button onClick={() => { onModeSwitch(); setMobileMenuOpen(false); }} className="navbar-btn">
            {mode === "shop" ? "Gym" : "Shop"}
          </button>
          
          {isAuthenticated && user ? (
            <Link to={mode === "shop" ? "/shop-userprofile" : "/profile"} onClick={() => setMobileMenuOpen(false)} className="navbar-btn profile-btn">
              Profile
            </Link>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="navbar-btn navbar-btn-login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
