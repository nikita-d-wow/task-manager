import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import axiosInstance from "../lib/axiosInstance";
import type { RootState } from "../app/store";
import type { Task } from "../features/tasks/types/task.types";
import { io, Socket } from "socket.io-client";

interface ExtendedTask extends Task {
  deleted?: boolean;
  isDeleted?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const socket: Socket = io(API_URL, { autoConnect: false });

const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<ExtendedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axiosInstance.get<{ tasks?: ExtendedTask[] }>("/dashboard");

      if (res.data?.tasks && Array.isArray(res.data.tasks)) {
        setTasks(res.data.tasks);
      } else {
        const taskRes = await axiosInstance.get<ExtendedTask[]>("/tasks");
        setTasks(Array.isArray(taskRes.data) ? taskRes.data : []);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError("Error fetching dashboard data: " + e.message);
      } else {
        setError("Error fetching dashboard data: Unknown error");
      }
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    if (!socket.connected) {
      socket.io.opts.extraHeaders = { Authorization: `Bearer ${localStorage.getItem("auth_token")}` };
      socket.connect();
    }

    socket.emit("registerUser", user?.id);

    socket.on("newTaskAssigned", () => {
      fetchDashboardData();
    });

    return () => {
      socket.off("newTaskAssigned");
      socket.disconnect();
    };
  }, [user?.id]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const deletedTasks = tasks.filter((t) => t.deleted || t.isDeleted).length;
  const inProgressTasks = totalTasks - completedTasks - deletedTasks;

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime())
    .slice(0, 4);

  const StatCard = ({
    title,
    count,
    color,
    bgColor,
    delay,
  }: {
    title: string;
    count: number;
    color: string;
    bgColor: string;
    delay: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`${bgColor} rounded-xl px-5 py-6 shadow-sm hover:shadow-md transition-all cursor-pointer backdrop-blur-sm bg-opacity-80`}
      role="region"
      aria-label={`${title} task count`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-sm font-medium ${color}`}>{title}</h3>
          <p className="text-3xl font-bold text-gray-800 mt-1">{count}</p>
          <p className="text-xs text-gray-500 mt-1">{count} Tasks</p>
        </div>
        <motion.div
          className={`w-10 h-10 ${color} bg-opacity-10 rounded-full flex items-center justify-center text-black text-sm font-bold`}
          whileHover={{ scale: 1.1 }}
          aria-hidden="true"
        >
          {count}
        </motion.div>
      </div>
    </motion.div>
  );

  return (
  <div className="min-h-screen bg-texture bg-cover bg-fixed bg-center text-gray-800 transition-all duration-500 px-4 py-8 max-w-screen-lg mx-auto">
    {loading ? (
      <motion.div
        className="flex items-center justify-center h-[60vh]"
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1.5, repeatType: "mirror" }}
      >
        <p className="text-gray-500 text-lg">Loading your dashboard...</p>
      </motion.div>
    ) : (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Welcome back,{" "}
          <span className="text-cyan-600">{user?.username || "Explorer"} 👋</span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Here’s a snapshot of your progress today
        </p>
      </motion.div>
    )}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-center" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard title="On going" count={inProgressTasks} color="text-blue-600" bgColor="bg-blue-50" delay={0.1} />
        <StatCard title="Completed" count={completedTasks} color="text-green-600" bgColor="bg-green-50" delay={0.2} />
        <StatCard title="Deleted" count={deletedTasks} color="text-red-600" bgColor="bg-red-50" delay={0.3} />
        <StatCard title="Total" count={totalTasks} color="text-purple-600" bgColor="bg-purple-50" delay={0.4} />
      </div>

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md px-5 py-6 border border-gray-100"
        aria-label="Recent Activity"
      >
        <h2 className="text-lg font-bold mb-6 text-gray-800">Recent Activity</h2>
        <div className="space-y-4">
          {recentTasks.length > 0 ? (
            recentTasks.map((task, i) => {
              const isDeleted = task.deleted || task.isDeleted;
              const statusColor = task.completed
                ? "text-green-600"
                : isDeleted
                ? "text-red-600"
                : "text-yellow-600";
              const statusText = task.completed ? "Completed" : isDeleted ? "Deleted" : "Pending";

              return (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`${
                    isDeleted ? "opacity-60 line-through" : ""
                  } bg-gray-50/80 backdrop-blur-sm rounded-lg border p-4 hover:shadow-md transition-shadow`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">{task.title}</h4>
                      <p className="text-sm text-gray-500">{task.project || "General Project"}</p>
                    </div>
                    <span className={`text-sm font-semibold ${statusColor}`}>{statusText}</span>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm">No recent tasks found.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
