import React, { useEffect, useState } from "react";
import "./Rewards.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";

const API_BASE = "http://localhost:8000/api";

const Rewards = () => {
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRewards() {
      setLoading(true);
      // Fetch user's current points
      const res = await fetch(`${API_BASE}/shop-rewards/`);
      const data = await res.json();
      setPoints(data.length ? data[0].points : 0);
      // Fetch history (simulate as needed, or provide via backend)
      setHistory([
        { id: 1, date: "2025-10-10", reason: "Order #1234", amount: 100, type: "Earned" },
        { id: 2, date: "2025-09-21", reason: "Referral Bonus", amount: 50, type: "Earned" },
        { id: 3, date: "2025-08-11", reason: "Used for Order #1211", amount: -200, type: "Spent" }
      ]);
      setLoading(false);
    }
    fetchRewards();
  }, []);

  if (loading) return <Loader />;

  if (points === 0 && !history.length)
    return (
      <div className="rewards-main rediron-theme">
        <Header />
        <div className="rewards-empty">
          <h2>No Reward Points Yet</h2>
          <p>
            Earn Rediron Points by shopping, reviewing, or referring friends.<br />
            <a href="/category/proteins" className="red-cta">Shop now and earn points!</a>
          </p>
          <div className="rewards-info-box">
            1 point = ₹1 | Points redeemable at checkout
          </div>
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="rewards-main rediron-theme">
      <Header />
      <div className="rewards-title">Rediron Rewards</div>
      <div className="rewards-balance-box">
        <span className="rewards-balance-val">{points} Points</span>
        <span className="rewards-balance-key">Current Balance</span>
      </div>
      <div className="rewards-info-box">
        <b>How to Earn Points:</b><br />
        1 point = ₹1 off.<br />
        - Earn for every purchase, review, and referral.<br />
        - Redeem directly at checkout.
      </div>
      <div className="rewards-hist-title">Your Recent Rewards Activity</div>
      <table className="rewards-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Activity</th>
            <th>Points</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {history.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.date}</td>
              <td>{tx.reason}</td>
              <td className={tx.amount > 0 ? "points-earned" : "points-spent"}>
                {tx.amount > 0 ? "+" : ""}
                {tx.amount}
              </td>
              <td>{tx.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Footer />
    </div>
  );
};

export default Rewards;
