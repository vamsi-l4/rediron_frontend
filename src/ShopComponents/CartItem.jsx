import React from "react";
import { makeAbsolute } from "../components/Api";
import { Minus, Plus, Trash2 } from "lucide-react";
import "./CartItem.css";

const CartItem = ({ item, onQtyChange, onRemove }) => {
  const { product_variant, quantity, id } = item;
  const product = product_variant?.product || item.product;
  const price = Number(product_variant?.price || product?.price || 0);

  return (
    <div className="cartitem-main">
      <div className="cartitem-img-block">
        <img
          src={makeAbsolute(product_variant?.image || product?.image)}
          alt={product.name}
          className="cartitem-img"
        />
      </div>
      <div className="cartitem-details">
        <div className="cartitem-title">{product.name}</div>
        {product_variant?.variant_name && <div className="cartitem-variant">{product_variant.variant_name}</div>}
        <div className="cartitem-pricing">
          <span className="cartitem-price">
            ₹{price.toLocaleString()}
          </span>
          {product?.mrp && (
            <span className="cartitem-mrp">
              MRP: ₹{Number(product.mrp).toLocaleString()}
            </span>
          )}
          {product?.discount_percent > 0 && (
            <span className="cartitem-discount">
              {product.discount_percent}% off
            </span>
          )}
        </div>
        <div className="cartitem-qty-row">
          <span>Qty:</span>
          <button
            className="qty-btn"
            onClick={() => quantity > 1 && onQtyChange(id, quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus size={15} aria-hidden="true" />
          </button>
          <span className="qty-val">{quantity}</span>
          <button
            className="qty-btn"
            onClick={() => onQtyChange(id, quantity + 1)}
          >
            <Plus size={15} aria-hidden="true" />
          </button>
        </div>
        <button className="cartitem-remove-btn" onClick={() => onRemove(id)}>
          <Trash2 size={15} aria-hidden="true" /> Remove
        </button>
      </div>
      <div className="cartitem-subtotal">
        <span className="cartitem-subtext">Subtotal</span>
        <span className="cartitem-subvalue">
          ₹{(price * quantity).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default CartItem;
