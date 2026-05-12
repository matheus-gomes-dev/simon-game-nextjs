import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { registerSchema } from "@/lib/validators";

/**
 * POST /api/register
 *
 * Creates a new user account.
 *
 * Request body: `{ username, email, password }`
 *
 * Responses:
 * - 201: Account created successfully.
 * - 400: Validation errors (Zod field errors).
 * - 409: Email or username already taken.
 * - 500: Unexpected server error.
 */
export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { errors: { form: ["Invalid request body"] } },
        { status: 400 }
      );
    }

    // Validate input with Zod
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { username, email, password } = result.data;
    const normalizedEmail = email.toLowerCase();
    const normalizedUsername = username.toLowerCase();

    await dbConnect();

    // Check uniqueness with a single query for efficiency
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });
    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return NextResponse.json(
          { errors: { email: ["An account with this email already exists"] } },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { errors: { username: ["This username is already taken"] } },
        { status: 409 }
      );
    }

    // Hash password with bcrypt (cost factor 12)
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user — name defaults to username (intentional: no separate name field in registration)
    await User.create({
      name: username,
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
    });

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Race condition fallback: MongoDB duplicate key error
    if (
      error instanceof Error &&
      "code" in error &&
      (error as Error & { code: number; keyPattern?: Record<string, number> }).code === 11000
    ) {
      const mongoError = error as Error & { keyPattern?: Record<string, number> };
      if (mongoError.keyPattern?.username) {
        return NextResponse.json(
          { errors: { username: ["This username is already taken"] } },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { errors: { email: ["An account with this email already exists"] } },
        { status: 409 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { errors: { form: ["An unexpected error occurred. Please try again."] } },
      { status: 500 }
    );
  }
}
