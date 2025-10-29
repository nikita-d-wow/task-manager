import { Request, Response } from "express";
import UserModel from "../models/user.model";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find().sort({ username: 1 });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};
