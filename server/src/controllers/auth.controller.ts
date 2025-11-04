import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { Request, Response } from "express";

const createAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "secretkey", {
    expiresIn: "1d",
  });
};

// 🧾 SIGNUP — supports role assignment (auto admin for first user)
export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Automatically assign "admin" role if it's the first user
    const isFirstUser = (await User.countDocuments()) === 0;
    const assignedRole = isFirstUser ? "admin" : role?.toLowerCase() || "user";

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: assignedRole,
    });

    await newUser.save();

    const token = createAccessToken(newUser._id.toString());

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
      },
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 🔐 LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Please fill all fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = createAccessToken(user._id.toString());

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 👤 GET PROFILE
export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err: any) {
    console.error("GetProfile error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✏️ UPDATE PROFILE (username, avatar, role — restricted)
export const updateProfile = async (req: any, res: Response) => {
  try {
    const { username, avatar, role } = req.body;
    const user = await User.findById(req.user?.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    if (username) user.username = username;
    if (avatar) user.avatar = avatar;

    // 🔒 Only allow admins to change *others'* roles (not self-role)
    if (role && user.role === "admin") user.role = role.toLowerCase();

    await user.save();

    res.json({
      msg: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error("UpdateProfile error:", err);
    res.status(500).json({ msg: "Failed to update profile", error: err.message });
  }
};
