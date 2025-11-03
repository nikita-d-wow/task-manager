import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { fetchProfile, setUser } from "../features/auth/slice/authSlice";
import { updateProfileApi } from "../features/auth/services/authApi";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const avatarOptions = [
  "/avatars/1.png",
  "/avatars/2.png",
  "/avatars/3.png",
  "/avatars/4.jpg",
];

const ProfilePage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");

  const [editUsername, setEditUsername] = useState("");
  const [editAvatar, setEditAvatar] = useState(avatarOptions[0]);
  const [editRole, setEditRole] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  useEffect(() => {
    if (!user && token) {
      dispatch(fetchProfile());
    } else if (user) {
      setEditUsername(user.username ?? "");
      setEditAvatar(user.avatar ?? avatarOptions[0]);
      setEditRole(user.role ?? "");
    }
  }, [user, token, dispatch]);

  const handleSaveChanges = async () => {
    if (!token || !user) return;

    try {
      setLoading(true);
      const payload = {
        username: editUsername.trim(),
        avatar: editAvatar,
        role: editRole.trim(),
      };
      const response = await updateProfileApi(token, payload);
      const updatedUser =
        response.data?.user || response.data || { ...user, ...payload };

      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage("✅ Profile updated successfully!");
      setTimeout(() => setMessage(""), 2500);
    } catch (error) {
      console.error("Update failed:", error);
      setMessage("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 bg-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border border-gray-100 shadow-md rounded-2xl p-8 w-full max-w-md text-center"
      >
        {/* Avatar Section */}
        <div className="relative inline-block">
          <motion.img
            whileHover={{ scale: 1.1 }}
            src={editAvatar}
            alt="User avatar"
            className="w-28 h-28 rounded-full mx-auto cursor-pointer border-4 border-gray-200 hover:border-blue-400 transition-all shadow-sm"
            onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
          />

          {avatarMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-white shadow-xl border rounded-xl p-4 grid grid-cols-3 gap-3 z-50 w-72 max-h-60 overflow-y-auto"
            >
              {avatarOptions.map((imgUrl) => (
                <motion.img
                  key={imgUrl}
                  whileHover={{ scale: 1.15 }}
                  src={imgUrl}
                  alt="avatar option"
                  className={`w-16 h-16 rounded-full cursor-pointer border-2 transition-transform ${
                    editAvatar === imgUrl
                      ? "border-blue-500 scale-110"
                      : "border-transparent"
                  }`}
                  onClick={() => {
                    setEditAvatar(imgUrl);
                    setAvatarMenuOpen(false);
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Info */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {editUsername || "Unnamed User"}
          </h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
          <p className="text-gray-600 text-sm italic">
            {editRole || "No role set"}
          </p>
        </div>

        {/* Editable Inputs */}
        <div className="mt-6 text-left space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Edit Username
            </label>
            <input
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              className="border rounded-md w-full p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Edit Role</label>
            <input
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="border rounded-md w-full p-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 mt-6">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSaveChanges}
            disabled={loading}
            className={`w-full py-2 rounded bg-blue-300 text-blue-600 font-semibold hover:bg-blue-400 transition flex items-center justify-center ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading && <Loader2 className="animate-spin mr-2" />}
            {loading ? "Updating..." : "Save Changes"}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/tasks")}
            className="w-full py-2 rounded bg-green-100 text-green-800 hover:bg-green-200 transition font-medium"
          >
            View Tasks
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/calendar")}
            className="w-full py-2 rounded bg-sky-100 text-sky-800 hover:bg-sky-200 transition font-medium"
          >
            Calendar
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/progress")}
            className="w-full py-2 rounded bg-purple-100 text-purple-800 hover:bg-purple-200 transition font-medium"
          >
            View Reports
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              localStorage.removeItem("auth_token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="w-full py-2 rounded bg-red-100 text-red-700 hover:bg-red-200 transition font-medium"
          >
            Logout
          </motion.button>
        </div>

        {message && (
          <p
            className={`text-sm mt-4 ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
