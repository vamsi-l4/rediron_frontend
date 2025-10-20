import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Subscribe.css';
import RazorpayCheckout from './RazorpayCheckout';
import API from './Api';

const Subscribe = () => {
  // DUMMY PATH: Update this path to your actual image
  const backgroundImageUrl = '../assets/workout-hero.jpg';

  const membershipTiers = [
    {
      name: 'Monthly Power',
      price: '$49',
      duration: '/month',
      features: [
        'Full Gym Access',
        'Basic Training Plans',
        '24/7 Support',
      ],
      isPopular: false,
    },
    {
      name: 'Quarterly Beast',
      price: '$129',
      duration: '/3 months',
      features: [
        'All Monthly Features',
        'Custom Nutrition Plan',
        'Access to Premium Classes',
      ],
      isPopular: true, // This card will be highlighted
    },
    {
      name: 'Annual Iron',
      price: '$399',
      duration: '/year',
      features: [
        'All Quarterly Features',
        '1-on-1 Personal Coaching',
        'Free RedIron Swag Kit',
      ],
      isPopular: false,
    },
  ];

  const [showTerms, setShowTerms] = useState(false);
  const [autoPayment, setAutoPayment] = useState(null); // null = no selection, true/false for options
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [showCongratsPopup, setShowCongratsPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubscribeClick = async () => {
    try {
      // Inform backend about the payment option selection for direct payment
      await API.post('/api/accounts/payment-option/', {
        auto_payment: true,
      });
      setShowRazorpay(true);
      setShowTerms(false);
    } catch (error) {
      console.error('Failed to inform backend about payment option:', error);
    }
  };

  const handleFreeTrialClick = () => {
    setShowTerms(true);
    setAutoPayment(null);
    setShowRazorpay(false);
  };

  const handleOptionSelect = (value) => {
    setAutoPayment(value);
  };

  const handleTermsOk = async () => {
    if (autoPayment !== null) {
      try {
        // Inform backend about the payment option selection
        await API.post('/api/accounts/payment-option/', {
          auto_payment: autoPayment,
        });
      } catch (error) {
        console.error('Failed to inform backend about payment option:', error);
        // Optionally show error to user or retry
      }
      if (autoPayment === true) {
        setShowCongratsPopup(true);
        setShowTerms(false);
      } else {
        localStorage.setItem('trialStart', new Date().toISOString());
        localStorage.setItem('paymentOption', 'manual');
        navigate('/');
      }
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="subscribe-page" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
      {/* The overlay helps darken the background image for better text contrast */}
      <div className="overlay"></div>

      <div className="content-container">

        <button className="back-button" onClick={handleBackClick}>
          &larr; Back
        </button>

        <h1 className="main-title">Unlock Your <span>**Iron**</span> Potential</h1>
        <p className="subtitle">
          Choose the plan that powers your fitness journey.
        </p>

        {/* --- 15 Days Free Trial Banner --- */}
        <div className="free-trial-banner">
          <span className="trial-text">💥 START YOUR TRANSFORMATION WITH A</span>
          <button className="trial-days" onClick={handleFreeTrialClick}>
            15 DAYS FREE TRIAL
          </button>
          <span className="trial-text">NO COMMITMENT. CANCEL ANYTIME.</span>
        </div>

        {showTerms && (
          <div className="terms-box">
            <p>Please select one of the following options:</p>
            <label>
              <input
                type="radio"
                name="paymentOption"
                value="auto"
                checked={autoPayment === true}
                onChange={() => handleOptionSelect(true)}
              />
              After free trial, auto payment will be charged.
            </label>
            <label>
              <input
                type="radio"
                name="paymentOption"
                value="manual"
                checked={autoPayment === false}
                onChange={() => handleOptionSelect(false)}
              />
              No auto payment, manual payment required.
            </label>
            <p className="terms-info">
              By selecting an option and clicking OK, you agree to the terms of the free trial and payment method.
            </p>
            <button
              className="terms-ok-btn"
              onClick={handleTermsOk}
              disabled={autoPayment === null}
            >
              OK
            </button>
          </div>
        )}

        {showRazorpay && (
          <div className="razorpay-checkout-container">
            <RazorpayCheckout />
          </div>
        )}

        <div className="pricing-grid">
          {membershipTiers.map((tier, index) => (
            <div
              key={index}
              className={`pricing-card ${tier.isPopular ? 'popular-card' : ''}`}
            >
              {tier.isPopular && <div className="badge">MOST POPULAR</div>}
              <h2 className="tier-name">{tier.name}</h2>
              <p className="price-tag">
                <span className="price">{tier.price}</span>
                <span className="duration">{tier.duration}</span>
              </p>

              <ul className="features-list">
                {/* Note: You need Font Awesome (or a similar icon library) for the checkmark icon */}
                {tier.features.map((feature, idx) => (
                  <li key={idx}><i className="fas fa-check-circle"></i> {feature}</li>
                ))}
              </ul>

          <button className="subscribe-btn" onClick={handleSubscribeClick}>
            {tier.isPopular ? 'Start Now' : 'Select Plan'}
          </button>
        </div>
      ))}
    </div>

        <p className="footer-note">After your **15-day free trial**, your selected membership will begin automatically.</p>

      </div>

      <AnimatePresence>
        {showCongratsPopup && (
          <motion.div
            className="congrats-popup"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <div className="popup-content">
              <h2>Congratulations! 🎉</h2>
              <p>You have selected auto payment. Your free trial starts now, and you'll have full access to all features.</p>
              <button onClick={() => { setShowCongratsPopup(false); navigate('/'); }}>OK</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Subscribe;
