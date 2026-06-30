import React from "react";
import "./Loader.css";

const Loader = ({ size = 38, fullPage = false }) => (
  <div className={fullPage ? "loader-page-center" : "loader-inline-center"}>
    <span className="loader-main" style={{ width: size, height: size }}>
      <span className="loader-spin"></span>
    </span>
  </div>
);



export default Loader;

