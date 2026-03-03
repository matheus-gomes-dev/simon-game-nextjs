"use client";

import { useSimonGame } from "@/hooks/useSimonGame";
import SimonBoard from "@/components/game/SimonBoard";
import GameControls from "@/components/game/GameControls";
import GameOverModal from "@/components/game/GameOverModal";

/**
 * Client component for the Simon game UI.
 * Extracted to allow the play page to perform
 * a server-side authentication check before rendering.
 */
export default function PlayClient() {
  const { state, startGame, handleTap } = useSimonGame();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <h1 className="text-4xl font-bold text-white sm:text-5xl">
        Simon Game
      </h1>

      <GameControls
        score={state.score}
        status={state.status}
        onStart={startGame}
      />

      <SimonBoard
        activeColor={state.activeColor}
        status={state.status}
        onTap={handleTap}
      />

      {state.status === "gameover" && (
        <GameOverModal score={state.score} onPlayAgain={startGame} />
      )}
    </div>
  );
}
