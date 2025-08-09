import React, { useState } from "react";
import axios from "axios";
import "./Contact.css";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", subject: "", message: ""
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFeedback({ type: "error", message: "⚠️ Please fill all the fields." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFeedback({ type: "error", message: "⚠️ Please enter a valid email address." });
      return;
    }

    try {
setLoading(true);
setFeedback({ type: "", message: "" });
const response = await axios.post(
  "https://rediron-backend-1.onrender.com/api/contact/",
  formData
);
if (response.status === 200 || response.status === 201) {
  setFeedback({ type: "success", message: "✅ Message sent successfully!" });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setFeedback({ type: "error", message: "❌ Unexpected response from server. Try again later." });
      }
    } catch (error) {
      console.error("❌ Submission error:", error);
      if (error.response) {
        setFeedback({ type: "error", message: `❌ Server Error: ${error.response.data.detail || "Try again later."}` });
      } else {
        setFeedback({ type: "error", message: "❌ Network error. Please check your connection." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="contact-container"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="contact-page">
        <Navbar />
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-subtitle">
          Reach out for any membership, billing, or training questions.
        </p>

        <div className="contact-container">
          <div className="contact-form">
            <h2>Send a Message</h2>
            <form onSubmit={handleSubmit}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />

              <label>Your Message</label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>

              {loading ? (
                <p className="loading-text">⏳ Sending...</p>
              ) : (
                <button type="submit">Submit Message</button>
              )}

              {feedback.message && (
                <p className={`feedback-message ${feedback.type}`}>{feedback.message}</p>
              )}
            </form>
          </div>

          <div className="contact-support">
            <h2>Need immediate help?</h2>
            <p>
              Call us at <strong>(123) 456-7890</strong>
            </p>
            <p>Contact our support team directly for urgent issues.</p>
            <button className="chat-button">💬 Chat with Support</button>
            <div className="support-links">
              <a href="/faq">FAQ</a>
              <a href="/terms">Terms of Service</a>
              <a href="/privacy">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
