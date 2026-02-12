"use client";

import { GameStatus } from "@/types/game";

interface GameControlsProps {
  status: GameStatus;
  score: number;
  onStart: () => void;
}

export default function GameControls({
  status,
  score,
  onStart,
}: GameControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-2xl font-bold text-white">
        {status === "gameover" ? (
          <span className="text-red-400">Game Over!</span>
        ) : status === "showing" ? (
          <span className="text-yellow-300">Watch...</span>
        ) : status === "playing" ? (
          <span className="text-green-300">Your turn!</span>
        ) : null}
      </div>

      <div className="text-lg text-zinc-300">
        Score: <span className="font-mono font-bold text-white">{score}</span>
      </div>

      {(status === "idle" || status === "gameover") && (
        <button
          onClick={onStart}
          className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-black transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          {status === "gameover" ? "Play Again" : "Start Game"}
        </button>
      )}
    </div>
  );
}
