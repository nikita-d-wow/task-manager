import { Request, Response } from "express";
import  IUser  from "../models/user.model"; // ✅ import your Mongoose user model

// ✅ Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id; // from JWT middleware

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await IUser.findById(userId).select("username email avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

// ✅ Update user profile (username, email, avatar, etc.)
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { username, email, avatar } = req.body;

    const updatedUser = await IUser.findByIdAndUpdate(
      userId,
      { username, email, avatar },
      { new: true, runValidators: true }
    ).select("username email avatar");

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};
