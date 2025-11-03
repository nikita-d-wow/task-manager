import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  BarChart2,
  User,
  LogIn,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("auth_token");

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/signup");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Tasks", path: "/tasks", icon: <CheckSquare size={20} /> },
    { name: "Calendar", path: "/calendar", icon: <CalendarDays size={20} /> },
    { name: "Reports", path: "/progress", icon: <BarChart2 size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Home", path: "/home", icon: <User size={20} /> },
  ];

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-2 rounded-md font-medium transition ${
      location.pathname === path
        ? "bg-blue-300 text-blue-900" // pastel blue bg and dark blue text for active
        : "text-gray-700 hover:bg-blue-100" // pastel hover effect
    }`;

  return (
    <>
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-white shadow">
        {/* Left: Menu button */}
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-md text-gray-600 hover:bg-blue-100 transition"
        >
          <Menu size={22} />
        </button>

        {/* Right: App name */}
        <h1 className="text-lg font-semibold text-teal-700">Task Manager</h1>
      </div>

      {/* Overlay (blurred background) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 backdrop-blur-sm bg-white/20 z-40 transition-all"
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-blue-600">Menu</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-md hover:bg-blue-100 text-gray-600 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav links */}
        <div className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className={linkClass(item.path)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}

          {/* Auth Button */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 rounded-md font-medium text-red-600 bg-red-100 hover:bg-red-200 w-full transition"
            >
              <LogOut size={20} />
              Logout
            </button>
          ) : (
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 rounded-md font-medium text-blue-900 bg-blue-300 hover:bg-blue-400 transition"
            >
              <LogIn size={20} />
              Sign Up
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
