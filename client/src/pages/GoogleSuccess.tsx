import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { fetchProfile } from "../features/auth/slice/authSlice";

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleOAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = localStorage.getItem("auth_token") || urlParams.get("token");

      if (token) {
        localStorage.setItem("auth_token", token);
        try {
          await dispatch(fetchProfile()).unwrap();
          navigate("/profile");
        } catch {
          // handle fetch profile error
          navigate("/login");
        }
      } else {
        // No token found, redirect to login
        navigate("/login");
      }
    };

    handleOAuth();
  }, [dispatch, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-xl font-semibold text-gray-700">Signing you in with Google...</h2>
    </div>
  );
};

export default GoogleSuccess;
