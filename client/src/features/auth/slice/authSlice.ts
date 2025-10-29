import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthResponse, Credentials, User } from "../types/auth.types";
import { loginApi, signupApi, fetchProfileApi } from "../services/authApi";
import { isAxiosError } from "axios";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("auth_token"),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<AuthResponse, Credentials>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await loginApi(credentials);
      localStorage.setItem("auth_token", data.token);
      return data;
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.message) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue("Login failed");
    }
  }
);

export const signupUser = createAsyncThunk<AuthResponse, User & { password: string }>(
  "auth/signup",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await signupApi(formData);
      localStorage.setItem("auth_token", data.token);
      return data;
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.message) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue("Signup failed");
    }
  }
);

export const fetchProfile = createAsyncThunk<User, void>(
  "auth/profile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;
      if (!token) throw new Error("No token found");
      const { data } = await fetchProfileApi(token);
      return data;
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.message) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue("Failed to fetch profile");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("auth_token");
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
        state.error = (action.payload as string) || action.error.message || "An unknown error occurred";
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
        state.error = (action.payload as string) || action.error.message || "An unknown error occurred";
      })
      // PROFILE
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || "An unknown error occurred";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;


