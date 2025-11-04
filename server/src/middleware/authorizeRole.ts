import { RequestHandler } from "express";

/**
 * Restricts access based on allowed roles
 */
export const authorizeRole = (allowed: string | string[]): RequestHandler => {
  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];

  return (req, res, next) => {
    const user = req.user;

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const role = user.role ?? "user";

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Forbidden: insufficient privileges" });
    }

    next();
  };
};
