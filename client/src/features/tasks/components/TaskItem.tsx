// import React from "react";
// import type { Task } from "../redux/taskSlice";
// import { useDispatch } from "react-redux";
// import type { AppDispatch } from "../../../app/store";
// // import { toggleTask } from "../redux/taskSlice";
// interface Props {
//   task: Task;
// }

// const TaskItem: React.FC<Props> = ({ task }) => {
//   const dispatch = useDispatch<AppDispatch>();

//   const handleToggle = () => {
//     dispatch(toggleTask(task._id));
//   };

//   return (
//     <div className="flex items-center gap-2 bg-white shadow-sm rounded-lg px-4 py-3 hover:shadow-md transition">
//       <input
//         type="checkbox"
//         checked={task.completed}
//         onChange={handleToggle}
//         className="accent-blue-500 w-4 h-4"
//       />
//       <span
//         className={`flex-1 ${task.completed ? "line-through text-gray-400" : ""}`}
//       >
//         {task.title}
//       </span>
//     </div>
//   );
// };

// export default TaskItem;
