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
