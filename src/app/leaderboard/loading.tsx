import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function LeaderboardLoading() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-white">Leaderboard</h1>
      <p className="mb-4 text-gray-400">Top 10 players by highest score</p>
      <div className="py-16">
        <LoadingSpinner size="lg" label="Loading leaderboard..." />
      </div>
    </main>
  );
}
