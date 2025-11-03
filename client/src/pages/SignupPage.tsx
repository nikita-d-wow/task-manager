import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { signupUser } from "../features/auth/slice/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const pastelButtonBlue = "bg-blue-300 text-blue-800 hover:bg-blue-400 transition-colors";

const SignupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordError(value.length < 8 ? "Password must be at least 8 characters long" : null);
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
      // error handled by Redux, no alert needed
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${API_URL}/google`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100"
      >
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800"
        >
          Create an Account
        </motion.h1>

        {(passwordError || error) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center mb-4"
          >
            {passwordError || error}
          </motion.p>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <motion.input
            name="username"
            placeholder="Username"
            className="w-full border-gray-300 px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            value={form.username}
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.02 }}
          />
          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border-gray-300 px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            value={form.email}
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.02 }}
          />
          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            className={`w-full border ${
              passwordError ? "border-red-400" : "border-gray-300"
            } px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`}
            value={form.password}
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.02 }}
          />

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.95 }}
            className={`w-full ${pastelButtonBlue} py-3 rounded-md font-semibold text-sm sm:text-base shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </motion.button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <motion.button
          onClick={handleGoogleSignup}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-all"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          Sign up with Google
        </motion.button>

        <p className="text-center text-sm mt-5 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
