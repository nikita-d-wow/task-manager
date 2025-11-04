import React, { useEffect, useState } from "react";
import type { AxiosResponse } from "axios";
import axiosInstance from "../lib/axiosInstance";
import type { Task, User } from "../features/tasks/types/task.types";
import { Loader2, ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";

const pastelColors = [
  "border-blue-200 bg-blue-50",
  "border-pink-200 bg-pink-50",
  "border-green-200 bg-green-50",
  "border-yellow-200 bg-yellow-50",
  "border-purple-200 bg-purple-50",
];

const buttonClass = {
  done: "bg-green-200 text-green-900 hover:bg-green-300 transition-colors",
  edit: "bg-yellow-200 text-yellow-900 hover:bg-yellow-300 transition-colors",
  delete: "bg-pink-200 text-pink-900 hover:bg-pink-300 transition-colors",
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const socket: Socket = io(API_URL, { autoConnect: false });


const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskNotification, setNewTaskNotification] = useState<boolean>(false);

  const fetchTasks = async (): Promise<void> => {
    setLoading(true);
    try {
      const res: AxiosResponse<Task[]> = await axiosInstance.get("/tasks");
      const fetchedTasks = Array.isArray(res.data) ? res.data : [];
      setTasks(fetchedTasks);
      console.log("Fetched tasks:", fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    socket.on("connect", () => console.log("Socket connected"));
    socket.on("disconnect", (reason) => console.log("Socket disconnected:", reason));
    socket.on("connect_error", (err) => console.error("Socket connection error:", err));

    socket.on("newTaskAssigned", (data) => {
      console.log("Socket event newTaskAssigned received:", data);
      fetchTasks();
      setNewTaskNotification(true);
    });

    return () => {
      socket.off("newTaskAssigned");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  const toggleTaskCompletion = async (id: string, completed: boolean): Promise<void> => {
    try {
      await axiosInstance.put(`/tasks/${id}`, { completed: !completed });
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, completed: !completed } : t))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (!editingTask || !editingTask._id) return;
    try {
      const res = await axiosInstance.put(`/tasks/${editingTask._id}`, editingTask);
      setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? res.data : t)));
      setEditingTask(null);
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 md:px-8 lg:px-12 relative">
      {newTaskNotification && (
        <div
          className="fixed top-4 right-4 bg-red-600 text-white p-2 rounded-lg shadow-lg z-50"
          role="alert"
          aria-live="polite"
        >
          New Task Assigned!
          <button className="ml-4 underline" onClick={() => setNewTaskNotification(false)}>
            Dismiss
          </button>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <motion.h1
          className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ClipboardList className="text-blue-600" size={28} />
          Your Tasks
        </motion.h1>

        {loading ? (
          <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">
            <Loader2 className="animate-spin mr-2" aria-hidden="true" />
            Loading your tasks...
          </div>
        ) : tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500"
          >
            No tasks found — go to{" "}
            <span className="text-blue-600 font-medium">Add Task</span> to create one!
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <AnimatePresence>
              {tasks.map((task, idx) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className={`rounded-xl border-l-8 shadow-sm p-5 hover:shadow-lg ${pastelColors[idx % pastelColors.length]} transition`}
                >
                  <div className="flex flex-col">
                    <h3
                      className={`font-semibold text-lg ${
                        task.completed ? "line-through text-gray-400" : "text-gray-800"
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                    {task.category && (
                      <p className="text-xs mt-2 text-purple-700 bg-purple-100 w-fit px-2 py-0.5 rounded-md">
                        {task.category}
                      </p>
                    )}
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <p>
                        {task.date} {task.time && `at ${task.time}`}
                      </p>
                      {task.assignedTo && (
                        <span>
                          Assigned to <b>{(task.assignedTo as User)?.username || "—"}</b>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => toggleTaskCompletion(task._id!, task.completed || false)}
                      className={`text-xs px-3 py-1 rounded-md shadow-sm ${buttonClass.done}`}
                    >
                      {task.completed ? "Undo" : "Done"}
                    </button>
                    <button
                      onClick={() => setEditingTask(task)}
                      className={`text-xs px-3 py-1 rounded-md shadow-sm ${buttonClass.edit}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id!)}
                      className={`text-xs px-3 py-1 rounded-md shadow-sm ${buttonClass.delete}`}
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm"
            >
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Edit Task</h3>
              <input
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                className="w-full p-2 border rounded-lg mb-2"
                placeholder="Title"
              />
              <textarea
                value={editingTask.description || ""}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                className="w-full p-2 border rounded-lg mb-2"
                rows={2}
                placeholder="Description"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingTask(null)}
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-200 text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-300 transition"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
