// src/models/activity.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface Activity extends Document {
  user: mongoose.Types.ObjectId;
  action: string;
  ip?: string;
  meta?: Record<string, any>;
  createdAt?: Date;
}

const activitySchema = new Schema<Activity>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  ip: { type: String },
  meta: { type: Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model<Activity>("Activity", activitySchema);
