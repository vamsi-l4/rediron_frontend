import React from 'react'; 
import { Link } from 'react-router-dom'; 
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; 
import './Footer.css';

const Footer = () => { 
  return ( 
    <footer className="footer"> 
      <div className="footer-top"> 
        <div className="footer-left"> 
          <h2>RedIron Gym</h2> 
          <p> 
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Habitasse 
            arcu vulputate velit scelerisque. 
          </p> 
          <div className="social-icons"> 
            <a href="https://facebook.com" aria-label="Facebook"><FaFacebook /></a> 
            <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a> 
            <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a> 
          </div> 
        </div> 
        <div className="footer-right"> 
          <h4>Pages</h4> 
          <ul> 
            <li><Link to="/">Home</Link></li> 
            <li><Link to="/about">About</Link></li> 
            <li><Link to="/equipment">Equipment</Link></li> 
            <li><Link to="/trainers">Trainers</Link></li> 
            <li><Link to="/articles">Articles</Link></li> 
            <li><Link to="/contact">Contact</Link></li> 
          </ul> 
        </div> 
      </div> 
      <div className="footer-bottom"> 
        <p>Copyright © RedIron Gym | Powered by React</p> 
      </div> 
    </footer> 
  ); 
}; 

export default Footer;