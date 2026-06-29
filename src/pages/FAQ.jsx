import React, { useEffect, useState } from "react";
import "./FAQ.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";

import API from "../components/Api";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FALLBACK_FAQS = [
  {
    id: "fallback-authentic",
    question: "Are RedIron products genuine and quality checked?",
    answer: "Yes. RedIron only lists verified products, approved partner inventory, and equipment details reviewed for practical gym use."
  },
  {
    id: "fallback-shipping",
    question: "How long does delivery usually take?",
    answer: "Most orders are processed within 24-48 hours. Delivery timing depends on your pincode, item size, and courier availability."
  },
  {
    id: "fallback-equipment",
    question: "Can I buy gym equipment and supplements in one order?",
    answer: "Yes. You can add supplements, accessories, apparel, and equipment to the same cart. Heavy equipment shipping may be handled separately."
  },
  {
    id: "fallback-payment",
    question: "Which payment methods are supported?",
    answer: "RedIron supports cash on delivery where available and online payments through secure Razorpay checkout for cards and UPI."
  },
  {
    id: "fallback-return",
    question: "What can be returned?",
    answer: "Unopened supplements, wrong items, defective products, and eligible accessories can be raised for return based on the return policy."
  }
];

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIdx, setOpenIdx] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFaqs() {
      setLoading(true);
      try {
        const res = await API.get('/api/shop-faqs/');
        setFaqs(res.data.results ? res.data.results : res.data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        setFaqs([]);
      }
      setLoading(false);
    }
    fetchFaqs();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="faq-main rediron-theme">
      <Header />
      <button className="shop-page-back" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Back</button>
      <div className="faq-title">Frequently Asked Questions</div>
      <div className="faq-list">
        {(faqs.length ? faqs : FALLBACK_FAQS).map((faq, idx) => (
            <div key={faq.id} className="faq-item">
              <button
                className={`faq-question ${openIdx === idx ? "open" : ""}`}
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              >
                <span className="faq-question-text">{faq.question}</span>
                <span className="faq-arrow">
                  {openIdx === idx ? <ChevronUp size={19} /> : <ChevronDown size={19} />}
                </span>
              </button>
              {openIdx === idx && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
      </div>
      <div className="faq-help-block">
        Need more help? <a href="/shop-contacts" className="red-cta">Contact our team</a>.
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
