import { Request, Response } from "express";
import { Task } from "../models/task.model";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // 👈 added by auth middleware
    const { date } = req.query;

    const query: any = {
      $or: [{ createdBy: userId }, { assignedTo: userId }],
    };

    if (date) {
      const start = new Date(date as string);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "username avatar")
      .populate("createdBy", "username avatar")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching tasks" });
  }
};

export const addTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const newTask = new Task({
      ...req.body,
      createdBy: userId,
    });

    const saved = await newTask.save();
    const populated = await saved.populate([
      { path: "assignedTo", select: "username avatar" },
      { path: "createdBy", select: "username avatar" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error adding task" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error updating task" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error deleting task" });
  }
};
