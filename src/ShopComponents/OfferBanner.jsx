import React from "react";
import "./OfferBanner.css";

const OfferBanner = ({ img, alt, url }) => {
  if (!img) return null;

  const handleClick = () => {
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <div className="offerbanner-main" onClick={handleClick} style={{ cursor: url ? 'pointer' : 'default' }}>
      <img
        src={img}
        alt={alt || "Banner"}
        className="offerbanner-image"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div className="offerbanner-placeholder" style={{ display: 'none' }}>
        <span>{alt || "Banner Image"}</span>
      </div>
    </div>
  );
};

export default OfferBanner;
