import React from "react";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar/Navbar";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <AppRoutes />
    </div>
  );
};

export default App;
