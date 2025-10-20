import React, { useState } from "react";
import "./Newsletter.css";

import NewsletterForm from "../ShopComponents/NewsletterForm";

const Newsletter = () => {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (email) => {
    // Integrate backend API here if needed
    setSubscribed(true);
  };

  return (
    <div className="newsletter-main rediron-theme">
      <div className="newsletter-content">
        <div className="newsletter-title">Subscribe to Our Newsletter</div>
        <div className="newsletter-desc">
          Get the latest Rediron offers, product news, training tips, and exclusive rewards straight to your inbox.
        </div>
        {!subscribed ? (
          <NewsletterForm onSubscribe={handleSubscribe} />
        ) : (
          <div className="newsletter-success">
            Thank you for subscribing! Check your inbox for updates.
          </div>
        )}
      </div>
    </div>
  );
};

export default Newsletter;
