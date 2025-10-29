import express from "express";
// import { authenticateToken } from "../middleware/authMiddleware";
import { getCalendarTasks } from "../controllers/calendar.controller";

const router = express.Router();

router.get("/", getCalendarTasks);

export default router;
