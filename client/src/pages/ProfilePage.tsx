import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { fetchProfile, logout } from "../features/auth/slice/authSlice";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile());
    }
  }, [user, dispatch]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 px-4">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-2 py-6">
      <div className="bg-white shadow-md rounded-xl px-4 py-6 w-full max-w-md mt-8 sm:mt-10 text-center">
        <h2 className="text-lg sm:text-xl font-semibold">{user.username}</h2>
        <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">{user.email}</p>
        <div className="space-y-3">
          <button
            onClick={() => navigate("/tasks")}
            className="w-full py-2 rounded bg-pink-100 text-pink-800 hover:bg-pink-200 transition"
          >
            View Tasks
          </button>
          <button
            onClick={() => navigate("/calendar")}
            className="w-full py-2 rounded bg-green-100 text-green-800 hover:bg-green-200 transition"
          >
            Calendar
          </button>
          <button
            onClick={() => navigate("/progress")}
            className="w-full py-2 rounded bg-sky-100 text-sky-800 hover:bg-sky-200 transition"
          >
            View Reports
          </button>
          <button
            onClick={() => {
              dispatch(logout());
              navigate("/auth/login");
            }}
            className="w-full py-2 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
