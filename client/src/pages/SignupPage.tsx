import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { signupUser } from "../features/auth/slice/authSlice";
import { useNavigate, Link } from "react-router-dom";

const SignupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(signupUser(form)).unwrap();
      navigate("/profile");
    } catch (err) {
      alert(
        "Signup failed: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
          Create an Account
        </h1>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            className="w-full border-gray-300 px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border-gray-300 px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border-gray-300 px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold text-sm sm:text-base hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-5 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
