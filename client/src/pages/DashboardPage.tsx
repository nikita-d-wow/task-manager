// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import axiosInstance from "../lib/axiosInstance";
// import type { RootState } from "../app/store";
// import type { Task } from "../features/tasks/types/task.types";

// const DashboardPage: React.FC = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);

//   const user = useSelector((state: RootState) => state.auth.user);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         // Fetch dashboard summary data
//         const res = await axiosInstance.get<{ tasks: Task[]; tasksCount?: number; completedTasks?: number }>("/dashboard");

//         // Prioritize tasks array from dashboard response
//         if (res.data && Array.isArray(res.data.tasks)) {
//           setTasks(res.data.tasks);
//         } else {
//           // Fallback: fetch all tasks
//           const taskRes = await axiosInstance.get<Task[]>("/tasks");
//           if (Array.isArray(taskRes.data)) {
//             setTasks(taskRes.data);
//           } else {
//             setTasks([]);
//             console.warn("Expected tasks array but received:", taskRes.data);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching dashboard data:", err);
//         setTasks([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDashboardData();
//   }, []);

//   if (loading) return <p className="text-gray-500 p-6">Loading dashboard...</p>;

//   const totalTasks = tasks.length;
//   const completedTasks = tasks.filter((t) => t.completed).length;
//   const inProgressTasks = totalTasks - completedTasks;

//   // Sort by createdAt descending and pick 4 recent
//   const recentTasks = [...tasks]
//     .sort((a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime())
//     .slice(0, 4);

//   const StatCard = ({
//     title,
//     count,
//     color,
//     bgColor,
//   }: {
//     title: string;
//     count: number;
//     color: string;
//     bgColor: string;
//   }) => (
//     <div className={`${bgColor} rounded-xl px-4 py-6 shadow-sm`}>
//       <div className="flex items-center justify-between">
//         <div>
//           <h3 className={`text-sm font-medium ${color}`}>{title}</h3>
//           <p className="text-2xl font-bold text-gray-800 mt-1">{count}</p>
//           <p className="text-xs text-gray-500 mt-1">{count} Tasks</p>
//         </div>
//         <div
//           className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-black text-sm font-bold`}
//         >
//           {count}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 py-6">
//       <div className="mb-8">
//         <h1 className="text-xl sm:text-2xl font-bold mb-2">
//           Hi, {user?.username || "Adventurer"}
//         </h1>
//         <p className="text-gray-500">Your daily adventure starts now</p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
//         <StatCard
//           title="On going"
//           count={inProgressTasks}
//           color="text-blue-600"
//           bgColor="bg-blue-50"
//         />
//         <StatCard
//           title="Completed"
//           count={completedTasks}
//           color="text-green-600"
//           bgColor="bg-green-50"
//         />
//         <StatCard
//           title="Canceled"
//           count={0}
//           color="text-red-600"
//           bgColor="bg-red-50"
//         />
//       </div>

//       <div className="bg-white rounded-xl shadow-sm px-4 py-6">
//         <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Recent Tasks</h2>
//         <div className="space-y-4">
//           {recentTasks.length > 0 ? (
//             recentTasks.map((task) => (
//               <div
//                 key={task._id}
//                 className="bg-gray-50 rounded-lg border p-3 sm:p-4 hover:shadow-md transition-shadow"
//               >
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2 sm:gap-0">
//                   <div>
//                     <h4 className="font-medium text-gray-800">{task.title}</h4>
//                     <p className="text-sm text-gray-500">{task.project || "General"}</p>
//                   </div>
//                   <span
//                     className={`text-sm font-semibold ${
//                       task.completed ? "text-green-600" : "text-yellow-600"
//                     }`}
//                   >
//                     {task.completed ? "Completed" : "Pending"}
//                   </span>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No recent tasks found.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;


import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../lib/axiosInstance";
import type { RootState } from "../app/store";
import type { Task } from "../features/tasks/types/task.types";

const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch dashboard data including tasks array
        const res = await axiosInstance.get<{
          tasks?: Task[];
          tasksCount?: number;
          completedTasks?: number;
        }>("/dashboard");

        if (res.data?.tasks && Array.isArray(res.data.tasks)) {
          setTasks(res.data.tasks);
        } else {
          // fallback: fetch all tasks
          const taskRes = await axiosInstance.get<Task[]>("/tasks");
          if (Array.isArray(taskRes.data)) {
            setTasks(taskRes.data);
          } else {
            setTasks([]);
            console.warn("Expected tasks array but got:", taskRes.data);
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <p className="text-gray-500 p-6">Loading dashboard...</p>;
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const inProgressTasks = totalTasks - completedTasks;

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime())
    .slice(0, 4);

  const StatCard = ({
    title,
    count,
    color,
    bgColor,
  }: {
    title: string;
    count: number;
    color: string;
    bgColor: string;
  }) => (
    <div className={`${bgColor} rounded-xl px-4 py-6 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-sm font-medium ${color}`}>{title}</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{count}</p>
          <p className="text-xs text-gray-500 mt-1">{count} Tasks</p>
        </div>
        <div
          className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-black text-sm font-bold`}
        >
          {count}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 py-6">
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">
          Hi, {user?.username || "Adventurer"}
        </h1>
        <p className="text-gray-500">Your daily adventure starts now</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="On going"
          count={inProgressTasks}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Completed"
          count={completedTasks}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          title="Canceled"
          count={0}
          color="text-red-600"
          bgColor="bg-red-50"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm px-4 py-6">
        <h2 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">Recent Tasks</h2>
        <div className="space-y-4">
          {recentTasks.length > 0 ? (
            recentTasks.map((task) => (
              <div
                key={task._id}
                className="bg-gray-50 rounded-lg border p-3 sm:p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2 sm:gap-0">
                  <div>
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    <p className="text-sm text-gray-500">{task.project || "General"}</p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      task.completed ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No recent tasks found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
