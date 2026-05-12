"use client";

import { SimonColor } from "@/types/game";

const COLOR_STYLES: Record<SimonColor, { base: string; active: string }> = {
  green: {
    base: "bg-green-700 hover:bg-green-600",
    active: "bg-green-400 shadow-[0_0_30px_rgba(74,222,128,0.8)]",
  },
  red: {
    base: "bg-red-700 hover:bg-red-600",
    active: "bg-red-400 shadow-[0_0_30px_rgba(248,113,113,0.8)]",
  },
  yellow: {
    base: "bg-yellow-600 hover:bg-yellow-500",
    active: "bg-yellow-300 shadow-[0_0_30px_rgba(253,224,71,0.8)]",
  },
  blue: {
    base: "bg-blue-700 hover:bg-blue-600",
    active: "bg-blue-400 shadow-[0_0_30px_rgba(96,165,250,0.8)]",
  },
};

const POSITION_STYLES: Record<SimonColor, string> = {
  green: "rounded-tl-full",
  red: "rounded-tr-full",
  yellow: "rounded-bl-full",
  blue: "rounded-br-full",
};

interface SimonButtonProps {
  color: SimonColor;
  isActive: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function SimonButton({
  color,
  isActive,
  disabled,
  onClick,
}: SimonButtonProps) {
  const styles = COLOR_STYLES[color];
  const position = POSITION_STYLES[color];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        aspect-square w-full transition-all duration-150
        ${position}
        ${isActive ? styles.active : styles.base}
        ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer active:scale-95"}
      `}
      aria-label={`${color} button`}
    />
  );
}
