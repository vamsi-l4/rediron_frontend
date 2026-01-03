import React, { useEffect, useState } from "react";
import "./Terms.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";

const API_BASE = window.location.hostname === 'localhost' ? "http://localhost:8000/api" : (process.env.REACT_APP_API_BASE_URL || "https://rediron-backend-1.onrender.com") + "/api";

const Terms = () => {
  const [terms, setTerms] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTerms() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/shop-terms/`);
        if (res.ok) {
          const json = await res.json();
          const data = json.results ? json.results[0] : json[0];
          setTerms(data ? (data.text || data.content) : "");
        } else setTerms("");
      } catch {
        setTerms("");
      }
      setLoading(false);
    }
    fetchTerms();
  }, []);

  if (loading) return <Loader />;
  return (
    <div className="terms-main rediron-theme">
      <Header />
      <div className="terms-content">
        <div className="terms-title">Terms & Conditions</div>
        <div className="terms-body">
          {terms
            ? terms.split("\n").map((line, idx) => (
                <p key={idx}>{line}</p>
              ))
            : (
              <>
                <h3>General Terms</h3>
                <p>
                  By using this site you agree to Rediron’s purchase, privacy, and refund policies. Product usage is at buyer's discretion; seek professional guidance.
                </p>
                <h3>Pricing & Offers</h3>
                <p>
                  All prices and offers are subject to change without notice. Discounts and loyalty points may not be combined with certain promotions.
                </p>
                <h3>Product Authenticity</h3>
                <p>
                  Genuine Rediron products are only available through authorized stores, partners, and our website.
                </p>
                <h3>Support</h3>
                <p>
                  For disputes, contact <a href="/contact" className="red-cta">Customer Support</a>.
                </p>
              </>
            )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
