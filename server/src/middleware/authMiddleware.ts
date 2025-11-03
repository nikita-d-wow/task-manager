import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

export interface JwtUserPayload {
  id: string;
  username?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const secret = process.env.JWT_SECRET || "secretkey";

  jwt.verify(token, secret, (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }

    if (typeof decoded === "object" && decoded !== null) {
      req.user = {
        id: (decoded as JwtUserPayload).id,
        username: (decoded as JwtUserPayload).username,
      };
      next();
    } else {
      res.status(403).json({ message: "Invalid token payload" });
    }
  });
};
