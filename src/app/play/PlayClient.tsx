"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSimonGame } from "@/hooks/useSimonGame";
import SimonBoard from "@/components/game/SimonBoard";
import GameControls from "@/components/game/GameControls";
import GameOverModal from "@/components/game/GameOverModal";

/** Save status state machine for the game session save flow. */
type SaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * Client component for the Simon game UI.
 * Accessible to both authenticated and guest users.
 * Game sessions are only saved for authenticated users.
 */
export default function PlayClient() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const { state, startGame, handleTap, startedAtRef } = useSimonGame();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  // Save game session when game ends (authenticated users only)
  useEffect(() => {
    if (state.status !== "gameover") return;
    if (!isAuthenticated) return;

    const startedAt = startedAtRef.current;
    if (!startedAt) return;

    const saveGameSession = async () => {
      setSaveStatus("saving");
      setSaveError(null);

      try {
        const endedAt = new Date();
        const duration = (endedAt.getTime() - startedAt.getTime()) / 1000;

        const response = await fetch("/api/games", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            score: state.score,
            sequence: state.sequence,
            startedAt: startedAt.toISOString(),
            endedAt: endedAt.toISOString(),
            duration,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(
            data.errors?.form?.[0] || "Failed to save game session"
          );
        }

        setSaveStatus("saved");
      } catch (error: unknown) {
        setSaveError(
          error instanceof Error ? error.message : "Failed to save game session"
        );
        setSaveStatus("error");
      }
    };

    saveGameSession();
  }, [state.status, state.score, state.sequence, startedAtRef, isAuthenticated]);

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-8 p-4">
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
        <GameOverModal
          score={state.score}
          onPlayAgain={startGame}
          saveStatus={saveStatus}
          saveError={saveError}
        />
      )}
    </div>
  );
}
