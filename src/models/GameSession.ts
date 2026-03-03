import mongoose, { Document, Model, Schema, Types } from "mongoose";
import type { SimonColor } from "@/types/game";

/**
 * Represents a GameSession document stored in the `game_sessions` collection.
 */
export interface IGameSession extends Document {
  userId: Types.ObjectId;
  score: number;
  sequence: SimonColor[];
  startedAt: Date;
  endedAt: Date;
  duration: number;
  createdAt: Date;
}

const gameSessionSchema = new Schema<IGameSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    score: {
      type: Number,
      required: [true, "Score is required"],
      min: [0, "Score cannot be negative"],
    },
    sequence: {
      type: [{ type: String, enum: ["green", "red", "yellow", "blue"] }],
      required: [true, "Sequence is required"],
    },
    startedAt: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endedAt: {
      type: Date,
      required: [true, "End time is required"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [0, "Duration cannot be negative"],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "game_sessions",
  }
);

// Indexes for query performance
gameSessionSchema.index({ userId: 1, createdAt: -1 });
gameSessionSchema.index({ score: -1 });

/**
 * Mongoose model for the GameSession collection.
 *
 * Uses a guard to prevent model recompilation during Next.js hot reloads.
 */
const GameSession: Model<IGameSession> =
  mongoose.models.GameSession ||
  mongoose.model<IGameSession>("GameSession", gameSessionSchema);

export default GameSession;
