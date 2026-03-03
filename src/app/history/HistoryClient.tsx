"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import GameHistoryTable from "@/components/history/GameHistoryTable";
import type { GameHistoryItem } from "@/types/game";
import type { SortColumn, SortDirection } from "@/components/history/GameHistoryTable";

export default function HistoryClient() {
  const [games, setGames] = useState<GameHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortColumn>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/games");
      if (!res.ok) {
        throw new Error("Failed to load game history");
      }
      const data = await res.json();
      setGames(data.games);
    } catch {
      setError("Failed to load game history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const sortedGames = useMemo(() => {
    const sorted = [...games];
    sorted.sort((a, b) => {
      if (sortBy === "date") {
        return sortDirection === "desc"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortDirection === "desc" ? b.score - a.score : a.score - b.score;
    });
    return sorted;
  }, [games, sortBy, sortDirection]);

  function handleSort(column: SortColumn) {
    if (column === sortBy) {
      setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-900/50 px-4 py-3 text-center text-red-300">
        <p>{error}</p>
        <button
          onClick={fetchHistory}
          className="mt-2 rounded-lg bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <p className="py-16 text-center text-gray-400">
        No games yet.{" "}
        <Link href="/play" className="text-indigo-400 hover:text-indigo-300">
          Play your first game
        </Link>{" "}
        to see your history!
      </p>
    );
  }

  return (
    <GameHistoryTable
      games={sortedGames}
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSort={handleSort}
    />
  );
}
