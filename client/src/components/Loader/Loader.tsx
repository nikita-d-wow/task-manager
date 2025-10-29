import React from "react";
import { ClipLoader } from "react-spinners";

const Loader = () => (
  <div className="flex items-center justify-center h-screen bg-white/50 backdrop-blur-sm">
    <ClipLoader color="#ef4444" size={60} speedMultiplier={0.9} />
  </div>
);

export default Loader;
