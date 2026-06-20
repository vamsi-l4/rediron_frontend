import React, { useEffect, useState } from "react";
import "./OrderHistory.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
// import ProductCard from "../ShopComponents/ProductCard";
import Loader from "../ShopComponents/Loader";
import API from "../components/Api";
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Clock3, MapPin, PackageCheck, RefreshCw, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusMap = {
  Pending: { label: "Pending", Icon: Clock3 },
  Processing: { label: "Processing", Icon: RefreshCw },
  Shipped: { label: "Shipped", Icon: PackageCheck },
  Delivered: { label: "Delivered", Icon: CheckCircle2 },
  Cancelled: { label: "Cancelled", Icon: XCircle }
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState(null);
  const navigate = useNavigate();

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
        <button className="shop-page-back" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Back</button>
        <div className="order-empty">
          <h2>No orders yet</h2>
          <p>
            You haven't placed any orders. Browse our <a href="/shop-categories/proteins" className="red-cta">top products</a> and start your fitness journey!
          </p>
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="orderhistory-main rediron-theme">
      <Header />
      <button className="shop-page-back" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Back</button>
      <div className="orderhistory-title">Your Order History</div>
      <div className="orders-list">
        {orders.map(order => {
          const status = statusMap[order.status] || statusMap.Pending;
          const StatusIcon = status.Icon;
          return (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <span className="orderid">Order #{order.id}</span>
                <span className="orderdate">{new Date(order.placed_at).toLocaleDateString()}</span>
              </div>
              <span className={`orderstatus status-${order.status.toLowerCase()}`}><StatusIcon size={15} /> {status.label}</span>
            </div>
            <div className="order-address">
              <span>{order.shipping_address}</span>
            </div>
            <div className="order-items">
              {(order.order_items?.length || order.items?.length)
                ? (order.order_items || order.items).map(ci => (
                    <div key={ci.id} className="order-item-mini">
                      <img
                        src={ci.product_image || ci.product_variant?.image || ci.product_variant?.product?.image}
                        alt={ci.product_name || ci.product_variant?.variant_name}
                        className="mini-img"
                      />
                      <span className="mini-name">
                        {ci.product_name || ci.product_variant?.variant_name}
                      </span>
                      <span className="mini-qty">Qty: {ci.quantity}</span>
                      <span className="mini-price">
                        ₹{ci.price}
                      </span>
                    </div>
                  ))
                : <span>No items found</span>}
            </div>
            <div className="order-footer">
              <span className="ordertotal">
                Total: ₹{order.grand_total ?? order.total_amount}
              </span>
              <button className="view-details-btn" onClick={() => setOpenOrderId(openOrderId === order.id ? null : order.id)}>
                {openOrderId === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {openOrderId === order.id ? "Hide Details" : "View Details"}
              </button>
              {order.status === "Delivered" &&
                <button className="buy-again-btn">Buy Again</button>
              }
            </div>
            {openOrderId === order.id && (
              <div className="order-detail-panel">
                <div><strong>Payment:</strong> {order.payment_method || "Not available"}</div>
                <div><strong>Status:</strong> {status.label}</div>
                <div><strong>Shipping:</strong> {order.shipping_address || "Not available"}</div>
                <div><strong>Placed:</strong> {order.placed_at ? new Date(order.placed_at).toLocaleString() : "Not available"}</div>
                <div className="order-tracking-line"><MapPin size={16} /><strong>Tracking:</strong> Order received. Packing and courier updates will appear here.</div>
              </div>
            )}
          </div>
        )})}
      </div>
      <Footer />
    </div>
  );
};

export default OrderHistory;
