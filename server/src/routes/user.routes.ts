// import express, { Response } from "express";
// import { authenticateToken, AuthenticatedRequest } from "../middleware/authMiddleware";
// import User from "../models/user.model";

// const router = express.Router();

// // 👤 Fetch logged-in user's profile
// router.get("/profile", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
//   try {
//     const user = await User.findById(req.user?.id).select("-password"); // hide password
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (error) {
//     console.error("Error fetching profile:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;


import express, { Response } from "express";
import { authenticateToken, AuthenticatedRequest } from "../middleware/authMiddleware";
import User from "../models/user.model";

const router = express.Router();

// 👤 Fetch logged-in user's profile
router.get("/profile", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 👥 Fetch all users (for assigning tasks etc.)
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
