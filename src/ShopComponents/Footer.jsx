import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn, FaTwitter, FaCreditCard, FaUniversity, FaCalculator, FaTruck, FaShieldAlt } from "react-icons/fa";


// const PRODUCT_LINKS = [
//   "Proteins", "Gainers", "Pre/Post Workout", "Ayurveda",
//   "Fit Foods", "Vitamin Supplements", "Fat Loss", "Fitness Accessories", "Apparel"
// ];

const CATEGORY_LINKS = [
  { name: "Proteins", slug: "proteins" },
  { name: "Gainers", slug: "gainers" },
  { name: "Pre/Post Workout", slug: "pre-post-workout" },
  { name: "Ayurveda", slug: "ayurveda" },
  { name: "Fit Foods", slug: "fit-foods" },
  { name: "Vitamin Supplements", slug: "vitamin-supplements" },
  { name: "Fat Loss", slug: "fat-loss" },
  { name: "Fitness Accessories", slug: "fitness-accessories" },
  { name: "Apparel Overall", slug: "apparel" }
];

const INFO_LINKS = [
  { name: "About Us", path: "/about" },
  { name: "FAQs", path: "/shop-faqs" },
  { name: "Blog", path: "/shop-blogs" },
  { name: "Trade Partners", path: "/shop-dealers" },
  { name: "T & C", path: "/shop/terms" },
  { name: "MB Coupons", path: "/shop-coupons" },
  { name: "Privacy Policy", path: "/shop/privacy" },
  { name: "Return Refund", path: "/shop/refund" },
  { name: "Contact Us", path: "/shop-contacts" },
  { name: "Business Enquiry", path: "/shop-business-inquiries" }
];
const SOCIALS = [
  { icon: <FaInstagram />, url: "https://instagram.com/", label: "Instagram" },
  { icon: <FaFacebookF />, url: "https://facebook.com/", label: "Facebook" },
  { icon: <FaYoutube />, url: "https://youtube.com/", label: "YouTube" },
  { icon: <FaLinkedinIn />, url: "https://linkedin.com/", label: "LinkedIn" },
  { icon: <FaTwitter />, url: "https://twitter.com/", label: "Twitter" }
];

const Footer = () => (
  <>
    <footer className="footer-main rediron-theme">
      <div className="footer-ctr">
        {/* Left Side: Brand/About */}
        <div className="footer-left">
          <div className="footer-col footer-brand">
            <div className="footer-logo">Rediron</div>
          </div>
        </div>

        {/* Right Side: Products, Useful Links, Newsletter */}
        <div className="footer-right">
          {/* Column 1: Products */}
          <div className="footer-col footer-prod">
            <h4>Products</h4>
            <div>
              {CATEGORY_LINKS.map(cat => (
                <Link key={cat.slug} to={`/shop-categories/${cat.slug}`}>{cat.name}</Link>
              ))}
            </div>
          </div>
          {/* Column 2: Useful Links */}
          <div className="footer-col footer-links">
            <h4>Useful Links</h4>
            <div>
              {INFO_LINKS.map(link => (
                <Link key={link.name} to={link.path}>{link.name}</Link>
              ))}
            </div>
          </div>
          {/* Column 3: Newsletter */}
          <div className="footer-col footer-newsletter">
            <h4>Subscribe to Newsletter</h4>
            <form
              className="footer-news-form"
              onSubmit={e => {
                e.preventDefault();
                // Integrate your newsletter API here
                alert("Thanks for subscribing!");
              }}
            >
              <input type="email" placeholder="Your Email" required />
              <button type="submit">Submit</button>
            </form>
            <div className="footer-contact-info">
              <div>+91 85 277 32 632</div>
              <div>info@Muscleblaze.com</div>
            </div>
            <div className="footer-safety">100% Safe & Secure Payments</div>
            <div className="footer-payments">
              <span className="payment-icon"><FaShieldAlt /> UPI</span>
              <span className="payment-icon"><FaCreditCard /> Visa</span>
              <span className="payment-icon"><FaCreditCard /> Master</span>
              <span className="payment-icon"><FaUniversity /> Net Banking</span>
              <span className="payment-icon"><FaCalculator /> EMI</span>
              <span className="payment-icon"><FaTruck /> COD</span>
            </div>
            <div className="footer-socials">
              {SOCIALS.map(soc => (
                <a key={soc.label} href={soc.url} target="_blank" rel="noopener noreferrer">{soc.icon}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
    <div className="footer-bottom">
      <p>
       All RedIron products are manufactured at FSSAI approved manufacturing facilities and are not intended to diagnose, treat, cure, or prevent any disease.
      </p>
    </div>
  </>
);

export default Footer;
