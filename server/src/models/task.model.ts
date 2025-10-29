import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  project?: string;
  date: string;
  time: string;
  progress?: number;
  completed: boolean;
  avatar?: string[];
  subtasks?: { title: string; done: boolean }[];
  createdBy: mongoose.Schema.Types.ObjectId; // user who created the task
  assignedTo?: mongoose.Schema.Types.ObjectId; // user assigned to the task
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    project: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    avatar: { type: [String], default: [] },
    subtasks: [
      {
        title: { type: String },
        done: { type: Boolean, default: false },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
