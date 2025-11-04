import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { signupUser } from "../features/auth/slice/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const pastelButtonBlue =
  "bg-blue-300 text-blue-800 hover:bg-blue-400 transition-colors";

const Spinner: React.FC = () => (
  <svg
    className="animate-spin h-5 w-5 text-blue-700"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-label="Loading spinner"
    role="img"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

const SignupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordError(
        value.length < 8 ? "Password must be at least 8 characters long" : null
      );
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    try {
      await dispatch(signupUser(form)).unwrap();
      navigate("/profile");
    } catch {
      /* handled by Redux */
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${API_URL}/google`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-grow flex items-center justify-center"
      >
        <div className="w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Create an Account
          </h1>

          {(passwordError || error) && (
            <p className="text-red-500 text-center mb-4 text-sm" role="alert">
              {passwordError || error}
            </p>
          )}

          <form onSubmit={handleSignup} className="space-y-4" noValidate>
            <input
              name="username"
              placeholder="Username"
              className="w-full border-gray-300 px-4 py-3 rounded-md border focus:ring-2 focus:ring-blue-500"
              value={form.username}
              onChange={handleChange}
              required
              aria-label="Username"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border-gray-300 px-4 py-3 rounded-md border focus:ring-2 focus:ring-blue-500"
              value={form.email}
              onChange={handleChange}
              required
              aria-label="Email"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={`w-full border ${
                passwordError ? "border-red-400" : "border-gray-300"
              } px-4 py-3 rounded-md focus:ring-2 focus:ring-blue-500`}
              value={form.password}
              onChange={handleChange}
              required
              aria-label="Password"
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border-gray-300 px-4 py-3 rounded-md border focus:ring-2 focus:ring-blue-500"
              aria-label="Role"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${pastelButtonBlue} py-3 rounded-md font-semibold text-sm shadow-md disabled:opacity-50 flex justify-center items-center gap-2`}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <Spinner />
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm select-none">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-md font-medium text-gray-700 hover:bg-gray-50"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            Sign up with Google
          </button>

          <p className="text-center text-sm mt-5 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
