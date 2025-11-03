import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware"; // 👈 must exist

const createAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "secretkey", {
    expiresIn: "1d",
  });
};

// 🧾 Signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = createAccessToken(newUser.id.toString());

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
    res.status(500).json({ msg: "Server error", err: err.message });
  }
};

// 🔐 Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({
        msg: "This account uses Google Sign-In. Please log in with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = createAccessToken(user.id.toString());

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error", err: err.message });
  }
};

// 👤 Get Profile
export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err: any) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ msg: "Server error", err: err.message });
  }
};

// ✏️ Update Profile (username, avatar, role)
export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, avatar, role } = req.body;
    const user = await User.findById(req.user?.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    if (username) user.username = username;
    if (avatar) user.avatar = avatar;
    if (role) user.role = role; // ✅ allow updating role

    await user.save();

    res.status(200).json({
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
    console.error("Profile update error:", err);
    res.status(500).json({ msg: "Failed to update profile", err: err.message });
  }
};
