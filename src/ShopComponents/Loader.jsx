import React from "react";
import "./Loader.css";

const Loader = ({ size = 38 }) => (
  <span className="loader-main" style={{ width: size, height: size }}>
    <span className="loader-spin"></span>
  </span>
);

export default Loader;
