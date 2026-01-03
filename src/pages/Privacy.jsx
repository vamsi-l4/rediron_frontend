import React, { useEffect, useState } from "react";
import "./Privacy.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";

const API_BASE = window.location.hostname === 'localhost' ? "http://localhost:8000/api" : (process.env.REACT_APP_API_BASE_URL || "https://rediron-backend-1.onrender.com") + "/api";

const Privacy = () => {
  const [policy, setPolicy] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPolicy() {
      setLoading(true);
      // Try from shop API or fallback hardcoded
      try {
        const res = await fetch(`${API_BASE}/shop-privacy/`);
        if (res.ok) {
          const json = await res.json();
          const data = json.results ? json.results[0] : json[0];
          setPolicy(data ? (data.text || data.content) : "");
        } else {
          setPolicy("");
        }
      } catch {
        setPolicy("");
      }
      setLoading(false);
    }
    fetchPolicy();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="privacy-main rediron-theme">
      <Header />
      <div className="privacy-content">
        <div className="privacy-title">Privacy Policy</div>
        {policy ? (
          <div className="privacy-body">
            {policy.split("\n").map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        ) : (
          <div className="privacy-body">
            <p>
              At Rediron, your privacy is important to us. We collect only the information necessary to process your orders, enhance your experience, and provide support.
            </p>
            <h3>Information Collected</h3>
            <p>
              We collect name, contact details, address, and purchase history as required for orders and support. We also use cookies and analytics for improving services.
            </p>
            <h3>Data Usage and Security</h3>
            <p>
              Data is used only for order fulfillment, support, loyalty, and personalized offers. We never sell your data to third parties. Secure industry-standard safeguards are in place to protect your information.
            </p>
            <h3>Your Rights</h3>
            <p>
              You may request access, rectification, or deletion of your personal data at any time by contacting our support team.
            </p>
            <h3>Changes</h3>
            <p>
              Any updates to our privacy policy will be posted here.
            </p>
            <p>
              If you have questions, please <a href="/contact" className="red-cta">contact us</a>.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
