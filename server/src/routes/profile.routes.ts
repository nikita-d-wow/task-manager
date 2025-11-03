import express, { RequestHandler } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ Apply RequestHandler type casting to avoid TS overload issues
router.get("/", authenticateToken as RequestHandler, getProfile as unknown as RequestHandler);
router.put("/", authenticateToken as RequestHandler, updateProfile as unknown as RequestHandler);

export default router;
