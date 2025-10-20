import React, { useEffect, useState } from "react";
import API from "./Api";

import WorkoutCard from "./WorkoutCard";
import "./WorkoutTips.css";

export default function WorkoutFitness() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await API.get("/api/workout-articles/", {
        params: { category: "Fitness", ordering: "-published_at" },
      });
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.results)
        ? res.data.results
        : [];
      setItems(list);
    } catch (e) {
      console.error("Error fetching fitness articles:", e);
      setErrorMsg("Failed to load fitness articles. Check backend.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <>
 
      <div className="tips-container">
        <header className="tips-hero">
          <h1>Fitness</h1>
          <p>Fitness articles — training, recovery, and lifestyle.</p>
        </header>

        <div className="tips-grid">
          {loading ? (
            <p className="loading">Loading…</p>
          ) : errorMsg ? (
            <p className="loading">{errorMsg}</p>
          ) : items.length === 0 ? (
            <p className="loading">No fitness articles found.</p>
          ) : (
            items.map(t => <WorkoutCard key={t.id} workout={t} />)
          )}
        </div>
      </div>
  
    </>
  );
}
