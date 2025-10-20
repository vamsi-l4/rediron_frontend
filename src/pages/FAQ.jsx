import React, { useEffect, useState } from "react";
import "./FAQ.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";

const API_BASE = "http://localhost:8000/api";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIdx, setOpenIdx] = useState(null);

  useEffect(() => {
    async function fetchFaqs() {
      setLoading(true);
      const res = await fetch(`${API_BASE}/shop-faqs/`);
      const json = await res.json();
      setFaqs(json.results ? json.results : json);
      setLoading(false);
    }
    fetchFaqs();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="faq-main rediron-theme">
      <Header />
      <div className="faq-title">Frequently Asked Questions</div>
      <div className="faq-list">
        {faqs.length === 0 ? (
          <div className="faq-none">No FAQs found.</div>
        ) : (
          faqs.map((faq, idx) => (
            <div key={faq.id} className="faq-item">
              <button
                className={`faq-question ${openIdx === idx ? "open" : ""}`}
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              >
                {faq.question}
                <span className="faq-arrow">{openIdx === idx ? "▲" : "▼"}</span>
              </button>
              {openIdx === idx && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="faq-help-block">
        Need more help? <a href="/shop-contacts" className="red-cta">Contact our team</a>.
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
