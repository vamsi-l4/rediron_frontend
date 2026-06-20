import React, { useContext, useState, useEffect } from "react";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import Loader from "../ShopComponents/Loader";
import API from "../components/Api";
import { useUser } from "@clerk/clerk-react";
import { UserDataContext } from "../contexts/UserDataContext";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle2,
  CreditCard,
  Gift,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck,
  Smartphone,
  Truck
} from "lucide-react";

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
  { label: "Credit/Debit Card", value: "card", Icon: CreditCard },
  { label: "UPI", value: "upi", Icon: Smartphone },
  { label: "Cash On Delivery", value: "cod", Icon: Banknote }
];

const Checkout = () => {
  const navigate = useNavigate();
  const { user: clerkUser } = useUser();
  const { userData } = useContext(UserDataContext);
  
  // State for each step
  const [step, setStep] = useState(1); // 1: Address, 2: Order Review, 3: Payment
  const [address, setAddress] = useState(initialAddress);
  const [payment, setPayment] = useState("cod");
  
  // Cart & loading
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Success state
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState(null);
  
  // Out of stock handling
  const [outOfStockItems, setOutOfStockItems] = useState([]);

  useEffect(() => {
    const email = userData?.email || clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress || "";
    const name = userData?.name || clerkUser?.fullName || "";
    const phone = userData?.phone_number || userData?.phone || "";
    setAddress(prev => ({
      ...prev,
      name: prev.name || name,
      email: prev.email || email,
      phone: prev.phone || phone
    }));
  }, [clerkUser, userData]);

  // Fetch cart on mount
  useEffect(() => {
    async function fetchCart() {
      try {
        const cartId = localStorage.getItem('cartId');
        if (!cartId) {
          setCart({ items: [] });
          setLoading(false);
          return;
        }
        
        const res = await API.get(`/api/shop-carts/${cartId}/`);
        
        // Check inventory for all items
        let outOfStock = [];
        const validItems = res.data.items.filter(item => {
          if (item.product_variant && !item.product_variant.in_stock) {
            outOfStock.push(item);
            return false;
          }
          if (item.product_variant && item.quantity > item.product_variant.inventory) {
            outOfStock.push({ ...item, reason: 'insufficient_qty' });
            return false;
          }
          return true;
        });
        
        setOutOfStockItems(outOfStock);
        setCart({ ...res.data, items: validItems });
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCart({ items: [] });
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  // Calculate totals
  const subtotal = cart.items?.reduce(
    (sum, item) => sum + ((item.product_variant?.price || item.product?.price || 0) * item.quantity),
    0
  ) || 0;
  
  const discount = cart.items?.reduce(
    (sum, item) => {
      const prod = item.product_variant?.product || item.product;
      return sum +
        (prod?.discount_percent
          ? (prod.price * prod.discount_percent) / 100 * item.quantity
          : 0);
    },
    0
  ) || 0;
  
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

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.name || !address.address || !address.city || !address.state || !address.pincode || !address.phone || !address.email) {
      alert('Please fill all address fields');
      return;
    }
    setStep(2);
  };

  const handleContinueToPayment = () => {
    setStep(3);
  };

  const openRazorpay = async (order) => {
    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      throw new Error('Failed to load Razorpay SDK.');
    }

    const createOrderResponse = await API.post('/api/accounts/create-razorpay-order/', {
      order_id: order.id,
      amount: Math.round(total * 100), // Razorpay expects amount in paise
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
        description: 'RedIron Fitness Equipment Order',
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

  const handleOrderPlace = async (e) => {
    e.preventDefault();
    
    if (!cart.items || cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setProcessing(true);
    try {
      const cartId = localStorage.getItem('cartId');
      
      // Create order
      const orderPayload = {
        cart_id: cartId,
        name: address.name,
        mobile: address.phone,
        email: address.email,
        shipping_address: `${address.address}, ${address.city}, ${address.state} - ${address.pincode}`,
        payment_method: payment,
      };

      const orderResponse = await API.post('/api/shop-orders/', orderPayload);
      const order = orderResponse.data;

      // For online payments, open Razorpay
      if (payment === 'card' || payment === 'upi') {
        await openRazorpay(order);
      }

      // Clear cart and show success
      localStorage.removeItem('cartId');
      setOrderData(order);
      setOrderPlaced(true);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveOutOfStock = async (itemId) => {
    try {
      await API.delete(`/api/shop-cartitems/${itemId}/`);
      // Re-fetch cart
      const cartId = localStorage.getItem('cartId');
      if (cartId) {
        const res = await API.get(`/api/shop-carts/${cartId}/`);
        setCart(res.data);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) return <Loader />;

  // Success page
  if (orderPlaced) {
    return (
      <div className="checkout-main rediron-theme">
        <Header />
        <div className="checkout-success">
          <div className="success-icon"><CheckCircle2 aria-hidden="true" /></div>
          <h1>Order Placed Successfully</h1>
          <p className="success-message">Thank you for your order!</p>
          
          {orderData && (
            <div className="order-summary-box">
              <h3>Order Details</h3>
              <div className="order-detail-row">
                <span>Order ID:</span>
                <strong>#{orderData.id}</strong>
              </div>
              <div className="order-detail-row">
                <span>Total Amount:</span>
                <strong>₹{total.toLocaleString()}</strong>
              </div>
              <div className="order-detail-row">
                <span>Payment Method:</span>
                <strong>{payment === 'cod' ? 'Cash on Delivery' : payment === 'card' ? 'Card' : 'UPI'}</strong>
              </div>
              <div className="order-detail-row">
                <span>Status:</span>
                <strong className="status-pending">{orderData.status}</strong>
              </div>
            </div>
          )}

          <div className="success-actions">
            <button className="btn-primary" onClick={() => navigate('/shop-orders')}>View Order History</button>
            <button className="btn-secondary" onClick={() => navigate('/shop')}>Continue Shopping</button>
          </div>

          <div className="success-info">
            <p><Mail size={17} /> Order confirmation has been sent to your email address</p>
            <p><Truck size={17} /> Track your order from your profile</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Checkout flow
  return (
    <div className="checkout-main rediron-theme">
      <Header />

      {/* Progress Steps */}
      <div className="checkout-steps">
        <div className={`step ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Address</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Review</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${step === 3 ? 'active' : step > 3 ? 'done' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Payment</div>
        </div>
      </div>

      {/* Out of stock warning */}
      {outOfStockItems.length > 0 && (
        <div className="out-of-stock-warning">
          <h3><AlertTriangle size={19} /> Some items are out of stock</h3>
          <div className="out-of-stock-items">
            {outOfStockItems.map(item => (
              <div key={item.id} className="out-of-stock-item">
                <span>
                  {item.product_variant?.product?.name || item.product?.name} {item.product_variant?.variant_name ? `- ${item.product_variant.variant_name}` : ''}
                </span>
                <button 
                  className="btn-remove" 
                  onClick={() => handleRemoveOutOfStock(item.id)}
                >
                  Remove from Order
                </button>
              </div>
            ))}
          </div>
          <p className="out-of-stock-note">We've removed out-of-stock items. You can proceed with remaining products.</p>
        </div>
      )}

      {cart.items.length === 0 && outOfStockItems.length === 0 ? (
        <div className="checkout-content">
          <div className="empty-cart-message">
            <h2>Your Cart is Empty</h2>
            <p>Add items to your cart to proceed with checkout.</p>
            <button className="btn-primary" onClick={() => navigate('/shop-categories/proteins')}>Continue Shopping</button>
          </div>
        </div>
      ) : (
        <div className="checkout-content">
          {step === 1 && (
            <form className="checkout-form" onSubmit={handleAddressSubmit}>
              <h2><MapPin size={22} /> Shipping Address</h2>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  value={address.name}
                  onChange={e => handleAddressChange("name", e.target.value)}
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  value={address.address}
                  onChange={e => handleAddressChange("address", e.target.value)}
                  placeholder="Street Address"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    value={address.city}
                    onChange={e => handleAddressChange("city", e.target.value)}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    value={address.state}
                    onChange={e => handleAddressChange("state", e.target.value)}
                    placeholder="State"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    value={address.pincode}
                    onChange={e => handleAddressChange("pincode", e.target.value)}
                    placeholder="Pincode"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    className="form-input"
                    value={address.phone}
                    onChange={e => handleAddressChange("phone", e.target.value)}
                    placeholder="Mobile Number"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="form-input"
                  value={address.email}
                  onChange={e => handleAddressChange("email", e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>
              <button type="submit" className="btn-primary btn-large">Continue to Order Review</button>
            </form>
          )}

          {step === 2 && (
            <div className="checkout-review">
              <h2><PackageCheck size={22} /> Order Review</h2>
              
              {/* Address summary */}
              <div className="review-section">
                <h3>Shipping Address</h3>
                <p className="address-display">
                  {address.name}<br/>
                  {address.address}<br/>
                  {address.city}, {address.state} - {address.pincode}<br/>
                  <span className="checkout-contact-line"><Phone size={15} /> {address.phone}</span>
                  <span className="checkout-contact-line"><Mail size={15} /> {address.email}</span>
                </p>
              </div>

              {/* Cart items */}
              <div className="review-section">
                <h3>Items ({cart.items.length})</h3>
                <div className="cart-items-list">
                  {cart.items.map(item => (
                    <div key={item.id} className="cart-item-summary">
                      <span className="item-name">
                        {item.product_variant?.product?.name || item.product?.name} {item.product_variant?.variant_name ? `- ${item.product_variant.variant_name}` : ''}
                      </span>
                      <span className="item-qty">Qty: {item.quantity}</span>
                      <span className="item-price">₹{((item.product_variant ? item.product_variant.price : (item.product ? item.product.price : 0)) * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price summary */}
              <div className="review-section price-summary">
                <h3>Price Details</h3>
                <div className="price-row">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="price-row discount">
                    <span>Discount:</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="price-row delivery">
                  <span>Delivery Fee:</span>
                  <span>FREE</span>
                </div>
                <div className="price-row total">
                  <span>Total Amount:</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="review-actions">
                <button className="btn-secondary" onClick={() => setStep(1)}><ArrowLeft size={17} /> Back to Address</button>
                <button className="btn-primary" onClick={handleContinueToPayment}>Continue to Payment <ArrowRight size={17} /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form className="checkout-payment" onSubmit={handleOrderPlace}>
              <h2><CreditCard size={22} /> Payment Method</h2>
              
              <div className="payment-methods">
                {paymentMethods.map(pm => {
                  const PaymentIcon = pm.Icon;
                  return (
                  <label key={pm.value} className={`payment-option ${payment === pm.value ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={pm.value}
                      checked={payment === pm.value}
                      onChange={() => setPayment(pm.value)}
                      required
                    />
                    <span className="payment-label"><PaymentIcon size={19} /> {pm.label}</span>
                  </label>
                )})}
              </div>

              {payment === 'cod' && (
                <div className="payment-info cod-info">
                  <p><Banknote size={18} /> You'll pay <strong>₹{total.toLocaleString()}</strong> when your order arrives</p>
                </div>
              )}

              {(payment === 'card' || payment === 'upi') && (
                <div className="payment-info online-info">
                  <p><LockKeyhole size={18} /> Secure payment powered by Razorpay</p>
                </div>
              )}

              {/* Final order summary */}
              <div className="final-summary">
                <h3>Order Summary</h3>
                <div className="summary-line">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="summary-line">
                    <span>Discount:</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="summary-line total">
                  <span>Total Amount:</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="payment-actions">
                <button type="button" className="btn-secondary" onClick={() => setStep(2)} disabled={processing}><ArrowLeft size={17} /> Back to Review</button>
                <button type="submit" className="btn-primary btn-large" disabled={processing}>
                  {processing ? <><LoaderCircle className="checkout-spinner" size={18} /> Processing...</> : `Place Order - ₹${total.toLocaleString()}`}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Trust bar */}
      <div className="checkout-trust-bar">
        <span><ShieldCheck size={17} /> 100% Safe & Secure payments</span>
        <span><Gift size={17} /> Earn Rediron Points</span>
        <span><Truck size={17} /> Fast & Free Delivery</span>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
