import { RequestHandler } from "express";
import UserModel from "../models/user.model";

export const attachUser: RequestHandler = async (req: any, res, next) => {
  try {
    const id = req.user?.id;
    if (!id) return next();
    const user = await UserModel.findById(id).select("username email avatar role");
    if (user) {
      req.user = {
        id: user.id.toString(),
        username: user.username,
        role: user.role,
        email: user.email,
        avatar: user.avatar,
      };
    }
    next();
  } catch (err) {
    console.error("attachUser error", err);
    next();
  }
};
