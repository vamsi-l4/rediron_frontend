import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navbar.css';
import { AuthContext } from '../contexts/AuthContext';
import { ModeContext } from '../contexts/ModeContext';
import { UserDataContext } from '../contexts/UserDataContext';

const Navbar = ({ onModeSwitch }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const { userData } = useContext(UserDataContext);
  const { mode } = useContext(ModeContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);



  return (
    <>
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -70, opacity: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      >
        <div className="navbar-container">
          <div className="logo">
            <Link to="/">RedIron</Link>
          </div>
          <ul className={isMobileMenuOpen ? 'nav-links active' : 'nav-links'}>
            <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
            <li><Link to="/equipment" onClick={() => setMobileMenuOpen(false)}>Equipment</Link></li>
            <li><Link to="/articles" onClick={() => setMobileMenuOpen(false)}>Articles</Link></li>
            <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
            <li><Link to="/about" onClick={() => setMobileMenuOpen(false)}>AboutUs</Link></li>
            <li>
              <button onClick={onModeSwitch} className="mode-switch-btn">
                {mode === 'shop' ? 'Switch to Gym' : 'Switch to Shop'}
              </button>
            </li>
            {isAuthenticated && userData ? (
              <li className="profile-link">
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  {userData.profile_image ? (
                    <img src={userData.profile_image} alt="Profile" className="profile-image" />
                  ) : (
                    <div className="profile-placeholder">{userData.name.charAt(0).toUpperCase()}</div>
                  )}
                  {/* Remove username text to show only circle */}
                  {/* <span className="profile-name">{userData.name}</span> */}
                </Link>
              </li>
            ) : (
              <li><Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link></li>
            )}
          </ul>
          <div
            className="hamburger"
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
      </motion.nav>
    </>
  );
};

export default Navbar;
