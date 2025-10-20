import React from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  // If your product object has nested variant info, adapt as needed
  const img = product.image || (product.variants && product.variants[0]?.image);
  const price = product.price;
  const mrp = product.mrp;
  const discount = product.discount_percent || (mrp && price ? Math.round(100 - (price / mrp) * 100) : 0);
  const rating = product.rating || product.avg_rating;

  return (
    <div className="productcard-main">
      <Link to={`/product/${product.id}`} className="productcard-img-link">
        <img src={img} alt={product.name} className="productcard-img" />
      </Link>
      <div className="productcard-content">
        <Link to={`/product/${product.id}`} className="productcard-title">
          {product.name}
        </Link>
        {product.variant_name && 
          <div className="productcard-variant">{product.variant_name}</div>
        }
        <div className="productcard-price-row">
          <span className="productcard-price">
            ₹{price?.toLocaleString()}
          </span>
          {mrp && (
            <span className="productcard-mrp">₹{mrp?.toLocaleString()}</span>
          )}
          {discount > 0 && (
            <span className="productcard-discount">{discount}% off</span>
          )}
        </div>
        {typeof rating === "number" && (
          <div className="productcard-rating">
            <span className="star">★</span> {rating?.toFixed(1)}
          </div>
        )}
        <Link to={`/product/${product.id}`}>
          <button className="productcard-cart-btn">View / Add to Cart</button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
