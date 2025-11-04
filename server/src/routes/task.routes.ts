import express, { RequestHandler } from "express";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ Type-safe routes
router.get("/", authenticateToken, getTasks);
router.post("/", authenticateToken, addTask);
router.put("/:id", authenticateToken, updateTask);
router.delete("/:id", authenticateToken, deleteTask);

export default router;
