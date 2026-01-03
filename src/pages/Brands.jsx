import React, { useEffect, useState } from "react";
import "./Brands.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";
import API from "../components/Api";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await API.get('/api/shop-brands/');
        setBrands(res.data.results || res.data);
      } catch (error) {
        console.error('Failed to fetch brands:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBrands();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="brands-main rediron-theme">
      <Header />
      <div className="brands-content">
        <h2>Our Brands</h2>
        {brands.length > 0 ? (
          <div className="brands-grid">
            {brands.map((brand) => (
              <div key={brand.id} className="brand-card">
                {brand.logo && <img src={brand.logo} alt={brand.name} />}
                <h3>{brand.name}</h3>
                <p>{brand.description}</p>
                {brand.website && <a href={brand.website} target="_blank" rel="noopener noreferrer">Visit Website</a>}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-brands">
            <h3>No brands available.</h3>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Brands;
