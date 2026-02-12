"use client";

import SimonBoard from "@/components/SimonBoard";
import GameControls from "@/components/GameControls";
import { useSimonGame } from "@/hooks/useSimonGame";

export default function Home() {
  const { status, score, activeColor, startGame, handleColorPress } =
    useSimonGame();

  const boardDisabled = status !== "playing";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-900 p-4">
      <h1 className="text-4xl font-bold text-white">Simon</h1>
      <SimonBoard
        activeColor={activeColor}
        disabled={boardDisabled}
        onColorPress={handleColorPress}
      />
      <GameControls status={status} score={score} onStart={startGame} />
    </div>
  );
}
