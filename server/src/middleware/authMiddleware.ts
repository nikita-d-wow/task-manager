import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; username?: string };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const secret = process.env.JWT_SECRET || "secretkey";

  jwt.verify(token, secret, (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    if (typeof decoded === "object" && decoded !== null) {
      req.user = {
        id: (decoded as { id: string }).id,
        username: (decoded as { username?: string }).username,
      };
      next();
    } else {
      return res.status(403).json({ message: "Invalid token payload" });
    }
  });
};
