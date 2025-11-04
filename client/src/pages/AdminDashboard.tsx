import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const pastelButtonGreen = "bg-green-200 text-green-700 hover:bg-green-300";
const pastelButtonYellow = "bg-yellow-200 text-yellow-800 hover:bg-yellow-300";
const pastelButtonBlue = "bg-blue-200 text-blue-800 hover:bg-blue-300";
const pastelButtonPink = "bg-pink-200 text-pink-700 hover:bg-pink-300";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Task {
  _id: string;
  title: string;
  status: string;
  createdBy?: { username: string; email: string; _id?: string };
  assignedTo?: { username: string; email: string; _id?: string };
  createdAt: string;
}

interface Activity {
  _id: string;
  action: string;
  createdAt: string;
  ip?: string;
  meta?: Record<string, unknown>;
}

const socket: Socket = io(API_URL, { autoConnect: false });

const AdminDashboard: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<Activity[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Pending filter inputs
  const [pendingSearch, setPendingSearch] = useState("");
  const [pendingRole, setPendingRole] = useState("all");
  // Applied filters used for fetching
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const fetchUsers = useCallback(async () => {
    if (user?.role !== "admin") return;
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string | number> = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (role !== "all") params.role = role;

      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      const fetchedUsers = res.data?.users || res.data;
      setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
      setPages(res.data?.pages || 1);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError("Failed to load users: " + e.message);
      } else {
        setError("Failed to load users: Unknown error");
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, role, token, user]);

  const fetchTasks = useCallback(async () => {
    if (user?.role !== "admin") return;
    try {
      setError(null);
      const res = await axios.get(`${API_URL}/admin/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.tasks || res.data;
      setTasks(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError("Failed to load tasks: " + e.message);
      } else {
        setError("Failed to load tasks: Unknown error");
      }
    }
  }, [token, user]);

  const fetchUserLogs = useCallback(
    async (id: string) => {
      try {
        setError(null);
        const res = await axios.get(`${API_URL}/admin/users/${id}/activity`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data?.logs || res.data || []);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError("Failed to load user logs: " + e.message);
        } else {
          setError("Failed to load user logs: Unknown error");
        }
        setLogs([]);
      }
    },
    [token]
  );

  const handleRoleChange = async (id: string, newRole: string) => {
    if (user?.role !== "admin") {
      alert("Unauthorized action");
      return;
    }
    try {
      await axios.patch(
        `${API_URL}/admin/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUsers();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError("Failed to update role: " + e.message);
      } else {
        setError("Failed to update role: Unknown error");
      }
    }
  };

  const assignTaskToUser = async (title: string, userId: string) => {
    try {
      setError(null);
      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      await axios.post(
        `${API_URL}/admin/tasks`,
        {
          title,
          assignedTo: userId,
          status: "pending",
          date: new Date().toISOString(),
          time: currentTime,
          description: "",
          avatar: [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNewTaskTitle("");
      await fetchTasks();

      if (selectedUser?._id) {
        await fetchUserLogs(selectedUser._id);
      }

      alert("Task assigned successfully and logs updated");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError("Failed to assign task: " + e.message);
        alert("Failed to assign task: " + e.message);
      } else {
        setError("Failed to assign task: Unknown error");
        alert("Failed to assign task");
      }
    }
  };

  useEffect(() => {
    if (user?.role !== "admin") return;

    if (!socket.connected) {
      socket.io.opts.extraHeaders = { Authorization: `Bearer ${token}` };
      socket.connect();
    }

    socket.emit("registerUser", user.id);

    socket.on("newTaskAssigned", (data) => {
      setTasks((prevTasks) => [...prevTasks, data.task]);
      if (selectedUser && selectedUser._id === data.task.assignedTo?._id) {
        fetchUserLogs(selectedUser._id);
      }
    });

    return () => {
      socket.off("newTaskAssigned");
      socket.disconnect();
    };
  }, [user, token, selectedUser, fetchUserLogs]);

  // Fetch users when page or filters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Fetch tasks once on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Apply filters on button click only
  const applyFilters = () => {
    setPage(1);
    setSearch(pendingSearch.trim());
    setRole(pendingRole);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-600">
        Loading admin data...
      </div>
    );

  if (user?.role !== "admin")
    return (
      <div className="flex justify-center mt-20 text-gray-700">
        Access denied. Admins only.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-6 max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 sm:text-4xl">
        👑 Admin Dashboard
      </h1>

      {error && (
        <div className="text-red-600 bg-red-100 p-3 rounded mb-6 max-w-xl mx-auto text-center">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Total Users", value: users.length },
          { label: "Total Tasks", value: tasks.length },
          { label: "Logged in as", value: `${user.username} (${user.role})` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white shadow p-6 rounded-2xl text-center break-words"
          >
            <h3 className="text-gray-500 text-sm mb-2">{label}</h3>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 justify-center mb-6">
        <input
          type="text"
          placeholder="🔍 Search username or email"
          value={pendingSearch}
          onChange={(e) => setPendingSearch(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full max-w-xs focus:ring-2 focus:ring-blue-400 outline-none transition"
        />
        <select
          value={pendingRole}
          onChange={(e) => setPendingRole(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full max-w-xs focus:ring-2 focus:ring-blue-400 outline-none transition"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admins</option>
          <option value="user">Users</option>
        </select>
        <button
          onClick={applyFilters}
          className={`px-6 py-2 rounded-lg font-semibold transition ${pastelButtonBlue} w-full max-w-xs`}
        >
          Apply Filters
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4 px-6 pt-6 text-gray-800">
          👥 Manage Users
        </h2>
        {users.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No users found.</p>
        ) : (
          <table className="min-w-full border-collapse table-auto text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                {["Username", "Email", "Role", "Joined", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="py-3 px-6 border font-medium text-left whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-6 whitespace-nowrap">{u.username}</td>
                  <td className="py-3 px-6 whitespace-nowrap">{u.email}</td>
                  <td className="py-3 px-6 capitalize whitespace-nowrap">{u.role}</td>
                  <td className="py-3 px-6 whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 flex flex-wrap gap-2">
                    {/* Show Promote/Demote for all users */}
                    {u.role !== "admin" && (
                      <button
                        onClick={() => handleRoleChange(u._id, "admin")}
                        className={`${pastelButtonGreen} px-4 py-1 rounded-md text-sm font-medium shadow-sm transition flex-1 min-w-[100px] text-center`}
                      >
                        Promote
                      </button>
                    )}
                    {u.role === "admin" && u._id !== user?.id && (
                      <button
                        onClick={() => handleRoleChange(u._id, "user")}
                        className={`${pastelButtonYellow} px-4 py-1 rounded-md text-sm font-medium shadow-sm transition flex-1 min-w-[100px] text-center`}
                      >
                        Demote
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        fetchUserLogs(u._id);
                      }}
                      className={`${pastelButtonBlue} px-4 py-1 rounded-md text-sm font-medium shadow-sm transition flex-1 min-w-[100px] text-center`}
                    >
                      Logs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {[...Array(pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-5 py-2 rounded-md transition ${
                page === i + 1
                  ? "bg-blue-400 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Logs Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50 p-4 bg-white bg-opacity-30 backdrop-blur-md"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
              aria-label="Close Logs Modal"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Activity & Tasks — {selectedUser.username}
            </h2>

            {logs.length > 0 ? (
              <ul className="space-y-2 max-h-[250px] overflow-y-auto border rounded p-2 mb-6">
                {logs.map((log) => (
                  <li
                    key={log._id}
                    className="border-b py-2 text-sm text-gray-700"
                  >
                    <div className="font-medium">{log.action}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(log.createdAt).toLocaleString()} •{" "}
                      {log.ip || "N/A"}
                    </div>
                    {log.meta && (
                      <div className="text-xs italic text-gray-400">
                        {JSON.stringify(log.meta)}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm mb-6">
                No activity logs available.
              </p>
            )}

            <h3 className="font-semibold mb-4 text-gray-900">
              Tasks Created by {selectedUser.username}
            </h3>
            <ul className="space-y-1 max-h-[150px] overflow-y-auto border rounded p-2 mb-6">
              {tasks.filter((t) => t.createdBy?.username === selectedUser.username)
                .map((task) => (
                  <li
                    key={task._id}
                    className="border-b py-2 text-sm text-gray-700"
                  >
                    <span className="font-medium">{task.title}</span>
                    <span className="text-xs text-gray-500">
                      – {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              {tasks.filter((t) => t.createdBy?.username === selectedUser.username).length === 0 && (
                <li className="text-gray-500 text-sm">No tasks created by this user.</li>
              )}
            </ul>

            <div>
              <h3 className="text-lg font-semibold mb-3">Assign New Task</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const title = newTaskTitle.trim();
                  if (title && selectedUser) {
                    assignTaskToUser(title, selectedUser._id);
                  }
                }}
                className="flex gap-3"
              >
                <input
                  type="text"
                  placeholder="Task title"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className={`${pastelButtonPink} px-4 py-2 rounded transition`}
                >
                  Assign
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
