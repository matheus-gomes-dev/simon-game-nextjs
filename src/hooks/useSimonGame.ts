"use client";

import { useState, useCallback, useRef } from "react";
import { SimonColor, GameStatus } from "@/types/game";

const COLORS: SimonColor[] = ["green", "red", "yellow", "blue"];
const SHOW_DELAY = 600;
const SHOW_GAP = 300;

function randomColor(): SimonColor {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function useSimonGame() {
  const [sequence, setSequence] = useState<SimonColor[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [activeColor, setActiveColor] = useState<SimonColor | null>(null);
  const [score, setScore] = useState(0);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const showSequence = useCallback(
    (seq: SimonColor[]) => {
      setStatus("showing");
      clearTimeouts();

      seq.forEach((color, i) => {
        const showTimeout = setTimeout(() => {
          setActiveColor(color);
        }, i * (SHOW_DELAY + SHOW_GAP));

        const hideTimeout = setTimeout(() => {
          setActiveColor(null);
        }, i * (SHOW_DELAY + SHOW_GAP) + SHOW_DELAY);

        timeoutsRef.current.push(showTimeout, hideTimeout);
      });

      const doneTimeout = setTimeout(() => {
        setStatus("playing");
        setPlayerIndex(0);
      }, seq.length * (SHOW_DELAY + SHOW_GAP));

      timeoutsRef.current.push(doneTimeout);
    },
    [clearTimeouts]
  );

  const startGame = useCallback(() => {
    clearTimeouts();
    const first = randomColor();
    const newSequence = [first];
    setSequence(newSequence);
    setScore(0);
    setPlayerIndex(0);
    showSequence(newSequence);
  }, [clearTimeouts, showSequence]);

  const handleColorPress = useCallback(
    (color: SimonColor) => {
      if (status !== "playing") return;

      setActiveColor(color);
      setTimeout(() => setActiveColor(null), 200);

      if (color !== sequence[playerIndex]) {
        setStatus("gameover");
        clearTimeouts();
        return;
      }

      const nextIndex = playerIndex + 1;

      if (nextIndex >= sequence.length) {
        const newScore = score + 1;
        setScore(newScore);
        const next = randomColor();
        const newSequence = [...sequence, next];
        setSequence(newSequence);
        setPlayerIndex(0);

        const delayTimeout = setTimeout(() => {
          showSequence(newSequence);
        }, 800);
        timeoutsRef.current.push(delayTimeout);
      } else {
        setPlayerIndex(nextIndex);
      }
    },
    [status, sequence, playerIndex, score, clearTimeouts, showSequence]
  );

  return {
    status,
    score,
    activeColor,
    startGame,
    handleColorPress,
  };
}
