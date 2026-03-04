import { getTopPlayers } from "@/lib/leaderboard";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";

export const revalidate = 60;

/**
 * Public leaderboard page.
 *
 * Server-rendered with ISR (revalidates every 60 seconds).
 * No authentication required — accessible to all visitors.
 */
export default async function LeaderboardPage() {
  const entries = await getTopPlayers(10);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-white">Leaderboard</h1>
      <p className="mb-4 text-gray-400">Top 10 players by highest score</p>
      <LeaderboardTable entries={entries} />
    </main>
  );
}
