import React from "react";
import "./DealerCard.css";

const DealerCard = ({ dealer }) => (
  <div className="dealercard-main">
    <div className="dealercard-name">{dealer.name}</div>
    <div className="dealercard-info">
      <div>
        <b>City:</b> {dealer.city}
        {dealer.state && <span>, {dealer.state}</span>}
      </div>
      {dealer.address && (
        <div><b>Address:</b> {dealer.address}</div>
      )}
      {dealer.phone && (
        <div>
          <b>Phone:</b>{" "}
          <a href={`tel:${dealer.phone}`} className="dealercard-phone">
            {dealer.phone}
          </a>
        </div>
      )}
      {dealer.email && (
        <div>
          <b>Email:</b>{" "}
          <a href={`mailto:${dealer.email}`} className="dealercard-email">
            {dealer.email}
          </a>
        </div>
      )}
      {dealer.partner && (
        <div className="dealercard-partner">Authorized Partner</div>
      )}
    </div>
  </div>
);

export default DealerCard;
