"use client";

import { SimonColor } from "@/types/game";
import SimonButton from "./SimonButton";

const COLORS: SimonColor[] = ["green", "red", "yellow", "blue"];

interface SimonBoardProps {
  activeColor: SimonColor | null;
  disabled: boolean;
  onColorPress: (color: SimonColor) => void;
}

export default function SimonBoard({
  activeColor,
  disabled,
  onColorPress,
}: SimonBoardProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-72 h-72 sm:w-80 sm:h-80">
      {COLORS.map((color) => (
        <SimonButton
          key={color}
          color={color}
          isActive={activeColor === color}
          disabled={disabled}
          onClick={() => onColorPress(color)}
        />
      ))}
    </div>
  );
}
