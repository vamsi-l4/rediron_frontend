import React, { useEffect, useState } from "react";
import "./Dealer.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import DealerCard from "../ShopComponents/DealerCard";
import Loader from "../ShopComponents/Loader";

const API_BASE = window.location.hostname === 'localhost' ? "http://localhost:8000/api" : (process.env.REACT_APP_API_BASE_URL || "https://rediron-backend-1.onrender.com") + "/api";

const Dealer = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchDealers() {
      setLoading(true);
      let endpoint = `${API_BASE}/shop-dealers/?`;
      if (stateFilter) endpoint += `state=${stateFilter}&`;
      if (cityFilter) endpoint += `city=${cityFilter}&`;
      if (search) endpoint += `name=${search}&`;
      const res = await fetch(endpoint);
      const json = await res.json();
      setDealers(json.results ? json.results : json);
      setLoading(false);
    }
    fetchDealers();
  }, [stateFilter, cityFilter, search]);

  // For demo: states/cities (populate from backend in real app)
  const states = ["All India", "Telangana", "Karnataka", "Delhi", "Maharashtra"];
  const cities = ["All Cities", "Hyderabad", "Bangalore", "Mumbai", "Delhi", "Pune"];

  if (loading) return <Loader />;

  return (
    <div className="dealer-main rediron-theme">
      <Header />
      <div className="dealer-title">Rediron Dealers & Distributors</div>
      <div className="dealer-filter-bar">
        <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
          {states.map(st => (
            <option key={st} value={st === "All India" ? "" : st}>{st}</option>
          ))}
        </select>
        <select value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
          {cities.map(ct => (
            <option key={ct} value={ct === "All Cities" ? "" : ct}>{ct}</option>
          ))}
        </select>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search dealer name..."
        />
      </div>
      <div className="dealer-list">
        {dealers.length === 0
          ? <div className="dealer-none">No dealers found for your search/filter.</div>
          : dealers.map(dealer => (
              <DealerCard key={dealer.id} dealer={dealer} />
            ))
        }
      </div>
      <div className="dealer-help-box">
        For partnership inquiries, please <a href="/shop-business-inquiries" className="red-cta">send a business inquiry</a>.
      </div>
      <Footer />
    </div>
  );
};

export default Dealer;
