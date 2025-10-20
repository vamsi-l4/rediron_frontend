import React, { useState } from "react";
import "./Contact.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";

const API_BASE = "http://localhost:8000/api";

const CONTACT_INFO = {
  address: "1st Floor, Tower B, Rediron HQ, Sector 14, Cityname, India",
  email: "support@rediron.com",
  phone: "+91 85 1234 5678"
};

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onFormChange = (k, v) => setForm({ ...form, [k]: v });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // POST to backend
    await fetch(`${API_BASE}/shop-contacts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="contact-main rediron-theme">
      <Header />
      <div className="contact-content">
        <div className="contact-title">Contact Us</div>
        <div className="contact-info-block">
          <div>
            <b>Rediron HQ:</b> {CONTACT_INFO.address}
          </div>
          <div>
            <b>Email:</b> <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
          </div>
          <div>
            <b>Phone:</b> <a href={`tel:${CONTACT_INFO.phone}`}>{CONTACT_INFO.phone}</a>
          </div>
        </div>

        <div className="contact-form-box">
          <h3>Send Us a Message</h3>
          {submitted ? (
            <div className="contact-success">
              Thank you! We will get back to you soon.
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={form.name}
                required
                onChange={e => onFormChange("name", e.target.value)}
                placeholder="Full Name"
              />
              <input
                type="email"
                value={form.email}
                required
                onChange={e => onFormChange("email", e.target.value)}
                placeholder="Email Address"
              />
              <input
                type="text"
                value={form.subject}
                required
                onChange={e => onFormChange("subject", e.target.value)}
                placeholder="Subject"
              />
              <textarea
                rows="5"
                value={form.message}
                required
                onChange={e => onFormChange("message", e.target.value)}
                placeholder="Your Message"
              />
              <button type="submit" className="contact-submit-btn" disabled={loading}>
                {loading ? <Loader size={22} /> : "Send Message"}
              </button>
            </form>
          )}
        </div>

        <div className="contact-help-links">
          <h4>Need help with an order?</h4>
          <a href="/shop-orders" className="red-cta">Track Orders</a>
          <span> | </span>
          <a href="/shop-faqs" className="red-cta">FAQs</a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
