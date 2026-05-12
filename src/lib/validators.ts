import { z } from "zod";

/**
 * Zod schema for validating user registration input.
 *
 * - **username**: 3-20 characters, alphanumeric and underscores only.
 * - **email**: Must be a valid email format.
 * - **password**: Minimum 8 characters.
 */
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_]*$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
});

/** TypeScript type inferred from the register validation schema. */
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Zod schema for validating login input.
 *
 * - **email**: Must be a valid email format.
 * - **password**: Must be non-empty (no length policy enforced on login).
 */
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

/** TypeScript type inferred from the login validation schema. */
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Zod schema for validating game session save input.
 *
 * - **score**: Non-negative integer representing the final score.
 * - **sequence**: Array of valid SimonColor strings.
 * - **startedAt**: ISO datetime string when the game started.
 * - **endedAt**: ISO datetime string when the game ended.
 * - **duration**: Non-negative number representing game duration in seconds.
 */
export const saveGameSchema = z
  .object({
    score: z
      .number()
      .int()
      .min(0, "Score must be a non-negative integer")
      .max(1000, "Score exceeds maximum"),
    sequence: z
      .array(z.enum(["green", "red", "yellow", "blue"]))
      .min(1, "Sequence must contain at least one color")
      .max(1001, "Sequence too long"),
    startedAt: z.string().datetime("Invalid start time format"),
    endedAt: z.string().datetime("Invalid end time format"),
    duration: z.number().min(0, "Duration must be non-negative"),
  })
  .refine((data) => new Date(data.endedAt) > new Date(data.startedAt), {
    message: "End time must be after start time",
    path: ["endedAt"],
  });

/** TypeScript type inferred from the save game validation schema. */
export type SaveGameInput = z.infer<typeof saveGameSchema>;
