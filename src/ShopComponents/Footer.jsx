import React, { useEffect, useState } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { Mail, Phone, Send, ShieldCheck } from "lucide-react";
import API from "../components/Api";

const INFO_LINKS = [
  { name: "About Us", path: "/shop-about" },
  { name: "My Orders", path: "/shop-orders" },
  { name: "FAQs", path: "/shop-faqs" },
  { name: "Stores", path: "/shop-dealers" },
  { name: "Terms", path: "/shop/terms" },
  { name: "Coupons", path: "/shop-coupons" },
  { name: "Privacy Policy", path: "/shop/privacy" },
  { name: "Returns", path: "/shop/refund" },
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

const fallbackCategories = [
  { name: "Proteins", slug: "proteins" },
  { name: "Supplements", slug: "supplements" },
  { name: "Vitamins", slug: "vitamins" },
  { name: "Healthy Foods", slug: "healthy-foods" },
  { name: "Gym Wear", slug: "gym-wear" },
  { name: "Footwear", slug: "footwear" },
  { name: "Accessories", slug: "accessories" }
];

const Footer = () => {
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    let cancelled = false;
    API.get('/api/shop-categories/')
      .then(res => {
        if (cancelled) return;
        const rows = res.data.results || res.data || [];
        if (rows.length) setCategories(rows);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
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
              {categories.map(cat => (
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
};

export default Footer;
