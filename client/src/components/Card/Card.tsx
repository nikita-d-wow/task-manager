import React from "react";

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    className={`
      bg-white rounded shadow p-4 
      w-full 
      h-320px 
      sm:h-[360px] 
      md:h-[330px] 
      ${className || ""}
    `}
  >
    {children}
  </div>
);

export default Card;
