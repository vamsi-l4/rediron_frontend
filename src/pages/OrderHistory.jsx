import React, { useEffect, useState } from "react";
import "./OrderHistory.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
// import ProductCard from "../ShopComponents/ProductCard";
import Loader from "../ShopComponents/Loader";
import API from "../components/Api";

const statusMap = {
  "Pending": "🟡 Pending",
  "Processing": "🔵 Processing",
  "Shipped": "🚚 Shipped",
  "Delivered": "✅ Delivered",
  "Cancelled": "❌ Cancelled"
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const res = await API.get('/api/shop-orders/?ordering=-placed_at');
        setOrders(res.data.results || res.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  if (!orders.length)
    return (
      <div className="orderhistory-main rediron-theme">
        <Header />
        <div className="order-empty">
          <h2>No orders yet</h2>
          <p>
            You haven't placed any orders. Browse our <a href="/category/proteins" className="red-cta">top products</a> and start your fitness journey!
          </p>
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="orderhistory-main rediron-theme">
      <Header />
      <div className="orderhistory-title">Your Order History</div>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <span className="orderid">Order #{order.id}</span>
                <span className="orderdate">{new Date(order.placed_at).toLocaleDateString()}</span>
              </div>
              <span className={`orderstatus status-${order.status.toLowerCase()}`}>{statusMap[order.status]}</span>
            </div>
            <div className="order-address">
              <span>{order.shipping_address}</span>
            </div>
            <div className="order-items">
              {order.cart.cart_items?.length
                ? order.cart.cart_items.map(ci => (
                    <div key={ci.id} className="order-item-mini">
                      <img
                        src={ci.product_variant?.image || ci.product_variant?.product?.image}
                        alt={ci.product_variant?.product?.name}
                        className="mini-img"
                      />
                      <span className="mini-name">{ci.product_variant?.product?.name}</span>
                      <span className="mini-qty">Qty: {ci.quantity}</span>
                      <span className="mini-price">
                        ₹{ci.product_variant?.price}
                      </span>
                    </div>
                  ))
                : <span>No items found</span>}
            </div>
            <div className="order-footer">
              <span className="ordertotal">
                Total: ₹{order.cart.cart_items?.reduce((sum, ci) => sum + ci.product_variant.price * ci.quantity, 0)}
              </span>
              <a href={`/orders/${order.id}`} className="view-details-btn">
                View Details
              </a>
              {order.status === "Delivered" &&
                <button className="buy-again-btn">Buy Again</button>
              }
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default OrderHistory;
