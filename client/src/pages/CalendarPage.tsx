import React, { useState, useEffect, useMemo } from "react";
import type { AxiosResponse } from "axios";
import axiosInstance from "../lib/axiosInstance";
import type { Task } from "../features/tasks/types/task.types";

const pastelColors = [
  "border-pink-200 bg-pink-50",
  "border-blue-200 bg-blue-50",
  "border-green-200 bg-green-50",
  "border-yellow-200 bg-yellow-50",
];

const CalendarPage: React.FC = () => {
  const today = new Date();
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [selected, setSelected] = useState<number>(today.getDate());
  const [tasks, setTasks] = useState<Task[]>([]);

  const weekDays = useMemo(() => {
    const current = new Date(today);
    const day = current.getDay();
    const diff = current.getDate() - day + 1 + weekOffset * 7;
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
  }, [weekOffset]);

  const selectedDateObj = weekDays.find((d) => d.date === selected);
  const selectedDate = selectedDateObj
    ? selectedDateObj.full
    : today.toISOString().split("T")[0];

  // const fetchTasks = async (): Promise<void> => {
  //   try {
  //     const res: AxiosResponse<Task[]> = await axiosInstance.get("/tasks", {
  //       params: { date: selectedDate },
  //     });
  //     setTasks(res.data || []);
  //   } catch (error) {
  //     // Log error and clear tasks on failure
  //     console.error("Error fetching tasks:", error);
  //     setTasks([]);
  //   }
  // };

//   const fetchTasks = async (): Promise<void> => {
//   try {
//     const res: AxiosResponse<Task[]> = await axiosInstance.get("/calendar", {
//       params: { date: selectedDate },
//     });
//     // If response is an array directly
//     if (Array.isArray(res.data)) {
//       setTasks(res.data);
//     } else if (Array.isArray(res.data.tasks)) {
//       setTasks(res.data.tasks);
//     } else {
//       setTasks([]);
//     }
//   } catch (error) {
//     console.error("Error fetching calendar tasks:", error);
//     setTasks([]);
//   }
// };

const fetchTasks = async (): Promise<void> => {
  try {
    const res: AxiosResponse<{ tasks: Task[] }> = await axiosInstance.get("/calendar", {
      params: { date: selectedDate },
    });
    setTasks(res.data.tasks || []);
  } catch (error) {
    console.error("Error fetching calendar tasks:", error);
    setTasks([]);
  }
};

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  useEffect(() => {
    const handleTaskUpdate = () => fetchTasks();
    window.addEventListener("tasksUpdated", handleTaskUpdate);
    return () => window.removeEventListener("tasksUpdated", handleTaskUpdate);
  }, []);

  const handleAddTask = async (title: string): Promise<void> => {
    try {
      const now = new Date();
      const currentTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      await axiosInstance.post("/tasks", {
        title,
        date: selectedDate,
        time: currentTime,
        description: "",
        avatar: [],
      });
      await fetchTasks();
      window.dispatchEvent(new CustomEvent("tasksUpdated"));
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-2 pb-24 px-2 min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between py-3">
        <button
          onClick={() => setWeekOffset((prev) => prev - 1)}
          className="text-lg rounded-full hover:bg-gray-100 px-2"
        >
          ◀
        </button>
        <h2 className="font-semibold text-lg">
          {new Date(selectedDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={() => setWeekOffset((prev) => prev + 1)}
          className="text-lg rounded-full hover:bg-gray-100 px-2"
        >
          ▶
        </button>
      </div>

      {/* Week View */}
      <div className="flex justify-between mb-4 gap-1">
        {weekDays.map((day) => (
          <button
            key={day.full}
            className={`flex flex-col items-center justify-center w-9 h-14 rounded-lg transition-all ${
              selected === day.date
                ? "bg-red-400 text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setSelected(day.date)}
          >
            <span className="text-xs">{day.name}</span>
            <span className="font-bold text-base">{day.date}</span>
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task, idx) => {
            const cardColor = pastelColors[idx % pastelColors.length];
            return (
              <div
                key={task._id || `${task.title}-${task.date}`}
                className={`flex flex-col bg-white ${cardColor} border-l-8 rounded-xl px-4 py-4 shadow relative transition-all`}
              >
                <p className="font-medium text-gray-800">{task.title}</p>
                <p className="text-xs mt-2 mb-1 text-gray-500">{task.time}</p>
                {task.description && (
                  <div className="mb-2 bg-gray-100 rounded p-1 text-xs text-gray-600">
                    {task.description}
                  </div>
                )}
                {task.avatar && (
                  <div className="flex -space-x-2 mt-2">
                    {task.avatar.map((img, ai) => (
                      <img
                        key={`${task._id || task.title}-avatar-${ai}`}
                        src={img}
                        alt=""
                        className="w-7 h-7 rounded-full border-2 border-white shadow"
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-center py-8">No tasks for this day</p>
        )}
      </div>

      {/* Add New Task */}
      <div className="mt-6 flex items-center bg-white border rounded-lg p-2 shadow">
        <input
          className="flex-1 bg-transparent outline-none px-2"
          placeholder="Add new task"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              handleAddTask(e.currentTarget.value.trim());
              e.currentTarget.value = "";
            }
          }}
        />
        <button
          className="bg-black w-8 h-8 ml-2 flex items-center justify-center rounded-full"
          onClick={() => {
            const input = document.querySelector<HTMLInputElement>(".mt-6 input");
            if (input?.value.trim()) {
              handleAddTask(input.value.trim());
              input.value = "";
            }
          }}
        >
          <span className="text-white text-lg">+</span>
        </button>
      </div>
    </div>
  );
};

export default CalendarPage;
