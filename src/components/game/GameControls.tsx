"use client";

import type { GameStatus } from "@/types/game";

interface GameControlsProps {
  /** Current game score (number of completed rounds). */
  score: number;
  /** Current game status. */
  status: GameStatus;
  /** Callback to start or restart the game. */
  onStart: () => void;
}

/**
 * Displays the game score, status text, and start/restart button.
 *
 * - Shows "Start Game" when idle (score 0) or game over.
 * - Shows the current score and a status hint during play.
 */
export default function GameControls({
  score,
  status,
  onStart,
}: GameControlsProps) {
  const showStartButton =
    (status === "idle" && score === 0) || status === "gameover";
  const showScoreDisplay = status === "playing" || status === "showing";

  return (
    <div className="flex flex-col items-center gap-4 min-h-[6rem]">
      {showScoreDisplay && (
        <>
          <p className="text-2xl font-bold text-white sm:text-3xl">Score: {score}</p>
          <p className="text-base text-gray-300 sm:text-lg">
            {status === "showing" ? "Watch carefully..." : "Your turn!"}
          </p>
        </>
      )}

      {status === "idle" && score > 0 && (
        <p className="text-2xl font-bold text-white">
          Score: {score} &mdash; Get ready...
        </p>
      )}

      {showStartButton && (
        <button
          type="button"
          onClick={onStart}
          className="px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {status === "gameover" ? "Play Again" : "Start Game"}
        </button>
      )}
    </div>
  );
}
