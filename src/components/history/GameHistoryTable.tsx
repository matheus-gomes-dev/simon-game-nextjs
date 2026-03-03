"use client";

import type { GameHistoryItem } from "@/types/game";

export type SortColumn = "date" | "score";
export type SortDirection = "asc" | "desc";

interface GameHistoryTableProps {
  games: GameHistoryItem[];
  sortBy: SortColumn;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
}

function formatDuration(seconds: number): string {
  const s = Math.round(seconds);
  if (s < 60) return `${s}s`;
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function ariaSort(column: SortColumn, sortBy: SortColumn, sortDirection: SortDirection) {
  if (column !== sortBy) return "none" as const;
  return sortDirection === "asc" ? ("ascending" as const) : ("descending" as const);
}

function SortIndicator({
  column,
  sortBy,
  sortDirection,
}: {
  column: SortColumn;
  sortBy: SortColumn;
  sortDirection: SortDirection;
}) {
  if (column !== sortBy) return null;
  return (
    <span aria-hidden="true">
      {sortDirection === "asc" ? " \u25B2" : " \u25BC"}
    </span>
  );
}

export default function GameHistoryTable({
  games,
  sortBy,
  sortDirection,
  onSort,
}: GameHistoryTableProps) {
  function handleKeyDown(column: SortColumn) {
    return (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSort(column);
      }
    };
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-700 bg-gray-800 text-gray-200">
          <tr>
            <th
              scope="col"
              aria-sort={ariaSort("date", sortBy, sortDirection)}
              tabIndex={0}
              className="cursor-pointer px-4 py-3 font-semibold transition-colors hover:text-indigo-400"
              onClick={() => onSort("date")}
              onKeyDown={handleKeyDown("date")}
            >
              Date
              <SortIndicator column="date" sortBy={sortBy} sortDirection={sortDirection} />
            </th>
            <th
              scope="col"
              aria-sort={ariaSort("score", sortBy, sortDirection)}
              tabIndex={0}
              className="cursor-pointer px-4 py-3 font-semibold transition-colors hover:text-indigo-400"
              onClick={() => onSort("score")}
              onKeyDown={handleKeyDown("score")}
            >
              Score
              <SortIndicator column="score" sortBy={sortBy} sortDirection={sortDirection} />
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">Duration</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {games.map((game) => (
            <tr key={game.id} className="bg-gray-900 text-gray-300 transition-colors hover:bg-gray-800">
              <td className="px-4 py-3">{formatDate(game.createdAt)}</td>
              <td className="px-4 py-3">{game.score}</td>
              <td className="px-4 py-3">{formatDuration(game.duration)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
