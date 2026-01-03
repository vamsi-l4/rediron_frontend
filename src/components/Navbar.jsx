import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "../contexts/AuthContext";
import { ModeContext } from "../contexts/ModeContext";
import { UserDataContext } from "../contexts/UserDataContext";
import { makeAbsolute } from "./Api";

const Navbar = ({ onModeSwitch }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const { userData } = useContext(UserDataContext);
  const mode = useContext(ModeContext);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">RedIron</Link>
        </div>

        {/* Desktop Nav Links */}
        <ul className="navbar-links">
          <li><Link to="/" className="navbar-link-box">Home</Link></li>
          <li><Link to="/equipment" className="navbar-link-box">Equipment</Link></li>
          <li><Link to="/articles" className="navbar-link-box">Articles</Link></li>
          <li><Link to="/contact" className="navbar-link-box">Contact</Link></li>
          <li><Link to="/about" className="navbar-link-box">About</Link></li>
        </ul>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          <button onClick={onModeSwitch} className="navbar-btn">
            {mode === "shop" ? "Gym" : "Shop"}
          </button>
          
          {isAuthenticated && userData ? (
            <Link to="/profile" className="navbar-btn profile-btn">
              {userData.profile_image ? (
                <img
                  src={makeAbsolute(userData.profile_image)}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="profile-placeholder">
                  {userData.name && userData.name.length > 0 ? userData.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
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
          <li><Link to="/" onClick={() => setMobileMenuOpen(false)} className="navbar-link-box">Home</Link></li>
          <li><Link to="/equipment" onClick={() => setMobileMenuOpen(false)} className="navbar-link-box">Equipment</Link></li>
          <li><Link to="/articles" onClick={() => setMobileMenuOpen(false)} className="navbar-link-box">Articles</Link></li>
          <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="navbar-link-box">Contact</Link></li>
          <li><Link to="/about" onClick={() => setMobileMenuOpen(false)} className="navbar-link-box">About</Link></li>
        </ul>
        <div className="navbar-actions">
          <button onClick={() => { onModeSwitch(); setMobileMenuOpen(false); }} className="navbar-btn">
            {mode === "shop" ? "Gym" : "Shop"}
          </button>
          
          {isAuthenticated && userData ? (
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="navbar-btn profile-btn">
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
