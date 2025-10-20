import React, { forwardRef } from "react";
import "./Input.css";

const Input = forwardRef(({ className = "", type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={`custom-input ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
