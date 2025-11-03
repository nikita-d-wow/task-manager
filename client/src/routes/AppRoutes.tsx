import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import TasksPage from "../features/tasks/pages/TasksPage";
import ProfilePage from "../pages/ProfilePage";
import LoginPage from "../pages/LoginPage";
import ProgressPage from "../pages/ProgressPage";
import CalendarPage from "../pages/CalendarPage";
import SignupPage from "../pages/SignupPage";
import GoogleSuccess from "../pages/GoogleSuccess";
import HomePage from "../pages/HomePage";

const AppRoutes = () => (
  <Routes>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/tasks" element={<TasksPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/calendar" element={<CalendarPage />} />
    <Route path="/progress" element={<ProgressPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="*" element={<Navigate to="/signup" replace />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/google-success" element={<GoogleSuccess />} />
    <Route path ="/home" element={<HomePage /> } />
  </Routes>
);

export default AppRoutes;
