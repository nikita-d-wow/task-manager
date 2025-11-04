import { RequestHandler } from "express";
import { Task } from "../models/task.model";

export const getCalendarTasks: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { date } = req.query;
    const query: any = {};

    if (role === "admin") {
      if (date) {
        const start = new Date(date as string);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date as string);
        end.setHours(23, 59, 59, 999);
        query.date = { $gte: start, $lte: end };
      }
    } else {
      query.$or = [{ createdBy: userId }, { assignedTo: userId }];
      if (date) {
        const start = new Date(date as string);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date as string);
        end.setHours(23, 59, 59, 999);
        query.date = { $gte: start, $lte: end };
      }
    }

    const tasks = await Task.find(query)
      .populate("createdBy", "username avatar role")
      .populate("assignedTo", "username avatar role")
      .sort({ date: 1, createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    console.error("Error fetching calendar tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks for calendar" });
  }
};
