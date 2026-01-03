import React, { useState } from "react";
import "./NewsletterForm.css";

const API_BASE = window.location.hostname === 'localhost' ? "http://localhost:8000/api" : (process.env.REACT_APP_API_BASE_URL || "https://rediron-backend-1.onrender.com") + "/api";

const NewsletterForm = ({ onSubscribe }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/shop-newsletter/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        // setMessage("Subscribed successfully!");
        setEmail("");
        setSubmitted(true);
      } else {
        // setMessage("Subscription failed. Try again.");
      }
    } catch (error) {
      // setMessage("Error subscribing. Check connection.");
    }
    // setLoading(false);
  };

  return (
    <form className="newsletterform-main" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Your Email Address"
        value={email}
        required
        onChange={e => setEmail(e.target.value)}
        disabled={submitted}
      />
      <button type="submit" disabled={submitted}>
        {submitted ? "Subscribed" : "Subscribe"}
      </button>
    </form>
  );
};

export default NewsletterForm;
