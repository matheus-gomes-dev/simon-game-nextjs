"use client";

import type { SimonColor, GameStatus } from "@/types/game";
import SimonButton from "@/components/game/SimonButton";

/** Board color order: green (top-left), red (top-right), yellow (bottom-left), blue (bottom-right). */
const BOARD_COLORS: SimonColor[] = ["green", "red", "yellow", "blue"];

interface SimonBoardProps {
  /** The color currently highlighted (lit up), or null if none. */
  activeColor: SimonColor | null;
  /** Current game status; buttons are only interactive when "playing". */
  status: GameStatus;
  /** Callback invoked when the player taps a color. */
  onTap: (color: SimonColor) => void;
}

/**
 * 2x2 grid of Simon color pads.
 *
 * Disables interaction (pointer events + button disabled state) whenever
 * the game is not in "playing" status.
 */
export default function SimonBoard({
  activeColor,
  status,
  onTap,
}: SimonBoardProps) {
  const isInteractive = status === "playing";

  return (
    <div
      className={[
        "grid grid-cols-2 gap-4",
        !isInteractive ? "pointer-events-none" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {BOARD_COLORS.map((color) => (
        <SimonButton
          key={color}
          color={color}
          isActive={activeColor === color}
          disabled={!isInteractive}
          onTap={() => onTap(color)}
        />
      ))}
    </div>
  );
}
