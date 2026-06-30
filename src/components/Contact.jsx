import React, { useState } from "react";
import "./Contact.css";
import { motion } from "framer-motion";
import API from "./Api";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Contact = () => {
  const navigate = useNavigate();
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

      const response = await API.post("/api/contact/", formData);

      if (response.status === 201) {
        setFeedback({ type: "success", message: "We have saved your response. Our team will get back to you soon." });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setFeedback({ type: "error", message: "❌ Unexpected response from server. Try again later." });
      }
    } catch (error) {
      console.error("❌ Submission error:", error);
      if (error.response) {
        setFeedback({ type: "error", message: `❌ Server Error: ${error.response.data.error || "Try again later."}` });
      } else if (error.request) {
        setFeedback({ type: "error", message: "❌ Network error. Please check your connection." });
      } else {
        setFeedback({ type: "error", message: "❌ An unexpected error occurred." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="rediron-contact-wrapper"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <button className="rediron-contact-back-btn" onClick={() => navigate(-1)} aria-label="Go Back">
        <ArrowLeft size={24} />
      </button>
      <div className="rediron-contact-hero">
        <h1 className="rediron-contact-title">Contact Us</h1>
        <p className="rediron-contact-subtitle">
          Reach out for any membership, billing, or training questions.
        </p>
      </div>

      <div className="rediron-contact-container">
        <div className="rediron-contact-form-box">
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
                <p className="rediron-contact-loading">⏳ Sending...</p>
              ) : (
                <button type="submit" className="rediron-contact-submit-btn">Submit Message</button>
              )}

              {feedback.message && (
                <p className={`rediron-contact-feedback rediron-contact-${feedback.type}`}>{feedback.message}</p>
              )}
            </form>
          </div>

          <div className="rediron-contact-support-box">
            <h2>Need immediate help?</h2>
            <p>
              Call us at <strong>(123) 456-7890</strong>
            </p>
            <p>Contact our support team directly for urgent issues.</p>
            <button className="rediron-contact-chat-btn">💬 Chat with Support</button>
            <div className="rediron-contact-links">
              <a href="/faq">FAQ</a>
              <a href="/terms">Terms of Service</a>
              <a href="/privacy">Privacy Policy</a>
            </div>
          </div>
      </div>
    </motion.div>
  );
};

export default Contact;
