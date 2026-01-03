import React, { useEffect, useState } from "react";
import "./Coupons.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";
import API from "../components/Api";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const res = await API.get('/api/shop-coupons/');
        setCoupons(res.data.results || res.data);
      } catch (error) {
        console.error('Failed to fetch coupons:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCoupons();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="coupons-main rediron-theme">
      <Header />
      <div className="coupons-content">
        <h2>Available Coupons</h2>
        {coupons.length > 0 ? (
          <div className="coupons-grid">
            {coupons.filter(c => c.active).map((coupon) => (
              <div key={coupon.id} className="coupon-card">
                <h3>{coupon.code}</h3>
                <p>{coupon.description}</p>
                <p>Discount: {coupon.discount_percent}%</p>
                <p>Valid from: {new Date(coupon.valid_from).toLocaleDateString()} to {new Date(coupon.valid_to).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-coupons">
            <h3>No coupons available at the moment.</h3>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Coupons;
