import React, { useEffect, useState } from "react";
import "./Cart.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
import CartItem from "../ShopComponents/CartItem";
import Loader from "../ShopComponents/Loader";
import API from "../components/Api";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    async function fetchCart() {
      const cartId = localStorage.getItem('cartId');
      if (cartId) {
        try {
          const res = await API.get(`/api/shop-carts/${cartId}/`);
          setCart(res.data);
        } catch (error) {
          console.error('Error fetching cart:', error);
          setCart(null);
        }
      } else {
        setCart(null);
      }
      setLoading(false);
    }
    fetchCart();
  }, []);

  const handleQtyChange = async (itemId, qty) => {
    await API.patch(`/api/shop-cartitems/${itemId}/`, { quantity: qty });
    // Refetch cart after change
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      const res = await API.get(`/api/shop-carts/${cartId}/`);
      setCart(res.data);
    }
  };

  const handleRemove = async (itemId) => {
    await API.delete(`/api/shop-cartitems/${itemId}/`);
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      const res = await API.get(`/api/shop-carts/${cartId}/`);
      setCart(res.data);
    }
  };

  const handleCouponApply = (e) => {
    e.preventDefault();
    // Coupon logic; you would POST/PATCH to orders or cart model
    setCouponMsg("Applied! Discounted price will show at checkout.");
  };

  if (loading) return <Loader />;
  if (!cart || !cart.items || cart.items.length === 0)
    return (
      <div className="cart-main rediron-theme">
        <Header />
        <div className="cart-empty">
          <h2>Your Cart is Empty</h2>
          <p>
            Hit a plateau? Rediron products are here to lift you!{" "}
            <a href="/category/proteins" className="red-cta">
              Shop Rediron
            </a>
          </p>
          <div className="cart-trust-bar">
            <span>100% Safe &amp; Secure payments</span>
            <span>🎁 Earn Rediron Points</span>
          </div>
        </div>
        <Footer />
      </div>
    );

  // Price summary calculation
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product_variant.price * item.quantity,
    0
  );
  // For discount: assume just product.discount_percent; adapt as needed
  const discount =
    cart.items.reduce(
      (sum, item) =>
        sum +
        (item.product_variant.product.discount_percent
          ? (item.product_variant.product.price *
              item.product_variant.product.discount_percent) /
            100
          : 0),
      0
    ) || 0;
  const total = subtotal - discount;

  return (
    <div className="cart-main rediron-theme">
      <Header />

      {/* Progress Steps */}
      <div className="cart-steps">
        <span className="current">1 Cart</span> <span>&gt;</span>
        <span>2 Address</span> <span>&gt;</span>
        <span>3 Payment</span>
      </div>

      <div className="cart-page-content">
        {/* Cart Items Block */}
        <div className="cart-items-block">
          <h2>Your Cart</h2>
          <div>
            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQtyChange={handleQtyChange}
                onRemove={handleRemove}
              />
            ))}
          </div>
          <a className="continue-shop" href="/category/proteins">
            &larr; Continue Shopping
          </a>
        </div>

        {/* Price Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items ({cart.items.length})</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Discount</span>
            <span className="discount-txt">-₹{discount.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Convenience Fee</span>
            <span>₹0</span>
          </div>
          <div className="summary-total">
            <span>Total Amount</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          {/* Coupon input */}
          <form className="coupon-block" onSubmit={handleCouponApply}>
            <label htmlFor="coupon_code">Have Coupon?</label>
            <input
              id="coupon_code"
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Enter Coupon Code"
            />
            <button type="submit" className="apply-coupon-btn">
              Apply
            </button>
          </form>
          {couponMsg && <div className="coupon-msg">{couponMsg}</div>}

          {/* Loyalty */}
          <div className="cart-loyalty">
            🎁 You’ll earn {Math.ceil(total / 30)} Rediron Points on this order.
          </div>
          <button className="checkout-btn">Checkout</button>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="cart-trust-bar">
        <span>100% Safe &amp; Secure payments</span>
        <span>🎁 Earn Rediron Points</span>
        <span>🚚 Fast Delivery</span>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
