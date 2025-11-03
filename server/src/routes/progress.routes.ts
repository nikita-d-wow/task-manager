import express from "express";
import {
  getTaskProgress,
  updateTaskProgress,
  getOverallProgress,
  getUserProgress,
  getWeeklyProgress,
  getMonthlyProgress,
} from "../controllers/progress.controller";

const router = express.Router();

// 🧭 Base Routes
router.get("/", getTaskProgress);
router.get("/overall", getOverallProgress);
router.get("/user/:userId", getUserProgress);

// 🆕 Time-based Progress Routes
router.get("/weekly", getWeeklyProgress);
router.get("/monthly", getMonthlyProgress);
router.put("/:id", updateTaskProgress);

export default router;
