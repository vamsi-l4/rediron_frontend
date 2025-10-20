import React from 'react';
import API from './Api';

const RazorpayCheckout = ({ amount = 49900, currency = 'INR', name = 'RedIron Membership', description = 'Premium Gym Membership', onSuccess, onFailure }) => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    // 1. Create order on backend
    let orderData;
    try {
      const res = await API.post('/api/accounts/create-razorpay-order/', { amount });
      orderData = res.data;
    } catch (err) {
      alert('Failed to create Razorpay order.');
      if (onFailure) onFailure(err);
      return;
    }

    const options = {
      key: 'rzp_test_YourKeyHere', // Replace with your Razorpay key
      amount: orderData.amount,
      currency: orderData.currency,
      name: name,
      description: description,
      order_id: orderData.order_id,
      handler: async function (response) {
        // 3. Verify payment on backend
        try {
          await API.post('/api/accounts/verify-razorpay-payment/', {
            order_id: orderData.order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          if (onSuccess) onSuccess(response);
        } catch (err) {
          alert('Payment verification failed.');
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
      },
      theme: {
        color: '#F37254',
      },
      modal: {
        ondismiss: function () {
          if (onFailure) onFailure();
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ textAlign: 'center', margin: '2rem 0' }}>
      <button className="razorpay-btn" onClick={handlePayment}>
        Pay with Razorpay
      </button>
    </div>
  );
};

export default RazorpayCheckout;
