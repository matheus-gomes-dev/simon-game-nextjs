import type { LeaderboardEntry } from "@/types/game";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <p className="text-center text-gray-400">
        No scores yet. Be the first to play!
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-700 bg-gray-800 text-gray-200">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Rank
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Player
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-right">
              Score
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {entries.map((entry) => (
            <tr
              key={entry.username}
              className="bg-gray-900 text-gray-300 transition-colors hover:bg-gray-800"
            >
              <td className="px-4 py-3 font-medium">
                {entry.rank <= 3 ? (
                  <span className="text-lg">
                    {entry.rank === 1 && "🥇"}
                    {entry.rank === 2 && "🥈"}
                    {entry.rank === 3 && "🥉"}
                  </span>
                ) : (
                  entry.rank
                )}
              </td>
              <td className="px-4 py-3">{entry.username}</td>
              <td className="px-4 py-3 text-right font-mono">
                {entry.highestScore}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
