import { Request, Response } from "express";
import { Task } from "../models/task.model";

// 📊 Existing Controllers
export const getTaskProgress = async (req: Request, res: Response) => {
  try {
    const progressData = await Task.aggregate([
      {
        $group: {
          _id: "$project",
          totalTasks: { $sum: 1 },
          completedTasks: { $sum: { $cond: ["$completed", 1, 0] } },
        },
      },
    ]);
    res.json(progressData);
  } catch (error) {
    console.error("Error fetching progress data:", error);
    res.status(500).json({ message: "Server error fetching progress data" });
  }
};

// ✅ Update progress of a specific task
export const updateTaskProgress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { progress },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task progress:", error);
    res.status(500).json({ message: "Server error updating task progress" });
  }
};


// ✅ New: Weekly Progress (last 7 days)
export const getWeeklyProgress = async (req: Request, res: Response) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyData = await Task.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          totalTasks: { $sum: 1 },
          completedTasks: { $sum: { $cond: ["$completed", 1, 0] } },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Convert day numbers to readable labels (Sun–Sat)
    const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const formatted = weeklyData.map((item) => ({
      day: dayLabels[item._id - 1],
      totalTasks: item.totalTasks,
      completedTasks: item.completedTasks,
      inProgress: item.totalTasks - item.completedTasks,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching weekly progress:", error);
    res.status(500).json({ message: "Server error fetching weekly progress" });
  }
};

// ✅ New: Monthly Progress (last 6 months)
export const getMonthlyProgress = async (req: Request, res: Response) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Task.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalTasks: { $sum: 1 },
          completedTasks: { $sum: { $cond: ["$completed", 1, 0] } },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatted = monthlyData.map((item) => ({
      month: monthLabels[item._id - 1],
      totalTasks: item.totalTasks,
      completedTasks: item.completedTasks,
      inProgress: item.totalTasks - item.completedTasks,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching monthly progress:", error);
    res.status(500).json({ message: "Server error fetching monthly progress" });
  }
};

// ✅ Overall Progress (unchanged)
export const getOverallProgress = async (req: Request, res: Response) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ completed: true });
    const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    res.json({ totalTasks, completedTasks, overallProgress });
  } catch (error) {
    console.error("Error fetching overall progress:", error);
    res.status(500).json({ message: "Server error fetching overall progress" });
  }
};

// ✅ User Progress (unchanged)
export const getUserProgress = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const totalTasks = await Task.countDocuments({ "assignee._id": userId });
    const completedTasks = await Task.countDocuments({ "assignee._id": userId, completed: true });
    const userProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    res.json({ totalTasks, completedTasks, userProgress });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({ message: "Server error fetching user progress" });
  }
};
