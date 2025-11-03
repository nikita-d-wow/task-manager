import { Response } from "express";
import { Task } from "../models/task.model";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

// ✅ Fetch tasks for the calendar for the logged-in user
export const getCalendarTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { date } = req.query;

    // ✅ Build query to filter by logged-in user
    const query: any = {
      $or: [{ createdBy: userId }, { assignedTo: userId }],
    };

    // ✅ Filter by specific date (if provided)
    if (date) {
      query.date = date;
    }

    // ✅ Fetch and sort
    const tasks = await Task.find(query)
      .populate("createdBy", "username avatar")
      .populate("assignedTo", "username avatar")
      .sort({ date: 1 });

    res.json({ tasks });
  } catch (error) {
    console.error("Error fetching calendar tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks for calendar" });
  }
};

