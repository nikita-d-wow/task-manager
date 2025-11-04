import express, { RequestHandler, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { getProfile, updateProfile } from "../controllers/profile.controller";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// Validation middleware for profile update with role as free text designation
const validateProfileUpdate = [
  body("username")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Username must be a non-empty string"),
  body("avatar")
    .optional()
    .isString()
    .withMessage("Avatar must be a string"),
  body("role")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Role/designation must be at most 50 characters"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// GET /profile protected route
router.get(
  "/",
  authenticateToken as RequestHandler,
  getProfile as unknown as RequestHandler
);

// PUT /profile protected and validated route
router.put(
  "/",
  authenticateToken as RequestHandler,
  validateProfileUpdate,
  updateProfile as unknown as RequestHandler
);

export default router;


