import React from "react";

const ChartWrapper: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({
  title,
  children,
  className,
}) => (
  <section
    className={`bg-white rounded-xl shadow p-4 w-full mb-8 flex flex-col min-h-[400px] ${className || ""}`}
    role="region"
    aria-label={title}
  >
    <h2 className="text-lg font-semibold mb-4 text-gray-700">{title}</h2>
    <div className="flex-1 flex items-center justify-center">{children}</div>
  </section>
);

export default ChartWrapper;
