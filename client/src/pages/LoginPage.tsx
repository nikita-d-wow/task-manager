import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loginUser } from "../features/auth/slice/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const pastelButtonBlue = "bg-blue-200 text-blue-900 hover:bg-blue-300 transition-colors";

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate("/");
    } catch {
      /* handled via inline message */
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 md:px-8 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
      >
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-center mb-6 text-gray-800"
        >
          Welcome Back 👋
        </motion.h1>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center mb-4 text-sm"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <motion.input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm transition-all bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            whileFocus={{ scale: 1.02 }}
          />
          <motion.input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm transition-all bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            whileFocus={{ scale: 1.02 }}
          />

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 rounded-md font-semibold text-sm shadow-sm ${pastelButtonBlue} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <motion.button
          onClick={handleGoogleLogin}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white py-3 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-all"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </motion.button>

        <p className="text-center text-sm mt-5 text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
