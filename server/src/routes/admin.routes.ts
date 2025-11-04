import express from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { attachUser } from "../middleware/attachUser";
import { authorizeRole } from "../middleware/authorizeRole";
import User from "../models/user.model";
import Activity from "../models/activity.model";
import { Task } from "../models/task.model";
import { logActivity } from "../middleware/activityLogger";

const router = express.Router();

// Only admins can access routes below
router.use(authenticateToken, attachUser, authorizeRole("admin"));

router.get("/users", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const role = (req.query.role as string) || "all";

    const filter: any = {};
    if (role !== "all") filter.role = role;
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select("username email avatar role createdAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

router.get("/users/:id/activity", async (req, res) => {
  try {
    const { id } = req.params;
    const logs = await Activity.find({ user: id }).sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, logs });
  } catch (err) {
    console.error("Error fetching activity logs:", err);
    res.status(500).json({ success: false, message: "Failed to fetch activity" });
  }
});

router.patch("/users/:id/role", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.role = role.toLowerCase();
    await user.save();

    await logActivity(req.user!.id, `Changed role of ${user.username} to ${role}`, { newRole: role }, req.ip);

    res.json({
      success: true,
      message: `User ${user.username}'s role updated to ${role}`,
      user,
    });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ success: false, message: "Failed to update role" });
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const status = req.query.status as string;
    const limit = parseInt(req.query.limit as string) || 100;

    const filter: any = {};
    if (status) filter.status = status;

    const tasks = await Task.find(filter)
      .populate("createdBy", "username email")
      .populate("assignedTo", "username email")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ success: false, message: "Failed to fetch tasks" });
  }
});

// === ADD MISSING CREATE TASK ROUTE ===
router.post("/tasks", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const newTask = new Task({
      ...req.body,
      category: req.body.category || "General",
      createdBy: userId,
    });

    const saved = await newTask.save();
    const populated = await saved.populate([
      { path: "assignedTo", select: "username avatar email" },
      { path: "createdBy", select: "username avatar email" },
    ]);

    // Log the admin task assignment action
    await logActivity(
      userId,
      `Assigned new task '${newTask.title}' to user ${req.body.assignedTo}`,
      { taskId: saved.id.toString(), assignedTo: req.body.assignedTo },
      req.ip
    );

    res.status(201).json({ success: true, task: populated });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ success: false, message: "Failed to create task" });
  }
});
export default router;
