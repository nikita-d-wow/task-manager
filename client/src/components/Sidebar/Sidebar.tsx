import { useState, useEffect } from "react";
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
  Shield,
  Home,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:5000");

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [newTaskNotification, setNewTaskNotification] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "admin";

  const isLoggedIn = !!localStorage.getItem("auth_token");

  useEffect(() => {
    const userId = user?.id || localStorage.getItem("user_id");
    if (userId) {
      socket.emit("registerUser", userId);
    }
    socket.on("newTaskAssigned", () => {
      setNewTaskNotification(true);
    });
    return () => {
      socket.off("newTaskAssigned");
    };
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/signup");
  };

  const navItems = [
    { name: "Home", path: "/home", icon: <Home size={20} /> },
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Tasks", path: "/tasks", icon: <CheckSquare size={20} /> },
    { name: "Calendar", path: "/calendar", icon: <CalendarDays size={20} /> },
    { name: "Reports", path: "/progress", icon: <BarChart2 size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
  ];

  if (isAdmin) {
    navItems.push({
      name: "Admin Dashboard",
      path: "/admin",
      icon: <Shield size={20} />,
    });
  }

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-2 rounded-md font-medium transition ${
      location.pathname === path ? "bg-blue-300 text-blue-900" : "text-gray-700 hover:bg-blue-100"
    }`;

  return (
    <>
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-white shadow">
        <button onClick={() => setOpen(true)} className="p-2 rounded-md text-gray-600 hover:bg-blue-100 transition">
          <Menu size={22} />
        </button>

        <h1 className="text-lg font-semibold text-teal-700">Task Manager</h1>

        {newTaskNotification && (
          <div className="relative">
            <div className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
            <div className="relative w-3 h-3 bg-red-600 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 backdrop-blur-sm bg-white/20 z-40 transition-all"></div>}

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-blue-600">Menu</h2>
          <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-blue-100 text-gray-600 transition">
            <X size={22} />
          </button>
        </div>

        {/* Nav Links */}
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
              {item.name === "Home" && newTaskNotification && (
                <span className="ml-auto bg-red-600 text-white rounded-full px-2 text-xs">New</span>
              )}
            </Link>
          ))}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 rounded-md font-medium text-red-600 bg-red-100 hover:bg-red-200 w-full transition"
            >
              <LogOut size={20} />
              Logout
            </button>
          ) : (
            <Link to="/signup" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-md font-medium text-blue-900 bg-blue-300 hover:bg-blue-400 transition">
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
