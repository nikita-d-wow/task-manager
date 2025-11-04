import { RequestHandler } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

export interface JwtUserPayload {
  id: string;
  username?: string;
  role?: string;
}

// ✅ Extend Express Request globally
declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

export const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const secret = process.env.JWT_SECRET || "secretkey";

  jwt.verify(token, secret, (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    if (typeof decoded === "object" && decoded !== null) {
      req.user = {
        id: (decoded as JwtUserPayload).id,
        username: (decoded as JwtUserPayload).username,
        role: (decoded as JwtUserPayload).role,
      };
      return next();
    }

    res.status(403).json({ message: "Invalid token payload" });
  });
};
