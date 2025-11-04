import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

import DashboardPage from "../pages/DashboardPage";
import TasksPage from "../features/tasks/pages/TasksPage";
import ProfilePage from "../pages/ProfilePage";
import LoginPage from "../pages/LoginPage";
import ProgressPage from "../pages/ProgressPage";
import CalendarPage from "../pages/CalendarPage";
import SignupPage from "../pages/SignupPage";
import GoogleSuccess from "../pages/GoogleSuccess";
import HomePage from "../pages/HomePage";
import AdminDashboard from "../pages/AdminDashboard";

const AppRoutes = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = Boolean(user);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/google-success" element={<GoogleSuccess />} />

      {/* Redirect root / to login or home based on auth */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
      />

      {/* Authenticated routes */}
      {isAuthenticated && (
        <>
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/progress" element={<ProgressPage />} />

          {/* Admin only route */}
          {user?.role?.toLowerCase() === "admin" && (
            <Route path="/admin" element={<AdminDashboard />} />
          )}
        </>
      )}

      {/* Fallback - redirect all unknown paths */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
    </Routes>
  );
};

export default AppRoutes;
