import React, { useEffect, useState } from "react";
import "./Refund.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";

const API_BASE = "http://localhost:8000/api";

const Refund = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRefund() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/content/refunds/`);
        if (res.ok) {
          const json = await res.json();
          setText(json.text || json.content);
        } else setText("");
      } catch {
        setText("");
      }
      setLoading(false);
    }
    fetchRefund();
  }, []);

  if (loading) return <Loader />;
  return (
    <div className="refund-main rediron-theme">
      <Header />
      <div className="refund-content">
        <div className="refund-title">Return & Refund Policy</div>
        <div className="refund-body">
          {text
            ? text.split("\n").map((line, idx) => (
                <p key={idx}>{line}</p>
              ))
            : (
              <>
                <h3>Returns</h3>
                <p>
                  Products are accepted for return within 7 days of delivery if unopened or in case of defect/wrong item.
                </p>
                <h3>Refund Process</h3>
                <p>
                  Refunds are processed after inspection. Credit typically in 3-5 business days. Contact support for clarification.
                </p>
                <h3>Contact Support</h3>
                <p>
                  Email <a href="mailto:support@rediron.com" className="red-cta">support@rediron.com</a> or <a href="/contact" className="red-cta">Contact Us</a>.
                </p>
              </>
            )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Refund;
