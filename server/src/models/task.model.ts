import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  category?: string;
  project?: string;
  date: string;
  time: string;
  progress?: number;
  completed: boolean;
  deleted?: boolean;
  avatar?: string[]; // related avatars (optional)
  priority?: "Low" | "Medium" | "High"; // new
  attachments?: string[]; // new - for files or images
  createdBy: mongoose.Schema.Types.ObjectId; // user who created the task
  assignedTo?: mongoose.Schema.Types.ObjectId; // user assigned to the task
  // collaborators?: mongoose.Schema.Types.ObjectId[]; // new - team members
  // visibility?: "private" | "team" | "public"; // new - access control
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, default: "General" },
    project: { type: String, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completed: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    avatar: { type: [String], default: [] },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    attachments: { type: [String], default: [] },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // collaborators: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //   },
    // ],
    // visibility: {
    //   type: String,
    //   enum: ["private", "team", "public"],
    //   default: "private",
    // },
  },
  { timestamps: true }
);

// ✅ Index for fast querying by user
taskSchema.index({ createdBy: 1, assignedTo: 1 });

export const Task = mongoose.model<ITask>("Task", taskSchema);
