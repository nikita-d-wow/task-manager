// import { Request, Response } from "express";

// export const getDashboardData = async (req: Request, res: Response) => {
//   // TODO: aggregate dashboard data from db
//   res.json({ tasksCount: 10, completedTasks: 7 });
// };


import { Request, Response } from "express";
import { Task } from "../models/task.model";

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    // Fetch all tasks, you can modify to filter by user if needed
    const tasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(20); // limit for performance and UI

    const completedTasks = tasks.filter((task) => task.completed).length;

    // Send tasks array along with counts for frontend
    res.json({
      tasks,
      tasksCount: tasks.length,
      completedTasks,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};
