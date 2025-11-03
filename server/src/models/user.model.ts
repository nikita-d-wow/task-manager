import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface User extends Document {
  username: string;
  email: string;
  password?: string; // optional for Google users
  avatar?: string;
  googleId?: string;
  role?: string;
}

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: function (value: string) {
          // ✅ allow any characters, just ensure 8+ length
          return value.length >= 8;
        },
        message: "Password must be at least 8 characters long",
      },
      required: function (this: User) {
        // ✅ password required only if not a Google user
        return !this.googleId;
      },
    },
    avatar: {
      type: String,
    },
    googleId: {
      type: String,
      required: false,
    },
    role: { 
      type: String,
      default: "User"
    },
  },
  { timestamps: true }
);

// ✅ Fix: ensure type safety for password hashing
userSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(this.password, salt);
    this.password = hashed; // ✅ assign actual string, not a Promise
    next();
  } catch (err) {
    next(err as Error);
  }
});

export default mongoose.model<User>("User", userSchema);
