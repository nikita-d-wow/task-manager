import { Request, Response } from "express";
import { Task } from "../models/task.model";

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    // Fetch latest 20 tasks, sorted by creation date descending
    const tasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate([
        { path: "createdBy", select: "username avatar" },
        { path: "assignedTo", select: "username avatar" },
      ]);

    // Calculate completed tasks count
    const completedTasks = tasks.reduce(
      (count, task) => (task.completed && !task.deleted ? count + 1 : count),
      0
    );

    // Calculate deleted tasks count
    const deletedTasksCount = tasks.filter((task) => task.deleted).length;

    // Return tasks and summary counts
    res.json({
      tasks, // Tasks will contain the `deleted` flag
      tasksCount: tasks.length,
      completedTasks,
      deletedTasksCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};
