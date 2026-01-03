import React, { useEffect, useState } from "react";
import "./Offers.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";
import API from "../components/Api";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await API.get('/api/shop-offers/');
        setOffers(res.data.results || res.data);
      } catch (error) {
        console.error('Failed to fetch offers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="offers-main rediron-theme">
      <Header />
      <div className="offers-content">
        <h2>Special Offers</h2>
        {offers.length > 0 ? (
          <div className="offers-grid">
            {offers.filter(o => o.active).map((offer) => (
              <div key={offer.id} className="offer-card">
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <p>Discount: {offer.discount_percent}%</p>
                <p>Valid from: {new Date(offer.valid_from).toLocaleDateString()} to {new Date(offer.valid_to).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-offers">
            <h3>No offers available at the moment.</h3>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Offers;
