import React, { useEffect, useState } from "react";
import "./Accessories.css";
import ProductCard from "../ShopComponents/ProductCard";
import Loader from "../ShopComponents/Loader";
import CategoryMenu from "../ShopComponents/CategoryMenu";

const API_BASE = window.location.hostname === 'localhost' ? "http://localhost:8000/api" : (process.env.REACT_APP_API_BASE_URL || "https://rediron-backend-1.onrender.com") + "/api";

const Accessories = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAccessories() {
      setLoading(true);
      const res = await fetch(`${API_BASE}/shop-products/?category=fitness-accessories`);
      const json = await res.json();
      setProducts(json.results || json);
      setLoading(false);
    }
    fetchAccessories();
  }, []);

  return (
    <div className="accessories-main rediron-theme">
      <div className="accessories-content">
        <CategoryMenu direction="horizontal" />
        <div className="accessories-title">Fitness Accessories</div>
        <div className="accessories-desc">
          Shop Rediron gym accessories—shakers, straps, bags, water bottles, and lifting belts for your training.
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="accessories-grid">
            {products.length === 0 ? (
              <div className="accessories-none">No accessories found.</div>
            ) : (
              products.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accessories;
