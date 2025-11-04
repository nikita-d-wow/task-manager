import React, { useState, useEffect } from "react";
import type { AxiosResponse } from "axios";
import axiosInstance from "../../../lib/axiosInstance";
import type { User } from "../../../features/tasks/types/task.types";
import { motion } from "framer-motion";

const pastelButton =
  "bg-pink-200 border-pink-300 text-pink-900 hover:bg-pink-300 transition-colors";

const pastelInputBorder =
  "border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200";

const TasksPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "",
    assignedTo: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const fetchUsers = async (): Promise<void> => {
    setFetchError(null);
    try {
      const res = await axiosInstance.get("/users");
      const data = Array.isArray(res.data) ? res.data : res.data.users;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setFetchError("Failed to load users. Please try again later.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddTask = async (): Promise<void> => {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!newTask.title.trim()) {
      setSubmitError("Please enter a task title");
      return;
    }

    setLoading(true);

    try {
      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const res: AxiosResponse = await axiosInstance.post("/tasks", {
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        category: newTask.category.trim(),
        assignedTo: newTask.assignedTo || null,
        date,
        time,
      });

      if (res.status === 201) {
        setSubmitSuccess("✅ Task added successfully!");
        setNewTask({ title: "", description: "", category: "", assignedTo: "" });
        window.dispatchEvent(new CustomEvent("tasksUpdated"));
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setSubmitError("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto py-10 px-6 sm:px-8 md:px-10 bg-white min-h-screen rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
        Add New Task
      </h2>

      {fetchError && (
        <p className="text-red-600 text-center mb-4" role="alert">
          {fetchError}
        </p>
      )}

      {submitError && (
        <p className="text-red-600 text-center mb-4" role="alert">
          {submitError}
        </p>
      )}

      {submitSuccess && (
        <p className="text-green-600 text-center mb-4" role="status">
          {submitSuccess}
        </p>
      )}

      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className={`p-3 rounded-lg border ${pastelInputBorder} text-gray-800`}
          placeholder="Task title"
          aria-label="Task title"
        />

        <textarea
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className={`p-3 rounded-lg border ${pastelInputBorder} text-gray-800`}
          placeholder="Description (optional)"
          rows={3}
          aria-label="Task description"
        />

        <input
          type="text"
          value={newTask.category}
          onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
          className={`p-3 rounded-lg border ${pastelInputBorder} text-gray-800`}
          placeholder="Category (e.g., Design, Backend, Docs)"
          aria-label="Task category"
        />

        <select
          value={newTask.assignedTo}
          onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
          className={`p-3 rounded-lg border ${pastelInputBorder} text-gray-700`}
          aria-label="Assign task to user"
        >
          <option value="">Assign to...</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>

        <motion.button
          onClick={handleAddTask}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`py-3 rounded-lg border ${pastelButton} font-semibold shadow-md flex justify-center items-center gap-2`}
          type="button"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-pink-900"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Loading spinner"
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
              Adding Task...
            </>
          ) : (
            "Add Task"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TasksPage;
