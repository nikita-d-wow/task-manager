// import express from "express";
// import {
//   getTaskProgress,
//   updateTaskProgress,
//   getOverallProgress,
//   getUserProgress,
// } from "../controllers/progress.controller";

// const router = express.Router();

// router.get("/", getTaskProgress); // Grouped progress by project
// router.put("/:id", updateTaskProgress); // Update task progress by ID
// router.get("/overall", getOverallProgress); // Overall progress stats
// router.get("/user/:userId", getUserProgress); // Progress for a specific user

// export default router;
// // routes/progress.routes.ts
// // import express from "express";
// // import { getWeeklyAndMonthlyProgress } from "../controllers/progress.controller";

// // const router = express.Router();

// // router.get("/stats", getWeeklyAndMonthlyProgress); // ✅ new endpoint for weekly & monthly data

// // export default router;


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
