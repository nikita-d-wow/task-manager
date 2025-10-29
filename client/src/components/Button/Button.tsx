import React from "react";
import type { ButtonProps } from "./Button.types";

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...props
}) => (
  <button
    className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition focus:outline-none ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
