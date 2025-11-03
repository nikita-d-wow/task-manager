import React from "react";
import { cardShadow } from "../../constants/ui";

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={`bg-white dark:bg-gray-900 rounded-xl ${cardShadow} w-full ${className}`}>
    {children}
  </div>
);

export default Card;
