import React, { useState, useEffect, useMemo } from "react";
import type { AxiosResponse } from "axios";
import axiosInstance from "../lib/axiosInstance";
import type { Task } from "../features/tasks/types/task.types";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { io, Socket } from "socket.io-client";

const pastelColors = [
  "border-pink-200 bg-pink-50",
  "border-blue-200 bg-blue-50",
  "border-green-200 bg-green-50",
  "border-yellow-200 bg-yellow-50",
];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const socket: Socket = io(API_URL, { autoConnect: false });

const CalendarPage: React.FC = () => {
  const today = new Date();
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [selected, setSelected] = useState<number>(today.getDate());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);

  const weekDays = useMemo(() => {
    const current = new Date(today);
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1) + weekOffset * 7;
    const startOfWeek = new Date(current.setDate(diff));
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return {
        name: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.getDate(),
        full: d.toISOString().split("T")[0],
      };
    });
  }, [weekOffset, today]);

  const selectedDateObj = weekDays.find((d) => d.date === selected);
  const selectedDate = selectedDateObj
    ? selectedDateObj.full
    : today.toISOString().split("T")[0];

  const fetchTasks = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      // Backend handles role filtering per user/admin in /calendar
      const res: AxiosResponse<{ tasks: Task[] }> = await axiosInstance.get(
        "/calendar",
        {
          params: { date: selectedDate },
        }
      );
      setTasks(res.data.tasks ?? []);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError("Error fetching calendar tasks: " + e.message);
      } else {
        setError("Error fetching calendar tasks: Unknown error");
      }
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate, user?.role]);

  // Socket setup for task updates
  useEffect(() => {
    if (!socket.connected) {
      socket.io.opts.extraHeaders = { Authorization: `Bearer ${localStorage.getItem("auth_token")}` };
      socket.connect();
    }

    socket.emit("registerUser", user?.id);

    socket.on("newTaskAssigned", () => {
      fetchTasks();
    });

    return () => {
      socket.off("newTaskAssigned");
      socket.disconnect();
    };
  }, [user?.id, selectedDate]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      setIsLoading(true);
      setError(null);
      const now = new Date();
      const currentTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      await axiosInstance.post("/tasks", {
        title: newTaskTitle.trim(),
        date: selectedDate,
        time: currentTime,
        description: "",
        avatar: [],
      });
      setNewTaskTitle("");
      await fetchTasks();
      window.dispatchEvent(new CustomEvent("tasksUpdated"));
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError("Error adding task: " + e.message);
      } else {
        setError("Error adding task: Unknown error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-texture bg-cover bg-fixed bg-center text-gray-800 px-4 py-4 sm:px-6 md:px-8 max-w-screen-md mx-auto transition-all duration-500">
      <div>
        <div className="flex items-center justify-between py-3 animate-fadeIn">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="text-lg rounded-full hover:bg-gray-100 px-2 transition-transform hover:scale-110"
            aria-label="Previous week"
          >
            ◀
          </button>
          <div className="flex flex-col items-center">
            <h2 className="font-semibold text-lg text-gray-700">
              {new Date(selectedDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </h2>
            <p className="text-xs text-gray-500">
              Role:{" "}
              <span className="font-semibold text-pink-600">
                {user?.role?.toUpperCase() ?? "USER"}
              </span>
            </p>
          </div>
          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="text-lg rounded-full hover:bg-gray-100 px-2 transition-transform hover:scale-110"
            aria-label="Next week"
          >
            ▶
          </button>
        </div>
        <div className="flex justify-between mb-4 gap-1 animate-slideIn overflow-x-auto">
          {weekDays.map((day) => (
            <button
              key={day.full}
              className={`flex flex-col items-center justify-center w-9 h-14 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-sm ${
                selected === day.date
                  ? "bg-pink-400 text-white shadow-md"
                  : "bg-white/70 backdrop-blur-sm text-gray-700"
              }`}
              onClick={() => setSelected(day.date)}
              aria-label={`Select day ${day.name}, date ${day.date}`}
            >
              <span className="text-xs">{day.name}</span>
              <span className="font-bold text-base">{day.date}</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="text-red-600 bg-red-100 p-2 rounded my-4 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <p className="text-gray-400 text-center py-8 animate-pulse">
              Loading tasks...
            </p>
          ) : tasks.length > 0 ? (
            tasks.map((task, idx) => {
              const cardColor = pastelColors[idx % pastelColors.length];
              return (
                <div
                  key={task._id ?? `${task.title}-${task.date}`}
                  className={`flex flex-col ${cardColor} border-l-8 rounded-xl px-4 py-4 shadow-sm hover:shadow-lg transition-all duration-300`}
                >
                  <p className="font-medium text-gray-800">{task.title}</p>
                  <p className="text-xs mt-2 mb-1 text-gray-500">{task.time}</p>
                  {user?.role === "admin" && task.assignedTo && (
                    <p className="text-xs text-gray-600">
                      Assigned to:{" "}
                      <span className="font-medium text-pink-600">
                        {task.assignedTo.username || "Unknown"}
                      </span>
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-center py-8 animate-fadeIn">
              No tasks for this day
            </p>
          )}
        </div>
        <div className="mt-6 flex items-center bg-white/80 backdrop-blur-sm border rounded-lg p-2 shadow-sm hover:shadow-md transition-all animate-fadeIn">
          <input
            className="flex-1 bg-transparent outline-none px-2"
            placeholder="Add new task"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTask();
              }
            }}
            aria-label="New task title"
          />
          <button
            className="bg-pink-400 hover:bg-pink-500 transition-all duration-300 w-8 h-8 ml-2 flex items-center justify-center rounded-full shadow hover:scale-110"
            onClick={handleAddTask}
            aria-label="Add task"
          >
            <span className="text-white text-lg">+</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;

