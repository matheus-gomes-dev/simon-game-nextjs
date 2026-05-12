import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Represents a User document stored in the `users` collection.
 */
export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  passwordHash: string;
  highestScore: number;
  gamesPlayed: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    highestScore: {
      type: Number,
      default: 0,
    },
    gamesPlayed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Indexes for query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ highestScore: -1 });

/**
 * Mongoose model for the User collection.
 *
 * Uses a guard to prevent model recompilation during Next.js hot reloads.
 */
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
