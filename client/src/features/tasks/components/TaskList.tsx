// // import React from "react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../app/store";
// import TaskItem from "./TaskItem";

// const TaskList: React.FC = () => {
//   const tasks = useSelector((state: RootState) => state.tasks.tasks);

//   if (tasks.length === 0) {
//     return <div className="text-gray-400 text-center mt-8">No tasks yet!</div>;
//   }

//   return (
//     <div className="flex flex-col gap-2">
//       {tasks.map((task) => (
//         <TaskItem key={task.id} task={task} />
//       ))}
//     </div>
//   );
// };

// export default TaskList;
