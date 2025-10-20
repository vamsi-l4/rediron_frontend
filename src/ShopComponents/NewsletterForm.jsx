import React, { useState } from "react";
import "./NewsletterForm.css";

const NewsletterForm = ({ onSubscribe }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubscribe) onSubscribe(email);
    setSubmitted(true);
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
