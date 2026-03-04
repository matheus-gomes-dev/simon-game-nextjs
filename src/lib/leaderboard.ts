import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import type { LeaderboardEntry } from "@/types/game";

/**
 * Fetches top players ranked by highest score.
 *
 * Filters out users who have never completed a game (score = 0).
 * Uses `.select()` to avoid leaking sensitive fields like passwordHash.
 * Uses `.lean()` for plain objects with minimal overhead.
 */
export async function getTopPlayers(
  limit: number = 10
): Promise<LeaderboardEntry[]> {
  await dbConnect();

  const users = await User.find({ highestScore: { $gt: 0 } })
    .sort({ highestScore: -1 })
    .limit(limit)
    .select("username highestScore")
    .lean();

  return users.map((user, index) => ({
    rank: index + 1,
    username: user.username,
    highestScore: user.highestScore,
  }));
}
