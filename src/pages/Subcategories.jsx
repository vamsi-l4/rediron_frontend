import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Subcategories.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";
import API from "../components/Api";

const Subcategories = () => {
  const { categorySlug } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubcategories() {
      try {
        const res = await API.get('/api/shop-subcategories/');
        const allSubs = res.data.results || res.data;
        const filtered = allSubs.filter(sub => sub.category.slug === categorySlug);
        setSubcategories(filtered);
      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubcategories();
  }, [categorySlug]);

  if (loading) return <Loader />;

  return (
    <div className="subcategories-main rediron-theme">
      <Header />
      <div className="subcategories-content">
        <h2>Subcategories</h2>
        {subcategories.length > 0 ? (
          <div className="subcategories-grid">
            {subcategories.map((sub) => (
              <div key={sub.id} className="subcategory-card">
                {sub.image && <img src={sub.image} alt={sub.name} />}
                <h3>{sub.name}</h3>
                <p>{sub.description}</p>
                <a href={`/category/${sub.category.slug}/${sub.slug}`}>View Products</a>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-subcategories">
            <h3>No subcategories available.</h3>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Subcategories;
