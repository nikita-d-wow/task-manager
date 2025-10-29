import React, { useState, useEffect } from "react";
import type { AxiosResponse } from "axios";
import axiosInstance from "../../../lib/axiosInstance";
import type { Task, User } from "../types/task.types";

const pastelCardColors = [
  "border-pink-200 bg-pink-50",
  "border-blue-200 bg-blue-50",
  "border-green-200 bg-green-50",
  "border-yellow-200 bg-yellow-50",
];

const buttonClass = {
  done: "bg-green-300 text-green-900 hover:bg-green-400",
  edit: "bg-yellow-300 text-yellow-900 hover:bg-yellow-400",
  delete: "bg-pink-300 text-pink-900 hover:bg-pink-400",
};

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", assignedTo: "" });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = async (): Promise<void> => {
    try {
      const res: AxiosResponse<{ success: boolean; tasks: Task[] }> = await axiosInstance.get("/tasks");
      if (res.data && Array.isArray(res.data.tasks)) {
        setTasks(res.data.tasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  };

  const fetchUsers = async (): Promise<void> => {
    try {
      const res = await axiosInstance.get("/users");
      const data = Array.isArray(res.data) ? res.data : res.data.users;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchTasks();
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

      const res: AxiosResponse<{ success: boolean; task: Task }> = await axiosInstance.post("/tasks", {
        title: newTask.title.trim(),
        description: newTask.description?.trim() || "",
        assignedTo: newTask.assignedTo || null,
        date,
        time,
      });

      if (res.data && res.data.task) {
        setTasks((prev) => [res.data.task, ...prev]);
        setNewTask({ title: "", description: "", assignedTo: "" });
        window.dispatchEvent(new CustomEvent("tasksUpdated"));
      }
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please check backend logs.");
    }
  };

  const toggleTaskCompletion = async (id: string, completed: boolean): Promise<void> => {
    try {
      await axiosInstance.put(`/tasks/${id}`, { completed: !completed });
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, completed: !completed } : t))
      );
      window.dispatchEvent(new CustomEvent("tasksUpdated"));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      window.dispatchEvent(new CustomEvent("tasksUpdated"));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = (task: Task): void => setEditingTask(task);

  const handleSaveEdit = async (): Promise<void> => {
    if (!editingTask || !editingTask._id) return;
    try {
      const res = await axiosInstance.put(`/tasks/${editingTask._id}`, editingTask);
      setTasks((prev) =>
        prev.map((t) => (t._id === editingTask._id ? res.data : t))
      );
      setEditingTask(null);
      window.dispatchEvent(new CustomEvent("tasksUpdated"));
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 px-3 bg-gray-50 min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>

      {/* Add Task */}
      <div className="flex flex-col gap-2 mb-4 bg-white p-4 rounded-lg shadow">
        <input
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="p-2 border rounded-lg"
          placeholder="Task title"
        />
        <textarea
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="p-2 border rounded-lg"
          placeholder="Description (optional)"
          rows={2}
        />
        <select
          value={newTask.assignedTo}
          onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
          className="p-2 border rounded-lg text-gray-700"
        >
          <option value="">Assign to...</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddTask}
          className="bg-blue-300 text-blue-900 py-2 rounded-lg hover:bg-blue-400"
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task, idx) => (
            <div
              key={task._id}
              className={`flex items-start justify-between shadow p-3 rounded-lg border-l-8 bg-white ${
                pastelCardColors[idx % pastelCardColors.length]
              }`}
            >
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    task.completed ? "line-through text-gray-400" : "text-gray-800"
                  }`}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                )}
                {task.assignedTo && (
                  <p className="text-xs text-blue-500 mt-1">
                    Assigned to: {users.find((u) => u._id === task.assignedTo)?.username || "—"}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">{task.date} {task.time && `at ${task.time}`}</p>
              </div>

              <div className="flex flex-col gap-2 items-end">
                <button
                  onClick={() => toggleTaskCompletion(task._id!, task.completed || false)}
                  className={`text-xs px-2 py-1 rounded ${buttonClass.done}`}
                >
                  {task.completed ? "Undo" : "Done"}
                </button>
                <button
                  onClick={() => handleEdit(task)}
                  className={`text-xs px-2 py-1 rounded ${buttonClass.edit}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id!)}
                  className={`text-xs px-2 py-1 rounded ${buttonClass.delete}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center py-6">No tasks found</p>
        )}
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm">
            <h3 className="text-lg font-semibold mb-3">Edit Task</h3>
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
            <select
              value={editingTask.assignedTo || ""}
              onChange={(e) => setEditingTask({ ...editingTask, assignedTo: e.target.value })}
              className="w-full p-2 border rounded-lg mb-4"
            >
              <option value="">Assign to...</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingTask(null)}
                className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
