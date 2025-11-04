import { Request, Response } from "express";
import User, { User as IUser } from "../models/user.model"; // import your User interface type here

// Get user profile handler
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("username email avatar role");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

// Update user profile handler allowing partial update
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { username, avatar, role } = req.body;

    // Use Partial<IUser> for type-safe partial updates
    const updateData: Partial<IUser> = {};
    if (username !== undefined) updateData.username = username.trim();
    if (avatar !== undefined) updateData.avatar = avatar;
    if (role !== undefined) updateData.role = role;

    console.log("🟢 Received update payload:", updateData);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("username email avatar role");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};
