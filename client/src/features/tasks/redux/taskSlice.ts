import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export type User = {
  username: string;
  avatar: string;
};

export interface Task {
  _id?: string;
  title: string;
  description: string;
  project: string;
  assignee: User | null;
  progress: number; // 0–100
  completed: boolean;
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

// ✅ Base URL 
const API_URL = "http://localhost:5000/tasks";

// Utility type for clean error extraction
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error occurred";
};

// --- ASYNC THUNKS ---

// Fetch all tasks
export const fetchTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  "tasks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get<Task[]>(API_URL, { withCredentials: true });
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Add new task
export const createTask = createAsyncThunk<Task, Omit<Task, "_id">, { rejectValue: string }>(
  "tasks/create",
  async (task, { rejectWithValue }) => {
    try {
      const res = await axios.post<Task>(API_URL, task, { withCredentials: true });
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Update existing task
export const editTask = createAsyncThunk<Task, Task, { rejectValue: string }>(
  "tasks/edit",
  async (task, { rejectWithValue }) => {
    try {
      const res = await axios.put<Task>(`${API_URL}/${task._id}`, task, { withCredentials: true });
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Delete a task
export const removeTask = createAsyncThunk<string, string, { rejectValue: string }>(
  "tasks/delete",
  async (taskId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${taskId}`, { withCredentials: true });
      return taskId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// --- SLICE ---

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tasks";
      })

      // Create task
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.unshift(action.payload);
      })

      // Update task
      .addCase(editTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tasks[index] = action.payload;
      })

      // Delete task
      .addCase(removeTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
