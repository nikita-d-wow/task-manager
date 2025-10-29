import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // load .env first!

import express from "express";
import cors from "cors";
import connectDB from "./config/db";

import taskRoutes from "./routes/task.routes";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import calendarRoutes from "./routes/calendar.routes";
import progressRoutes from "./routes/progress.routes";
import userRoutes from "./routes/user.routes"
const app = express();

app.use(cors());
app.use(express.json());

connectDB(); // connect after env is loaded

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/tasks", taskRoutes);
app.use("/dashboard",dashboardRoutes);
app.use("/calendar", calendarRoutes);
app.use( progressRoutes);
app.use("/users", userRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

export default app;
