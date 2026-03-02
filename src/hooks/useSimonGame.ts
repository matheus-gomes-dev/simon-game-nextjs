"use client";

import { useReducer, useRef, useEffect, useCallback } from "react";
import type {
  SimonColor,
  SimonGameState,
  SimonGameAction,
} from "@/types/game";

/** Available Simon colors in board order: green, red, yellow, blue. */
export const COLORS: SimonColor[] = ["green", "red", "yellow", "blue"];

/** Frequency map (Hz) for each Simon color tone. */
const TONE_FREQUENCIES: Record<SimonColor, number> = {
  green: 392,
  red: 262,
  yellow: 330,
  blue: 196,
};

/** Frequency for the game-over buzzer sound. */
const GAME_OVER_FREQUENCY = 100;

/** Duration constants in milliseconds. */
const TONE_DURATION_MS = 300;
const GAME_OVER_TONE_DURATION_MS = 500;
const SHOW_ACTIVE_MS = 300;
const SHOW_GAP_MS = 200;
const CLEAR_ACTIVE_DELAY_MS = 200;
const NEXT_ROUND_DELAY_MS = 1000;

/** Returns a random SimonColor. */
function getRandomColor(): SimonColor {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export const initialState: SimonGameState = {
  status: "idle",
  sequence: [],
  playerIndex: 0,
  score: 0,
  activeColor: null,
  showIndex: 0,
};

/**
 * Pure reducer that handles all Simon game state transitions.
 *
 * Exported for direct unit-testing without hook machinery.
 */
export function simonReducer(
  state: SimonGameState,
  action: SimonGameAction
): SimonGameState {
  switch (action.type) {
    case "START_GAME":
      return { ...initialState };

    case "EXTEND_SEQUENCE":
      return {
        ...state,
        sequence: [...state.sequence, action.color],
        showIndex: 0,
        status: "showing",
      };

    case "SHOW_STEP":
      return {
        ...state,
        activeColor: state.sequence[state.showIndex],
        showIndex: state.showIndex + 1,
      };

    case "CLEAR_ACTIVE":
      return {
        ...state,
        activeColor: null,
      };

    case "SHOW_COMPLETE":
      return {
        ...state,
        activeColor: null,
        showIndex: -1,
        playerIndex: 0,
        status: "playing",
      };

    case "PLAYER_TAP": {
      const expected = state.sequence[state.playerIndex];
      if (action.color !== expected) {
        return { ...state, status: "gameover" };
      }

      const nextPlayerIndex = state.playerIndex + 1;
      const roundFinished = nextPlayerIndex >= state.sequence.length;

      return {
        ...state,
        activeColor: action.color,
        playerIndex: nextPlayerIndex,
        ...(roundFinished
          ? { score: state.score + 1, status: "idle" as const }
          : {}),
      };
    }

    default:
      return state;
  }
}

/**
 * Custom hook that encapsulates the full Simon game logic:
 * - Wraps `simonReducer` with `useReducer`
 * - Manages Web Audio API tones
 * - Manages sequence playback timing
 * - Provides `startGame` and `handleTap` callbacks
 */
export function useSimonGame() {
  const [state, dispatch] = useReducer(simonReducer, initialState);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timersRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const statusRef = useRef(state.status);

  /** Keep statusRef in sync with the latest status to avoid stale closures. */
  useEffect(() => {
    statusRef.current = state.status;
  }, [state.status]);

  /**
   * Returns (or lazily creates) a shared AudioContext.
   * Resumes the context if it was suspended (browser autoplay policy).
   */
  const getAudioContext = useCallback((): AudioContext => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  /**
   * Plays a sine-wave tone at the given frequency for the given duration.
   *
   * @param frequency - Tone frequency in Hz
   * @param durationMs - Duration in milliseconds
   */
  const playTone = useCallback(
    (frequency: number, durationMs: number): void => {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + durationMs / 1000
      );

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + durationMs / 1000);
    },
    [getAudioContext]
  );

  /** Plays the tone mapped to a specific Simon color. */
  const playColorTone = useCallback(
    (color: SimonColor): void => {
      playTone(TONE_FREQUENCIES[color], TONE_DURATION_MS);
    },
    [playTone]
  );

  /** Plays the low-pitched game-over buzzer. */
  const playGameOverTone = useCallback((): void => {
    playTone(GAME_OVER_FREQUENCY, GAME_OVER_TONE_DURATION_MS);
  }, [playTone]);

  /**
   * Schedules a callback via `setTimeout` and tracks the timer ID
   * so it can be cleared on cleanup or game restart.
   */
  const scheduleTimer = useCallback(
    (callback: () => void, delayMs: number): NodeJS.Timeout => {
      const id = setTimeout(() => {
        timersRef.current.delete(id);
        callback();
      }, delayMs);
      timersRef.current.add(id);
      return id;
    },
    []
  );

  /** Clears every pending timer tracked by this hook. */
  const clearAllTimers = useCallback((): void => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current.clear();
  }, []);

  // ---------------------------------------------------------------------------
  // Effect: Sequence playback (status === "showing")
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (state.status !== "showing") return;

    const localTimers: NodeJS.Timeout[] = [];
    const { sequence } = state;
    let elapsed = 0;

    for (let i = 0; i < sequence.length; i++) {
      // Show the color (active highlight + tone)
      const showDelay = elapsed;
      localTimers.push(
        scheduleTimer(() => {
          dispatch({ type: "SHOW_STEP" });
          playColorTone(sequence[i]);
        }, showDelay)
      );

      // Clear the active highlight after SHOW_ACTIVE_MS
      elapsed += SHOW_ACTIVE_MS;
      const clearDelay = elapsed;
      localTimers.push(
        scheduleTimer(() => {
          dispatch({ type: "CLEAR_ACTIVE" });
        }, clearDelay)
      );

      // Add gap before next color
      elapsed += SHOW_GAP_MS;
    }

    // After the full sequence has been shown, transition to "playing"
    localTimers.push(
      scheduleTimer(() => {
        dispatch({ type: "SHOW_COMPLETE" });
      }, elapsed)
    );

    return () => {
      localTimers.forEach((id) => {
        clearTimeout(id);
        timersRef.current.delete(id);
      });
    };
  }, [state.status, state.sequence, scheduleTimer, playColorTone]);

  // ---------------------------------------------------------------------------
  // Effect: Next round trigger (status === "idle" && score > 0)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (state.status !== "idle" || state.score <= 0) return;

    scheduleTimer(() => {
      dispatch({ type: "EXTEND_SEQUENCE", color: getRandomColor() });
    }, NEXT_ROUND_DELAY_MS);
  }, [state.status, state.score, scheduleTimer]);

  // ---------------------------------------------------------------------------
  // Effect: Game-over sound
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (state.status === "gameover") {
      playGameOverTone();
    }
  }, [state.status, playGameOverTone]);

  // ---------------------------------------------------------------------------
  // Cleanup on unmount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    return () => {
      clearAllTimers();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [clearAllTimers]);

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Starts a new game: clears timers, resets state, and kicks off
   * the first round with a single random color.
   */
  const startGame = useCallback((): void => {
    clearAllTimers();
    dispatch({ type: "START_GAME" });
    dispatch({ type: "EXTEND_SEQUENCE", color: getRandomColor() });
  }, [clearAllTimers]);

  /**
   * Handles the player tapping a color button.
   * Only effective while `status === "playing"`.
   */
  const handleTap = useCallback(
    (color: SimonColor): void => {
      if (statusRef.current !== "playing") return;

      playColorTone(color);
      dispatch({ type: "PLAYER_TAP", color });

      scheduleTimer(() => {
        dispatch({ type: "CLEAR_ACTIVE" });
      }, CLEAR_ACTIVE_DELAY_MS);
    },
    [playColorTone, scheduleTimer]
  );

  return { state, startGame, handleTap };
}
