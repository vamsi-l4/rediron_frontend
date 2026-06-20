import React, { useEffect, useState } from "react";
import "./Refund.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";
import { ArrowLeft, CheckCircle2, PackageCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = window.location.hostname === 'localhost' ? "http://localhost:8000/api" : (process.env.REACT_APP_API_BASE_URL || "https://rediron-backend-1.onrender.com") + "/api";

const Refund = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRefund() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/shop-refund/`);
        if (res.ok) {
          const json = await res.json();
          const data = json.results ? json.results[0] : json[0];
          setText(data ? (data.text || data.content) : "");
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
      <button className="shop-page-back" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Back</button>
      <div className="refund-content">
        <div className="refund-title">Return & Refund Policy</div>
        <div className="refund-body">
          {text
            ? text.split("\n").map((line, idx) => (
                <p key={idx}>{line}</p>
              ))
            : (
              <>
                <div className="refund-policy-grid">
                  <span><PackageCheck size={18} /> 7-day eligible returns</span>
                  <span><ShieldCheck size={18} /> Defect and wrong-item support</span>
                  <span><RefreshCw size={18} /> Fast inspection updates</span>
                  <span><CheckCircle2 size={18} /> Refund to original method</span>
                </div>
                <h3>Returns</h3>
                <p>
                  Unopened supplements, unused accessories, wrong items, and defective products are eligible for return within 7 days of delivery. Heavy equipment return eligibility depends on installation status and inspection.
                </p>
                <h3>Refund Process</h3>
                <p>
                  After pickup or customer handover, our team inspects the item and updates the order status. Approved refunds are initiated to the original payment method and usually reflect in 3-5 business days depending on your bank.
                </p>
                <h3>Non-returnable Conditions</h3>
                <p>
                  Opened nutrition products, used apparel, damaged packaging, missing invoice, or installation-damaged equipment may not qualify for return unless the issue is a verified manufacturing defect.
                </p>
                <h3>Contact Support</h3>
                <p>
                  Email <a href="mailto:support@rediron.com" className="red-cta">support@rediron.com</a> or <a href="/shop-contacts" className="red-cta">contact shop support</a> with your order ID and product photos.
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
