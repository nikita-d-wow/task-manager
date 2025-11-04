import { Request, Response, RequestHandler } from "express";
import User from "../models/user.model";
import { Task } from "../models/task.model";

export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching users" });
  }
};

export const getAllTasks: RequestHandler = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "username avatar role")
      .populate("createdBy", "username avatar role")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching tasks" });
  }
};

export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error deleting user" });
  }
};
