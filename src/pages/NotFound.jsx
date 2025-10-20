import React from "react";
import "./NotFound.css";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="notfound-main rediron-theme">
    <div className="notfound-center">
      <div className="notfound-title">404</div>
      <div className="notfound-msg">Sorry, the page you are looking for cannot be found.</div>
      <Link to="/" className="notfound-homebtn">
        Go to Homepage
      </Link>
    </div>
  </div>
);

export default NotFound;
