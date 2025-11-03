import express, { RequestHandler } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { getCalendarTasks } from "../controllers/calendar.controller";

const router = express.Router();

// ✅ Protect the route with auth middleware (type-safe)
router.get(
    "/", 
    authenticateToken as RequestHandler, 
    getCalendarTasks as unknown as RequestHandler
);

export default router;
