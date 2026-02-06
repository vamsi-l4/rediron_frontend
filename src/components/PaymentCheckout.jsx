import React, { useState, useEffect } from 'react';
import API from './Api';
import './RazorpayCheckout.css';

/**
 * Enhanced Payment Component
 * Supports: Free Trial, Razorpay, and future payment methods
 */
const PaymentCheckout = ({
  onSuccess,
  onFailure,
  onTrialStart,
  planType = 'premium', // 'trial' or 'premium'
}) => {
  const [loading, setLoading] = useState(false);
  const [trialStatus, setTrialStatus] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(planType);

  // Fetch trial status on component mount
  useEffect(() => {
    fetchTrialStatus();
  }, []);

  const fetchTrialStatus = async () => {
    try {
      const response = await API.get('/api/accounts/trial-status/');
      setTrialStatus(response.data.trial);
    } catch (err) {
      console.log('No active trial found');
      setTrialStatus(null);
    }
  };

  // ====== FREE TRIAL HANDLER ======
  const handleStartTrial = async () => {
    setLoading(true);
    try {
      const response = await API.post('/api/accounts/start-trial/', {
        days: 7,
        features: [
          'articles',
          'workouts',
          'exercises',
          'basic_nutrition'
        ]
      });

      console.log('✅ Trial started successfully');
      
      if (onTrialStart) {
        onTrialStart(response.data.trial);
      }
      
      if (onSuccess) {
        onSuccess({
          type: 'trial',
          message: 'Free trial started for 7 days',
          trial: response.data.trial,
        });
      }

      // Redirect to dashboard after short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      console.error('❌ Trial start failed:', err);
      alert('Failed to start trial. Please try again.');
      if (onFailure) onFailure(err);
    } finally {
      setLoading(false);
    }
  };

  // ====== RAZORPAY PAYMENT HANDLER ======
  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      // 1. Load Razorpay SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // 2. Create order on backend
      const createOrderResponse = await API.post('/api/accounts/create-razorpay-order/', {
        amount: 49900, // ₹499
        currency: 'INR',
      });

      const orderData = createOrderResponse.data;
      console.log('✅ Order created:', orderData.order_id);

      // 3. Open Razorpay checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YourKeyHere',
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.order_id,
        name: 'RedIron Premium',
        description: 'Premium Gym Membership',
        
        handler: async (response) => {
          try {
            console.log('🔐 Verifying payment...');
            
            // 4. Verify payment on backend
            const verifyResponse = await API.post('/api/accounts/verify-razorpay-payment/', {
              order_id: orderData.order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            console.log('✅ Payment verified successfully');

            // 5. If trial active, upgrade it
            if (trialStatus && trialStatus.status === 'active') {
              await API.post('/api/accounts/upgrade-trial/', {
                payment_id: response.razorpay_payment_id,
                plan: 'premium',
                amount: 499,
              });
              console.log('✅ Trial upgraded to premium');
            }

            // 6. Create payment transaction record
            await API.post('/api/accounts/payment-transaction/', {
              payment_id: response.razorpay_payment_id,
              amount: 499,
              method: 'razorpay',
              plan: 'premium',
            });

            if (onSuccess) {
              onSuccess({
                type: 'razorpay',
                payment_id: response.razorpay_payment_id,
                message: 'Payment successful! Welcome to RedIron Premium.',
              });
            }

            // Redirect to dashboard
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          } catch (err) {
            console.error('❌ Payment verification failed:', err);
            alert('Payment verification failed. Please contact support.');
            if (onFailure) onFailure(err);
          }
        },

        prefill: {
          name: '',
          email: '',
          contact: '',
        },

        notes: {
          address: 'RedIron Gym',
          plan: 'premium',
        },

        theme: {
          color: '#e53935',
        },

        modal: {
          ondismiss: () => {
            console.log('❌ Payment cancelled by user');
            setLoading(false);
            if (onFailure) onFailure(new Error('Payment cancelled'));
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('❌ Payment initiation failed:', err);
      alert('Failed to initiate payment. Please try again.');
      if (onFailure) onFailure(err);
      setLoading(false);
    }
  };

  // Load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  return (
    <div className="payment-checkout-container">
      <div className="payment-header">
        <h2>Choose Your Plan</h2>
        <p>Start with free access or unlock premium features</p>
      </div>

      <div className="payment-plans-grid">
        {/* FREE TRIAL PLAN */}
        <div className={`payment-plan ${selectedPlan === 'trial' ? 'active' : ''}`}>
          <div className="plan-badge">RECOMMENDED</div>
          <h3 className="plan-name">Free Trial</h3>
          <div className="plan-price">
            <span className="currency">₹</span>
            <span className="amount">0</span>
            <span className="period">/7 days</span>
          </div>
          <p className="plan-description">
            Experience RedIron with limited features
          </p>
          <ul className="plan-features">
            <li>✓ Access to Articles</li>
            <li>✓ Workout Videos</li>
            <li>✓ Exercise Database</li>
            <li>✓ Basic Nutrition Guide</li>
            <li>✗ Premium Workouts</li>
            <li>✗ Personal Training</li>
          </ul>
          <button
            className="plan-button trial-button"
            onClick={handleStartTrial}
            disabled={loading || (trialStatus && trialStatus.status === 'active')}
          >
            {loading ? 'Starting Trial...' : trialStatus && trialStatus.status === 'active' ? 'Trial Already Active' : 'Start Free Trial'}
          </button>
          {trialStatus && trialStatus.status === 'active' && (
            <p className="plan-note">
              {trialStatus.days_remaining} days remaining
            </p>
          )}
        </div>

        {/* PREMIUM PLAN */}
        <div className={`payment-plan premium ${selectedPlan === 'premium' ? 'active' : ''}`}>
          <div className="plan-badge popular">MOST POPULAR</div>
          <h3 className="plan-name">Premium</h3>
          <div className="plan-price">
            <span className="currency">₹</span>
            <span className="amount">499</span>
            <span className="period">/month</span>
          </div>
          <p className="plan-description">
            Full access to all RedIron features
          </p>
          <ul className="plan-features">
            <li>✓ All Trial Features</li>
            <li>✓ Premium Workouts</li>
            <li>✓ Personal Training Plans</li>
            <li>✓ Nutrition Consultation</li>
            <li>✓ Progress Tracking</li>
            <li>✓ Priority Support</li>
          </ul>
          <button
            className="plan-button premium-button"
            onClick={handleRazorpayPayment}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay with Razorpay'}
          </button>
          <p className="payment-methods">
            💳 Secure payment powered by Razorpay
          </p>
        </div>
      </div>

      <div className="payment-footer">
        <p className="guarantee">
          🛡️ <strong>30-day Money Back Guarantee</strong> - Not satisfied? Get a full refund.
        </p>
      </div>
    </div>
  );
};

export default PaymentCheckout;
