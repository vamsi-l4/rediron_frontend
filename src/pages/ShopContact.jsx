import React, { useState } from "react";
import "./ShopContact.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";

import API from "../components/Api";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onFormChange = (k, v) => setForm({ ...form, [k]: v });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post('/api/shop-contacts/', form);
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setError("Failed to send your message. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="contact-main rediron-theme">
      <Header />
      <button className="shop-page-back" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Back</button>
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
            <div className="contact-contact-success">
              We have saved your response. Our team will get back to you soon.
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
              {error && <div className="contact-contact-success">{error}</div>}
            </form>
          )}
        </div>

        <div className="contact-help-links">
          <h4>Need help with an order?</h4>
          <div className="contact-help-actions">
            <a href="/shop-orders" className="red-cta">Track Orders</a>
            <span> | </span>
            <a href="/shop-faqs" className="red-cta">FAQs</a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
