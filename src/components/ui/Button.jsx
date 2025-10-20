import React, { forwardRef } from "react";
import "./Button.css";

const Button = forwardRef(
  ({ className = "", variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? "span" : "button";

    return (
      <Comp
        ref={ref}
        className={`btn btn-${variant} btn-${size} ${className}`}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export default Button;
