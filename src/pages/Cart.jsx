import React, { useEffect, useState } from "react";
import "./Cart.css";
import { Link } from "react-router-dom";
import { ShoppingBag, ShieldCheck, Gift, Truck, ChevronRight } from "lucide-react";

import Header from "./ShopNavbar";
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
    const item = cart.items.find(i => i.id === itemId);
    if (item && item.product_variant && qty > item.product_variant.inventory) {
      alert(`Only ${item.product_variant.inventory} units available for "${item.product_variant.variant_name || item.product?.name}".`);
      return;
    }
    if (item && item.product_variant && !item.product_variant.in_stock) {
      alert('This item is currently out of stock.');
      return;
    }
    try {
      await API.patch(`/api/shop-cartitems/${itemId}/`, { quantity: qty });
      // Refetch cart after change
      const cartId = localStorage.getItem('cartId');
      if (cartId) {
        const res = await API.get(`/api/shop-carts/${cartId}/`);
        setCart(res.data);
      }
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    }
  };

  const handleRemove = async (itemId) => {
    await API.delete(`/api/shop-cartitems/${itemId}/`);
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      const res = await API.get(`/api/shop-carts/${cartId}/`);
      setCart(res.data);
    }
    window.dispatchEvent(new Event('cartUpdated'));
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
        <div className="cart-empty-wrapper">
          <div className="cart-empty">
            <ShoppingBag size={80} className="empty-cart-icon" />
            <h2>Your Cart is Empty</h2>
            <p>
              Hit a plateau? Rediron products are here to lift you!
            </p>
            <Link to="/shop-categories/proteins" className="red-cta">
              Shop Rediron
            </Link>
            <div className="cart-trust-badges">
              <span><ShieldCheck size={16} /> 100% Safe & Secure payments</span>
              <span><Gift size={16} /> Earn Rediron Points</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );

  // Price summary calculation
  const subtotal = cart.items.reduce(
    (sum, item) => sum + (item.product_variant?.price || item.product?.price || 0) * item.quantity,
    0
  );
  // For discount: assume just product.discount_percent; adapt as needed
  const discount =
    cart.items.reduce(
      (sum, item) => {
        const prod = item.product_variant?.product || item.product;
        return sum +
          (prod?.discount_percent
            ? (prod.price * prod.discount_percent) / 100 * item.quantity
            : 0);
      },
      0
    ) || 0;
  const total = subtotal - discount;

  return (
    <div className="cart-main rediron-theme">
      <Header />

      {/* Progress Steps */}
      <div className="cart-steps">
        <span className="current">1 Cart</span> <ChevronRight size={14} />
        <span>2 Address</span> <ChevronRight size={14} />
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
          <Link className="continue-shop" to="/shop-categories/proteins">
            &larr; Continue Shopping
          </Link>
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
            <Gift size={16} className="loyalty-icon" /> You’ll earn {Math.ceil(total / 30)} Rediron Points on this order.
          </div>
          <Link to="/shop-checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="cart-trust-bar">
        <span><ShieldCheck size={18}/> 100% Safe & Secure payments</span>
        <span><Gift size={18}/> Earn Rediron Points</span>
        <span><Truck size={18}/> Fast Delivery</span>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
