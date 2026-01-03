import React, { useEffect, useState } from "react";
import API from "./Api";

import WorkoutCard from "./WorkoutCard";
import "./WorkoutTips.css";

export default function WorkoutTips() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchTips = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await API.get("/api/workout-articles/", {
        params: { category: "Workout Tips", ordering: "-published_at" },
      });
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.results)
        ? res.data.results
        : [];
      setTips(list);
    } catch (e) {
      console.error("Error fetching workout tips:", e);
      setErrorMsg("Failed to load workout tips. Check backend.");
      setTips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  return (
    <>
      
      <div className="tips-container">
        <header className="tips-hero">
          <h1>Workout Tips</h1>
          <p>Quick, actionable advice to make your workouts better.</p>
        </header>

        <div className="tips-grid">
          {loading ? (
            <p className="loading">Loading tips…</p>
          ) : errorMsg ? (
            <p className="loading">{errorMsg}</p>
          ) : tips.length === 0 ? (
            <p className="loading">No workout tips found.</p>
          ) : (
            tips.map(t => <WorkoutCard key={t.id} workout={t} />)
          )}
        </div>
      </div>
    </>
  );
}
