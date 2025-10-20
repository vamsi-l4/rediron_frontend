import React, { useState, useEffect } from "react";
import "./Search.css";
import ProductCard from "../ShopComponents/ProductCard";
import Loader from "../ShopComponents/Loader";

const API_BASE = "http://localhost:8000/api";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      setLoading(true);
      fetch(`${API_BASE}/shop-products/?search=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => setResults(data.results || data))
        .finally(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="search-main rediron-theme">
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
    </div>
  );
};

export default Search;
