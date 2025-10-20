import React, { useEffect, useState } from "react";
import "./Apparel.css";
import ProductCard from "../ShopComponents/ProductCard";
import Loader from "../ShopComponents/Loader";
import CategoryMenu from "../ShopComponents/CategoryMenu";

const API_BASE = "http://localhost:8000/api";

const Apparel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApparel() {
      setLoading(true);
      const res = await fetch(`${API_BASE}/shop-products/?category=apparel`);
      const json = await res.json();
      setProducts(json.results || json);
      setLoading(false);
    }
    fetchApparel();
  }, []);

  return (
    <div className="apparel-main rediron-theme">
      <div className="apparel-content">
        <CategoryMenu direction="horizontal" />
        <div className="apparel-title">Fitness Apparel & Clothing</div>
        <div className="apparel-desc">
          Shop original Rediron gym wear—tees, tanks, joggers, caps, and more. High performance, authentic, and stylish.
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="apparel-grid">
            {products.length === 0 ? (
              <div className="apparel-none">No apparel products found.</div>
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

export default Apparel;
