import React from "react";
import { ClipLoader } from "react-spinners";

const Loader: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-white/70 dark:bg-gray-900/80 backdrop-blur-sm">
    <ClipLoader color="#2563eb" size={45} speedMultiplier={1} />
  </div>
);

export default Loader;
