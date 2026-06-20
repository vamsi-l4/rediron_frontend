import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { Mail, Phone, Send, ShieldCheck } from "lucide-react";



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
  { name: "My Orders", path: "/shop-orders" },
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
    <footer className="shop-footer footer-main rediron-theme">
      <div className="shop-footer footer-ctr">
        {/* Left Side: Brand/About */}
        <div className="shop-footer footer-left">
          <div className="shop-footer footer-col footer-brand">
            <div className="shop-footer footer-logo">
              <img className="shop-footer footer-logo-img" src="/logo.png" alt="Rediron" />
            </div>
            <p>India's leading sports nutrition brand, offering quality supplements to fuel your fitness journey.</p>
            <div className="shop-footer footer-safety-assurance">
              <ShieldCheck size={18} /> 100% Authentic Products
            </div>
          </div>
        </div>

        {/* Right Side: Products, Useful Links, Newsletter */}
        <div className="shop-footer footer-right">
          {/* Column 1: Products */}
          <div className="shop-footer footer-col footer-prod">
            <h4>Products</h4>
            <div>
              {CATEGORY_LINKS.map(cat => (
                <Link key={cat.slug} to={`/shop-categories/${cat.slug}`}>{cat.name}</Link>
              ))}
            </div>
          </div>
          {/* Column 2: Useful Links */}
          <div className="shop-footer footer-col footer-links">
            <h4>Useful Links</h4>
            <div>
              {INFO_LINKS.map(link => (
                <Link key={link.name} to={link.path}>{link.name}</Link>
              ))}
            </div>
          </div>
          {/* Column 3: Newsletter */}
          <div className="shop-footer footer-col footer-newsletter">
            <h4>Subscribe to Newsletter</h4>
            <form
              className="shop-footer footer-news-form"
              onSubmit={e => {
                e.preventDefault();
                // Integrate your newsletter API here
                alert("Thanks for subscribing!");
              }}
            >
              <input type="email" placeholder="Your Email" required />
              <button type="submit" aria-label="Subscribe">
                <Send size={17} aria-hidden="true" />
              </button>
            </form>
            <div className="shop-footer footer-contact-info">
              <div><Phone size={16} aria-hidden="true" /> +916302765369</div>
              <div><Mail size={16} aria-hidden="true" /> info@Rediron.com</div>
            </div>
            <div className="shop-footer footer-socials">
              {SOCIALS.map(soc => (
                <a key={soc.label} href={soc.url} target="_blank" rel="noopener noreferrer" aria-label={soc.label}>{soc.icon}</a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="shop-footer footer-bottom">
        <p>
          <strong>Disclaimer:</strong> All RedIron products are manufactured at FSSAI-approved facilities and are not intended to diagnose, treat, cure, or prevent disease.
        </p>
        <p className="copyright">&copy; {new Date().getFullYear()} RedIron. All rights reserved.</p>
      </div>

    </footer>
);

export default Footer;
