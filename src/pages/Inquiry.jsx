import React, { useState } from "react";
import "./Inquiry.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";

const API_BASE = "http://localhost:8000/api";

const Inquiry = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onFormChange = (k, v) => setForm({ ...form, [k]: v });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`${API_BASE}/shop-business-inquiries/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="inquiry-main rediron-theme">
      <Header />
      <div className="inquiry-content">
        <div className="inquiry-title">Business/Bulk Inquiry</div>
        <div className="inquiry-info-block">
          <p>
            Interested in bulk purchases, distribution, or collaboration with Rediron?
            <br />
            Please fill out the form below. Our team will reach out promptly.
          </p>
        </div>
        <div className="inquiry-form-box">
          <h3>Send Us a Business Inquiry</h3>
          {submitted ? (
            <div className="inquiry-success">
              Thank you! Our team will contact you soon.
            </div>
          ) : (
            <form className="inquiry-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={form.name}
                required
                onChange={e => onFormChange("name", e.target.value)}
                placeholder="Your Full Name"
              />
              <input
                type="email"
                value={form.email}
                required
                onChange={e => onFormChange("email", e.target.value)}
                placeholder="Your Email Address"
              />
              <input
                type="text"
                value={form.company}
                required
                onChange={e => onFormChange("company", e.target.value)}
                placeholder="Company Name"
              />
              <input
                type="text"
                value={form.phone}
                required
                onChange={e => onFormChange("phone", e.target.value)}
                placeholder="Contact Phone"
              />
              <textarea
                rows="5"
                value={form.message}
                required
                onChange={e => onFormChange("message", e.target.value)}
                placeholder="Describe your inquiry (products, partnership, bulk order...)"
              />
              <button type="submit" className="inquiry-submit-btn" disabled={loading}>
                {loading ? <Loader size={22} /> : "Send Inquiry"}
              </button>
            </form>
          )}
        </div>
        <div className="inquiry-help-links">
          <h4>General Questions?</h4>
          <a href="/contact" className="red-cta">Contact Us</a>
          <span> | </span>
          <a href="/faq" className="red-cta">FAQs</a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Inquiry;
