import React, { useState, useEffect } from "react";
import type { AxiosResponse } from "axios";
import axiosInstance from "../../../lib/axiosInstance";
import type { User } from "../../../features/tasks/types/task.types";
import { motion } from "framer-motion";

const pastelButton = "bg-pink-200 border-pink-300 text-pink-900 hover:bg-pink-300 transition-colors";
const pastelInputBorder = "border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200";

const TasksPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "",
    assignedTo: "",
  });

  const fetchUsers = async (): Promise<void> => {
    try {
      const res = await axiosInstance.get("/users");
      const data = Array.isArray(res.data) ? res.data : res.data.users;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddTask = async (): Promise<void> => {
    if (!newTask.title.trim()) {
      alert("Please enter a task title");
      return;
    }

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
        alert("✅ Task added successfully!");
        setNewTask({ title: "", description: "", category: "", assignedTo: "" });
        window.dispatchEvent(new CustomEvent("tasksUpdated"));
      }
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto py-10 px-4 sm:px-6 md:px-8 lg:px-10 bg-white min-h-screen rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Add New Task</h2>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className={`p-2 rounded-lg border ${pastelInputBorder} text-gray-800`}
          placeholder="Task title"
        />

        <textarea
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className={`p-2 rounded-lg border ${pastelInputBorder} text-gray-800`}
          placeholder="Description (optional)"
          rows={2}
        />

        <input
          type="text"
          value={newTask.category}
          onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
          className={`p-2 rounded-lg border ${pastelInputBorder} text-gray-800`}
          placeholder="Category (e.g., Design, Backend, Docs)"
        />

        <select
          value={newTask.assignedTo}
          onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
          className={`p-2 rounded-lg border ${pastelInputBorder} text-gray-700`}
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
          className={`py-2 rounded-lg border ${pastelButton} font-semibold shadow-md`}
          type="button"
        >
          Add Task
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TasksPage;
