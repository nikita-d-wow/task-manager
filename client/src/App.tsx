import React from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Sidebar from "./components/Sidebar/Sidebar";

const App: React.FC = () => {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/signup", "/google-success"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {!shouldHideNavbar && <Sidebar />}  
      <main className="p-4">
        <AppRoutes />
      </main>
    </div>
  );
};

export default App;

