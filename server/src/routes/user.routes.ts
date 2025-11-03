import express, { RequestHandler, Response } from "express";
import { authenticateToken, AuthenticatedRequest } from "../middleware/authMiddleware";
import User from "../models/user.model";

const router = express.Router();

// 👤 Fetch logged-in user's profile
const getProfile: RequestHandler = async (req, res) => {
  const typedReq = req as AuthenticatedRequest;

  try {
    const user = await User.findById(typedReq.user?.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Cast auth middleware to RequestHandler to satisfy Express types
router.get("/profile", authenticateToken as RequestHandler, getProfile);

// 👥 Fetch all users
router.get("/", async (_req, res: Response) => {
  try {
    const users = await User.find().select("username email _id");
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

export default router;
