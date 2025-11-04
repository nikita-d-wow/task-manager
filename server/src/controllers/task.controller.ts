import { RequestHandler } from "express";
import { Task } from "../models/task.model";
// Import or pass your io instance from the server setup
import { io } from "../server"; // Adjust path

// Get tasks — Admin sees all, user sees only own
export const getTasks: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    const { date } = req.query;

    const query: any = {};
    if (role !== "admin") {
      query.$or = [{ createdBy: userId }, { assignedTo: userId }];
    }

    if (date) {
      const start = new Date(date as string);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "username avatar role")
      .populate("createdBy", "username avatar role")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
};

// Add task
export const addTask: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;

    // Normalize date to midnight UTC or local time as per your usage
    let date = new Date(req.body.date);
    date.setHours(0, 0, 0, 0); // Important: zero the time parts

    const newTask = new Task({
      ...req.body,
      date, // normalized date
      category: req.body.category || "General",
      createdBy: userId,
    });

    const saved = await newTask.save();
    const populated = await saved.populate([
      { path: "assignedTo", select: "username avatar" },
      { path: "createdBy", select: "username avatar" },
    ]);

    io.emit("newTaskAssigned", { task: populated });
    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error adding task" });
  }
};

// Update task (only admin or creator)
export const updateTask: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;
    const updates = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (role !== "admin" && task.createdBy?.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this task" });
    }

    const updated = await Task.findByIdAndUpdate(id, updates, { new: true })
      .populate("assignedTo", "username avatar")
      .populate("createdBy", "username avatar");

    // Emit update event
    io.emit("taskUpdated", { task: updated });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating task" });
  }
};

// Delete task (only admin or creator)
export const deleteTask: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (role !== "admin" && task.createdBy?.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this task" });
    }

    await task.deleteOne();

    // Emit delete event
    io.emit("taskDeleted", { taskId: id });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error deleting task" });
  }
};
