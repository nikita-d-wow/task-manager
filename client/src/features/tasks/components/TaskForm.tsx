// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import type  { Task } from "../redux/taskSlice";
// import type { AppDispatch } from "../../../app/store";
// import { addTask } from "../redux/taskSlice";


// const TaskForm: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [title, setTitle] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title.trim()) return;

//     const newTask: Task = {
//       id: Date.now(),
//       title: title.trim(),
//       description: "No description",
//       project: "General",
//       progress: 0,
//       completed: false,
//     };

//     dispatch(addTask(newTask));
//     setTitle("");
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
//       <input
//         type="text"
//         placeholder="Add a new task"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="border rounded px-3 py-2 flex-1 outline-none"
//       />
//       <button
//         type="submit"
//         className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
//       >
//         Add
//       </button>
//     </form>
//   );
// };

// export default TaskForm;
