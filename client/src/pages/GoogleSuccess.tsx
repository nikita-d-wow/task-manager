import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { fetchProfile } from "../features/auth/slice/authSlice";

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token"); // ✅ matches backend redirect param

    if (token) {
      // Save token to localStorage
      localStorage.setItem("auth_token", token);

      // Fetch the user profile via Redux
      dispatch(fetchProfile())
        .unwrap()
        .then(() => {
          navigate("/profile"); // ✅ redirect once profile is loaded
        })
        .catch(() => {
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-xl font-semibold text-gray-700">
        Signing you in with Google...
      </h2>
    </div>
  );
};

export default GoogleSuccess;
