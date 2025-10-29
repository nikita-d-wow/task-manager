import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import TasksPage from "../features/tasks/pages/TasksPage";
import ProfilePage from "../pages/ProfilePage";
import LoginPage from "../pages/LoginPage";
import ProgressPage from "../pages/ProgressPage";
import CalendarPage from "../pages/CalendarPage";
import SignupPage from "../pages/SignupPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<DashboardPage />} />
    <Route path="/tasks" element={<TasksPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/calendar" element={<CalendarPage />} />
    <Route path="/progress" element={<ProgressPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="*" element={<Navigate to="/" />} />
    <Route path="/signup" element={<SignupPage />} />
  </Routes>
);

export default AppRoutes;
