import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse, Credentials, User } from "../types/auth.types";
import { loginApi, signupApi, fetchProfileApi } from "../services/authApi";
import { isAxiosError } from "axios";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const savedUser = localStorage.getItem("user");

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: localStorage.getItem("auth_token"),
  loading: false,
  error: null,
};

// ✅ Define an expected shape for backend error responses
interface ApiError {
  message?: string;
  msg?: string;
}

// 🔹 Helper to extract readable error message safely
const getErrorMessage = (err: unknown): string => {
  if (isAxiosError<ApiError>(err)) {
    const data = err.response?.data;
    return data?.message || data?.msg || "An unexpected error occurred";
  }
  if (err instanceof Error) return err.message;
  return "An unknown error occurred";
};

// 🔹 LOGIN
export const loginUser = createAsyncThunk<AuthResponse, Credentials>(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await loginApi(credentials);
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// 🔹 SIGNUP
export const signupUser = createAsyncThunk<AuthResponse, User & { password: string }>(
  "auth/signupUser",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await signupApi(formData);
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// 🔹 FETCH PROFILE
export const fetchProfile = createAsyncThunk<User, void>(
  "auth/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;
      if (!token) throw new Error("No token found");
      const { data } = await fetchProfileApi(token);
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ NEW: Update user in Redux + localStorage (used when saving profile)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    logout(state) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Login failed";
      })
      // SIGNUP
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Signup failed";
      })
      // PROFILE
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch profile";
      });
  },
});

export const { logout, setUser } = authSlice.actions; // ✅ now includes setUser
export default authSlice.reducer;
