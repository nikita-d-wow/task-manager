import { Request, Response } from "express";
import UserModel from "../models/user.model"; // consistent import

// ✅ Get logged-in user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await UserModel.findById(userId).select("username email avatar role");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

// ✅ Update profile (username, email, avatar, role)
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { username, email, avatar, role } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { username, email, avatar, role },
      { new: true, runValidators: true }
    ).select("username email avatar role");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};
