import axios from "axios";
import type { Credentials, User, AuthResponse } from "../types/auth.types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

//console.log("API Base URL:", api.defaults.baseURL);

export const loginApi = (data: Credentials) =>
  api.post<AuthResponse>("/login", data);

export const signupApi = (data: User & { password: string }) =>
  api.post<AuthResponse>("/signup", data);

export const fetchProfileApi = (token: string) =>
  api.get<User>("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  export const updateProfileApi = (
  token: string,
  data: { username?: string; email?: string; avatar?: string; role?: string }
) =>
  api.put<{ message: string; user: User }>("/profile", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
