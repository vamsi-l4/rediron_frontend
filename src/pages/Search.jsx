import React, { useState, useEffect } from "react";
import "./Search.css";
import ProductCard from "../ShopComponents/ProductCard";
import Loader from "../ShopComponents/Loader";
import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import API from "../components/Api";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      setLoading(true);
      API.get(`/api/shop-products/?search=${encodeURIComponent(query)}`)
        .then(res => setResults(res.data.results || res.data))
        .finally(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="search-main rediron-theme">
      <Header />
      <div className="search-content">
        <div className="search-title">Search Products</div>
        <input
          type="text"
          className="search-bar"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Find Rediron supplements, accessories, apparel..."
        />
        {loading ? (
          <Loader />
        ) : (
          <div className="search-results">
            {results.length === 0 && query.length > 2 ? (
              <div className="search-none">No matching products found.</div>
            ) : (
              results.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Search;
