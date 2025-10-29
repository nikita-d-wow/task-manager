import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded-md font-medium ${
      location.pathname === path
        ? "bg-blue-500 text-white"
        : "text-gray-700 hover:bg-blue-100"
    }`;

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          {/* Logo or brand placeholder */}
          <div className="flex-shrink-0 font-bold text-xl">My App</div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4">
            <Link to="/" className={linkClass("/")}>
              Dashboard
            </Link>
            <Link to="/tasks" className={linkClass("/tasks")}>
              Tasks
            </Link>
            <Link to="/calendar" className={linkClass("/calendar")}>
              Calendar
            </Link>
            <Link to="/progress" className={linkClass("/progress")}>
              Reports
            </Link>
            <Link to="/profile" className={linkClass("/profile")}>
              Profile
            </Link>
            <Link to="/signup" className={linkClass("/signup")}>
              Sign Up
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              {!menuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1" id="mobile-menu">
          <Link to="/" className={linkClass("/")} onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/tasks" className={linkClass("/tasks")} onClick={() => setMenuOpen(false)}>
            Tasks
          </Link>
          <Link to="/calendar" className={linkClass("/calendar")} onClick={() => setMenuOpen(false)}>
            Calendar
          </Link>
          <Link to="/progress" className={linkClass("/progress")} onClick={() => setMenuOpen(false)}>
            Reports
          </Link>
          <Link to="/profile" className={linkClass("/profile")} onClick={() => setMenuOpen(false)}>
            Profile
          </Link>
          <Link to="/signup" className={linkClass("/signup")} onClick={() => setMenuOpen(false)}>
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
