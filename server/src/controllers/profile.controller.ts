import { Request, Response } from "express";
import User from "../models/user.model"; // ✅ your Mongoose model

// ✅ Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id; // from JWT middleware
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("username email avatar role"); // ✅ FIXED comma issue

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

// ✅ Update user profile (username, email, avatar, role)
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { username, email, avatar, role } = req.body; // ✅ include role

    console.log("🟢 Received update payload:", req.body); // for debugging

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, avatar, role }, // ✅ include role
      { new: true, runValidators: true }
    ).select("username email avatar role"); // ✅ include role here too

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};
