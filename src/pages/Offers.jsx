import React, { useEffect, useState } from "react";
import "./Offers.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";

const API_BASE = "http://localhost:8000/api";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      setLoading(true);
      const res = await fetch(`${API_BASE}/shop-coupons/`);
      const json = await res.json();
      setOffers(json.results ? json.results : json);
      setLoading(false);
    }
    fetchOffers();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="offers-main rediron-theme">
      <Header />
      <div className="offers-title">Rediron Deals & Offers</div>
      <div className="offers-list">
        {offers.length === 0 ? (
          <div className="offers-none">No available offers or coupons right now.</div>
        ) : (
          offers.map((offer) => (
            <div key={offer.id} className="offer-card">
              <div className="offer-card-header">{offer.title || `Coupon: ${offer.code}`}</div>
              <div className="offer-card-desc">{offer.description}</div>
              <div className="offer-card-row">
                <span className="offer-code">{offer.code}</span>
                <span className="offer-discount">{offer.discount_percent || offer.discount_amount}% Off</span>
              </div>
              <div className="offer-validity">Valid until: {offer.valid_till ? new Date(offer.valid_till).toLocaleDateString() : "N/A"}</div>
              <button
                className="copy-offer-btn"
                onClick={() => navigator.clipboard.writeText(offer.code)}
              >
                Copy Code
              </button>
            </div>
          ))
        )}
      </div>
      <div className="offers-help-block">
        Apply codes above while checking out for instant savings.<br />
        Need help? <a href="/faq" className="red-cta">See FAQs</a>.
      </div>
      <Footer />
    </div>
  );
};

export default Offers;
