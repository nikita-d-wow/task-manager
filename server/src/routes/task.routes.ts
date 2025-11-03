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
router.get("/", authenticateToken as RequestHandler, getTasks);
router.post("/", authenticateToken as RequestHandler, addTask);
router.put("/:id", authenticateToken as RequestHandler, updateTask);
router.delete("/:id", authenticateToken as RequestHandler, deleteTask);

export default router;

