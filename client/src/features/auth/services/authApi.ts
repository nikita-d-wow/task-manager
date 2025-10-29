import axios from "axios";
import type { Credentials, User, AuthResponse } from "../types/auth.types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

//console.log("API Base URL:", api.defaults.baseURL);

export const loginApi = (data: Credentials) =>
  api.post<AuthResponse>("/auth/login", data);

export const signupApi = (data: User & { password: string }) =>
  api.post<AuthResponse>("/auth/signup", data);

export const fetchProfileApi = (token: string) =>
  api.get<User>("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

