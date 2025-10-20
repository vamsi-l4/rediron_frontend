import React, { useState, useEffect } from "react";
import API from "./Api";

export default function Activity() {
  const [activity, setActivity] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const response = await API.get("/api/accounts/activity/");
      setActivity(response.data);
    } catch (err) {
      setError("Failed to load activity");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");

    try {
      const response = await API.patch("/api/accounts/activity/", activity);
      setActivity(response.data);
    } catch (err) {
      setError("Failed to update activity");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>User Activity</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleUpdate}>
        <pre>{JSON.stringify(activity, null, 2)}</pre>
        <button type="submit" disabled={updating}>
          {updating ? "Updating..." : "Update Activity"}
        </button>
      </form>
    </div>
  );
}
