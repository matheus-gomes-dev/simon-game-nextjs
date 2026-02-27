"use client";

import { useEffect, useRef } from "react";

interface GameOverModalProps {
  /** Final score when the game ended. */
  score: number;
  /** Callback to restart the game. */
  onPlayAgain: () => void;
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
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-gray-800 p-10 shadow-2xl animate-[scaleIn_300ms_ease-out]">
        <h2 id="gameover-title" className="text-4xl font-bold text-red-400">Game Over!</h2>
        <p className="text-2xl text-gray-200">
          Final Score: <span className="font-bold text-white">{score}</span>
        </p>
        <button
          ref={playAgainRef}
          type="button"
          onClick={onPlayAgain}
          className="px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
