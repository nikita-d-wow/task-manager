import React from "react";
import type { ButtonProps as Props } from "./Button.types";
import { buttonVariants } from "../../constants/ui";

const Button: React.FC<Props & { variant?: keyof typeof buttonVariants }> = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => (
  <button
    className={`px-4 py-2 rounded font-semibold ${buttonVariants[variant]} ${className} transition duration-200 hover:-translate-y-0.5 focus:outline-none`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
