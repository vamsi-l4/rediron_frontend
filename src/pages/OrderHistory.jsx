import React, { useEffect, useState } from "react";
import "./OrderHistory.css";

import Header from "../ShopComponents/Header";
import Footer from "../ShopComponents/Footer";
// import ProductCard from "../ShopComponents/ProductCard";
import Loader from "../ShopComponents/Loader";
import API from "../components/Api";
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Clock3, MapPin, PackageCheck, RefreshCw, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { makeAbsolute } from "../components/Api";

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
  const [cancelingId, setCancelingId] = useState(null);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("Ordered by mistake");
  const [cancelNotes, setCancelNotes] = useState("");
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

  const cancelOrder = async (order) => {
    const canCancel = ["Pending", "Processing"].includes(order.status);
    if (!canCancel) return;
    setCancelingId(order.id);
    try {
      const res = await API.post(`/api/shop-orders/${order.id}/cancel/`, {
        reason: cancelReason,
        notes: cancelNotes
      });
      setOrders((current) => current.map((item) => item.id === order.id ? res.data : item));
      setCancelModalOrder(null);
      setCancelReason("Ordered by mistake");
      setCancelNotes("");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to cancel order. Please contact support.");
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) return <Loader fullPage={true} />;

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
          const displayId = order.order_number || `RI-${String(order.id).padStart(6, "0")}`;
          return (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <span className="orderid">Order #{displayId}</span>
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
                        src={makeAbsolute(ci.product_image || ci.product?.image || ci.product_variant?.product?.image || "/assets/placeholder.png")}
                        alt={ci.product_name || ci.product_variant?.variant_name}
                        className="mini-img"
                        onError={(event) => { event.currentTarget.src = "/assets/placeholder.png"; }}
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
              {["Pending", "Processing"].includes(order.status) && (
                <button
                  className="cancel-order-btn"
                  onClick={() => setCancelModalOrder(order)}
                  disabled={cancelingId === order.id}
                  type="button"
                >
                  <XCircle size={16} />
                  {cancelingId === order.id ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>
            {openOrderId === order.id && (
              <div className="order-detail-panel">
                <div><strong>Payment:</strong> {order.payment_method || "Not available"}</div>
                <div><strong>Status:</strong> {status.label}</div>
                <div><strong>Shipping:</strong> {order.shipping_address || "Not available"}</div>
                <div><strong>Placed:</strong> {order.placed_at ? new Date(order.placed_at).toLocaleString() : "Not available"}</div>
                {order.cancellation_reason && <div><strong>Cancel reason:</strong> {order.cancellation_reason}</div>}
                <div className="order-tracking-line"><MapPin size={16} /><strong>Tracking:</strong> Order received. Packing and courier updates will appear here.</div>
              </div>
            )}
          </div>
        )})}
      </div>
      {cancelModalOrder && (
        <div className="cancel-modal-backdrop" role="presentation">
          <div className="cancel-modal" role="dialog" aria-modal="true" aria-labelledby="cancel-order-title">
            <h2 id="cancel-order-title">Cancel Order</h2>
            <p>Tell us why you want to cancel this order. This helps support handle it properly.</p>
            <label>
              Reason
              <select value={cancelReason} onChange={(event) => setCancelReason(event.target.value)}>
                <option>Ordered by mistake</option>
                <option>Found a better price</option>
                <option>Delivery will take too long</option>
                <option>Changed my mind</option>
                <option>Wrong item or quantity</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Notes
              <textarea value={cancelNotes} onChange={(event) => setCancelNotes(event.target.value)} placeholder="Optional details" rows={3} />
            </label>
            <div className="cancel-modal-actions">
              <button type="button" className="view-details-btn" onClick={() => setCancelModalOrder(null)}>Keep Order</button>
              <button type="button" className="cancel-order-btn" onClick={() => cancelOrder(cancelModalOrder)} disabled={cancelingId === cancelModalOrder.id}>
                <XCircle size={16} />
                {cancelingId === cancelModalOrder.id ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default OrderHistory;
