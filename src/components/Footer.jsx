import React from "react";
import { Link } from "react-router-dom"; 
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Column - Social Icons */}
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Middle Column - Brand */}
        <div className="footer-brand">
          <h2>RedIron Gym</h2>
          <p>Strength. Power. Discipline. Transform your body and mind.</p>
        </div>

        {/* Right Column - Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/equipment">Equipment</Link></li>
            <li><Link to="/trainers">Trainers</Link></li>
            <li><Link to="/articles">Articles</Link></li>
            <li><Link to="/performance-lab">Performance Lab</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} RedIron Gym. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;