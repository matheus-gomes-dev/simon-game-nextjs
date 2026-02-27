"use client";

import type { SimonColor } from "@/types/game";

/** Tailwind class sets for each Simon color. */
const COLOR_CLASSES: Record<
  SimonColor,
  { base: string; active: string }
> = {
  green: {
    base: "bg-green-700 hover:bg-green-600",
    active: "bg-green-400",
  },
  red: {
    base: "bg-red-700 hover:bg-red-600",
    active: "bg-red-400",
  },
  yellow: {
    base: "bg-yellow-600 hover:bg-yellow-500",
    active: "bg-yellow-300",
  },
  blue: {
    base: "bg-blue-700 hover:bg-blue-600",
    active: "bg-blue-400",
  },
};

interface SimonButtonProps {
  /** Which color pad this button represents. */
  color: SimonColor;
  /** Whether the button is currently lit up (active). */
  isActive: boolean;
  /** Whether the button is disabled (e.g. during sequence playback). */
  disabled: boolean;
  /** Callback fired when the player taps this button. */
  onTap: () => void;
}

/**
 * A single color pad in the Simon game board.
 *
 * Renders a large, rounded button that lights up when active and is
 * disabled during non-interactive game phases.
 */
export default function SimonButton({
  color,
  isActive,
  disabled,
  onTap,
}: SimonButtonProps) {
  const { base, active } = COLOR_CLASSES[color];

  const colorClass = isActive ? active : base;
  const activeEffects = isActive ? "brightness-125 scale-105" : "";
  const disabledClass = disabled ? "cursor-not-allowed opacity-75" : "";

  return (
    <button
      type="button"
      aria-label={`${color} pad`}
      disabled={disabled}
      onClick={onTap}
      className={[
        "w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52",
        "rounded-2xl",
        "transition-all duration-150",
        "active:scale-95",
        "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
        colorClass,
        activeEffects,
        disabledClass,
        disabled ? "[&]:hover:brightness-100" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
