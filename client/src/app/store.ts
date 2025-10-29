import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/slice/authSlice";
import tasksReducer from "../features/tasks/redux/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
  },
});

// Types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
