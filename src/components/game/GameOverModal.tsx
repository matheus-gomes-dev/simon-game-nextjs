"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface GameOverModalProps {
  /** Final score when the game ended. */
  score: number;
  /** Callback to restart the game. */
  onPlayAgain: () => void;
  /** Whether the current user is authenticated. */
  isAuthenticated: boolean;
  /** Current status of the game save operation. */
  saveStatus?: "idle" | "saving" | "saved" | "error";
  /** Error message if save failed. */
  saveError?: string | null;
}

/**
 * Full-screen overlay displayed when the game ends.
 *
 * Shows the final score and a "Play Again" call-to-action inside a
 * centered card with a backdrop blur and a subtle scale-in animation.
 */
export default function GameOverModal({
  score,
  onPlayAgain,
  isAuthenticated,
  saveStatus,
  saveError = null,
}: GameOverModalProps) {
  const playAgainRef = useRef<HTMLButtonElement>(null);

  /** Auto-focus the "Play Again" button on mount. */
  useEffect(() => {
    playAgainRef.current?.focus();
  }, []);

  /** Close modal on Escape key press. */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onPlayAgain();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onPlayAgain]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gameover-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_300ms_ease-out]"
    >
      <div className="mx-4 flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl bg-gray-800 p-6 shadow-2xl animate-[scaleIn_300ms_ease-out] sm:p-10">
        <h2 id="gameover-title" className="text-3xl font-bold text-red-400 sm:text-4xl">Game Over!</h2>
        <p className="text-2xl text-gray-200">
          Final Score: <span className="font-bold text-white">{score}</span>
        </p>

        {/* Save status feedback (authenticated users) */}
        {isAuthenticated && saveStatus === "saving" && (
          <p className="text-sm text-gray-400">Saving score...</p>
        )}
        {isAuthenticated && saveStatus === "saved" && (
          <p className="text-sm text-green-400">Score saved!</p>
        )}
        {isAuthenticated && saveStatus === "error" && (
          <p className="text-sm text-red-400">{saveError}</p>
        )}

        {/* Guest prompt */}
        {!isAuthenticated && (
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-sm text-gray-400">
              Sign in to save your scores and appear on the leaderboard!
            </p>
            <div className="flex gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-indigo-400 border border-indigo-500 rounded-lg hover:bg-indigo-500/10 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        )}

        <button
          ref={playAgainRef}
          type="button"
          onClick={onPlayAgain}
          disabled={saveStatus === "saving"}
          className="px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
