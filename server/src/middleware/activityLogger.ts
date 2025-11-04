import Activity from "../models/activity.model";

export const logActivity = async (userId: string, action: string, meta?: any, ip?: string) => {
  try {
    await Activity.create({ user: userId, action, meta, ip });
  } catch (err) {
    console.error("Failed to log activity", err);
  }
};
