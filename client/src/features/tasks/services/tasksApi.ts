import { api } from "../../../lib/api";
import type { Task } from "../types/task.types";

export const fetchTasksApi = () => api.get<Task[]>("/tasks");

export const addTaskApi = (task: { title: string }) => api.post<Task>("/tasks", task);

export const toggleTaskApi = (id: string) => api.patch<Task>(`/tasks/${id}/toggle`);
