import React, { useState } from "react";
import "./NewsletterForm.css";

const API_BASE = window.location.hostname === 'localhost' ? "http://localhost:8000/api" : (process.env.REACT_APP_API_BASE_URL || "https://rediron-backend-1.onrender.com") + "/api";

const NewsletterForm = ({ onSubscribe }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/shop-newsletter/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setEmail("");
        setSubmitted(true);
      }
    } catch (error) {
      // Error handled silently, UI updates on success
    }
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
