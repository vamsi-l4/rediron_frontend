import React, { useState, useEffect } from "react";
import "./Checkout.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import CartItem from "../ShopComponents/CartItem";
import Loader from "../ShopComponents/Loader";
import API from "../components/Api";

const initialAddress = {
  name: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  email: ""
};

const paymentMethods = [
  { label: "Credit/Debit Card", value: "card" },
  { label: "UPI", value: "upi" },
  { label: "Cash On Delivery", value: "cod" }
];

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(initialAddress);
  const [payment, setPayment] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
    async function fetchCart() {
      const cartId = localStorage.getItem('cartId');
      if (cartId) {
        try {
          const res = await API.get(`/api/shop-carts/${cartId}/`);
          setCart(res.data);
        } catch (error) {
          console.error('Error fetching cart:', error);
          setCart({ items: [] });
        }
      }
    }
    fetchCart();
  }, []);

  const subtotal = cart.items?.reduce(
    (sum, item) => sum + item.product_variant.price * item.quantity,
    0
  ) || 0;
  const discount = 0;
  const total = Math.max(subtotal - discount, 0);

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

  const handleAddressChange = (field, val) => {
    setAddress({ ...address, [field]: val });
  };

  const openRazorpay = async (order) => {
    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      throw new Error('Failed to load Razorpay SDK.');
    }

    const createOrderResponse = await API.post('/api/accounts/create-razorpay-order/', {
      order_id: order.id,
      amount: total,
      currency: 'INR',
      payment_method: payment
    });

    const { order_id: razorpayOrderId, amount, currency } = createOrderResponse.data;

    return new Promise((resolve, reject) => {
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YourKeyHere',
        amount,
        currency,
        order_id: razorpayOrderId,
        name: 'RedIron Premium',
        description: 'RedIron order payment',
        handler: async (response) => {
          try {
            await API.post('/api/accounts/verify-razorpay-payment/', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone,
        },
        theme: {
          color: '#e53935',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  };

  const handleAddressSave = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleOrderPlace = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cartId = localStorage.getItem('cartId');
      if (!cartId || !cart.items || cart.items.length === 0) {
        alert('No items in your cart. Please add products before checkout.');
        setLoading(false);
        return;
      }

      const orderData = {
        cart_id: cartId,
        name: address.name,
        mobile: address.phone,
        email: address.email,
        shipping_address: `${address.address}, ${address.city}, ${address.state} - ${address.pincode}`,
        payment_method: payment,
      };

      const orderResponse = await API.post('/api/shop-orders/', orderData);
      const order = orderResponse.data;

      if (payment === 'card' || payment === 'upi') {
        await openRazorpay(order);
      }

      localStorage.removeItem('cartId');
      setOrderPlaced(true);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (orderPlaced)
    return (
      <div className="checkout-main rediron-theme">
        <Header />
        <div className="checkout-success">
          <h2>Thank you for your order! 🎉</h2>
          <p>Your RedIron products will reach you soon.</p>
          <a href="/orders" className="red-cta">View Order History</a>
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="checkout-main rediron-theme">
      <Header />

      <div className="checkout-steps">
        <span className={step === 1 ? "current" : ""}>1 Address</span> <span>&gt;</span>
        <span className={step === 2 ? "current" : ""}>2 Payment</span> <span>&gt;</span>
        <span className={step === 3 ? "current" : ""}>3 Done</span>
      </div>

      <div className="checkout-content">
        {step === 1 && (
          <form className="checkout-address-form" onSubmit={handleAddressSave}>
            <h2>Shipping Address</h2>
            <input
              type="text"
              className="checkout-input"
              value={address.name}
              onChange={e => handleAddressChange("name", e.target.value)}
              placeholder="Full Name"
              required
            />
            <input
              type="text"
              className="checkout-input"
              value={address.address}
              onChange={e => handleAddressChange("address", e.target.value)}
              placeholder="Address"
              required
            />
            <div className="checkout-row">
              <input
                type="text"
                className="checkout-input"
                value={address.city}
                onChange={e => handleAddressChange("city", e.target.value)}
                placeholder="City"
                required
              />
              <input
                type="text"
                className="checkout-input"
                value={address.state}
                onChange={e => handleAddressChange("state", e.target.value)}
                placeholder="State"
                required
              />
            </div>
            <div className="checkout-row">
              <input
                type="text"
                className="checkout-input"
                value={address.pincode}
                onChange={e => handleAddressChange("pincode", e.target.value)}
                placeholder="Pincode"
                required
              />
              <input
                type="text"
                className="checkout-input"
                value={address.phone}
                onChange={e => handleAddressChange("phone", e.target.value)}
                placeholder="Phone"
                required
              />
            </div>
            <input
              type="email"
              className="checkout-input"
              value={address.email}
              onChange={e => handleAddressChange("email", e.target.value)}
              placeholder="Email"
              required
            />
            <button type="submit" className="next-btn">
              Save & Continue to Payment
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="checkout-payment-form" onSubmit={handleOrderPlace}>
            <h2>Payment</h2>
            {paymentMethods.map(pm => (
              <div key={pm.value} className="payment-radio">
                <input
                  id={pm.value}
                  type="radio"
                  name="payment"
                  value={pm.value}
                  checked={payment === pm.value}
                  onChange={() => setPayment(pm.value)}
                  required
                />
                <label htmlFor={pm.value}>{pm.label}</label>
              </div>
            ))}
            <div className="checkout-order-summary">
              <h3>Order Summary</h3>
              <div>
                {cart.items.length === 0 ? (
                  <div>No items in cart.</div>
                ) : (
                  cart.items.map(item => (
                    <CartItem key={item.id} item={item} />
                  ))
                )}
              </div>
              <div className="order-summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="order-summary-row">
                <span>Discount</span>
                <span className="discount-txt">-₹{discount.toLocaleString()}</span>
              </div>
              <div className="order-summary-row total-row">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <button type="submit" className="checkout-btn">
              Pay & Place Order
            </button>
          </form>
        )}
      </div>

      <div className="checkout-trust-bar">
        <span>100% Safe &amp; Secure payments</span>
        <span>🎁 Earn Rediron Points</span>
        <span>🚚 Fast Delivery</span>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
