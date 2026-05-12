import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import GameSession from "@/models/GameSession";
import User from "@/models/User";
import { saveGameSchema } from "@/lib/validators";
import type { GameHistoryItem } from "@/types/game";

/**
 * GET /api/games
 *
 * Returns the authenticated user's game history, sorted by most recent first.
 *
 * Responses:
 * - 200: `{ games: GameHistoryItem[] }`
 * - 401: User not authenticated.
 * - 500: Unexpected server error.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { errors: { form: ["Authentication required"] } },
        { status: 401 }
      );
    }

    await dbConnect();

    const docs = await GameSession.find({ userId: session.user.id })
      .select("score duration createdAt")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const games: GameHistoryItem[] = docs.map((doc) => ({
      id: String(doc._id),
      score: doc.score,
      duration: doc.duration,
      createdAt: doc.createdAt.toISOString(),
    }));

    return NextResponse.json({ games });
  } catch (error: unknown) {
    console.error("Get game history error:", error);
    return NextResponse.json(
      { errors: { form: ["An unexpected error occurred. Please try again."] } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/games
 *
 * Saves a completed game session for an authenticated user.
 *
 * Request body: `{ score, sequence, startedAt, endedAt, duration }`
 *
 * Responses:
 * - 201: Game session saved successfully.
 * - 400: Validation errors (Zod field errors).
 * - 401: User not authenticated.
 * - 500: Unexpected server error.
 */
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { errors: { form: ["Authentication required"] } },
        { status: 401 }
      );
    }

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
    const result = saveGameSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { score, sequence, startedAt, endedAt, duration } = result.data;

    await dbConnect();

    // Create game session
    const gameSession = await GameSession.create({
      userId: session.user.id,
      score,
      sequence,
      startedAt: new Date(startedAt),
      endedAt: new Date(endedAt),
      duration,
    });

    // Update user's stats: increment gamesPlayed, update highestScore if needed.
    // Note: These two operations are not wrapped in a transaction (requires replica set).
    // If this update fails, the game session is still saved but user stats may be stale.
    await User.findOneAndUpdate(
      { _id: session.user.id },
      {
        $inc: { gamesPlayed: 1 },
        $max: { highestScore: score },
      }
    );

    return NextResponse.json(
      { id: gameSession._id.toString() },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Save game session error:", error);
    return NextResponse.json(
      { errors: { form: ["An unexpected error occurred. Please try again."] } },
      { status: 500 }
    );
  }
}
