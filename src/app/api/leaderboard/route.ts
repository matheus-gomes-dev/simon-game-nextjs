import { NextResponse } from "next/server";
import { getTopPlayers } from "@/lib/leaderboard";

/**
 * GET /api/leaderboard
 *
 * Returns the top 10 players ranked by highest score.
 * This is a public endpoint — no authentication required.
 *
 * Responses:
 * - 200: `{ leaderboard: LeaderboardEntry[] }`
 * - 500: Unexpected server error.
 */
export async function GET() {
  try {
    const leaderboard = await getTopPlayers(10);

    return NextResponse.json(
      { leaderboard },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (error: unknown) {
    console.error("Get leaderboard error:", error);
    return NextResponse.json(
      { errors: { form: ["An unexpected error occurred. Please try again."] } },
      { status: 500 }
    );
  }
}
