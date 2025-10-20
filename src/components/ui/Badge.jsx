import React from "react";
import "./Badge.css";

const Badge = ({ variant = "default", className = "", children, ...props }) => {
  return (
    <span
      className={`badge badge-${variant} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
