// import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";

// interface ProgressData {
//   _id: string | number;
//   total: number;
//   completed: number;
// }

// interface ProgressState {
//   weekly: ProgressData[];
//   monthly: ProgressData[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ProgressState = {
//   weekly: [],
//   monthly: [],
//   loading: false,
//   error: null,
// };

// export const fetchProgressData = createAsyncThunk(
//   "progress/fetch",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/progress/stats", {
//         withCredentials: true,
//       });
//       return res.data;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || "Failed to fetch progress data");
//     }
//   }
// );

// const progressSlice = createSlice({
//   name: "progress",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProgressData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         fetchProgressData.fulfilled,
//         (state, action: PayloadAction<{ weekly: ProgressData[]; monthly: ProgressData[] }>) => {
//           state.loading = false;
//           state.weekly = action.payload.weekly;
//           state.monthly = action.payload.monthly;
//         }
//       )
//       .addCase(fetchProgressData.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export default progressSlice.reducer;
