import { describe, it, expect } from "vitest";
import {
  simonReducer,
  initialState,
  COLORS,
} from "@/hooks/useSimonGame";
import type { SimonGameState } from "@/types/game";

// ---------------------------------------------------------------------------
// COLORS constant
// ---------------------------------------------------------------------------

describe("COLORS", () => {
  it("contains exactly four colors in the correct order", () => {
    expect(COLORS).toEqual(["green", "red", "yellow", "blue"]);
  });

  it("has length 4", () => {
    expect(COLORS).toHaveLength(4);
  });
});

// ---------------------------------------------------------------------------
// initialState
// ---------------------------------------------------------------------------

describe("initialState", () => {
  it("has the expected default values", () => {
    expect(initialState).toEqual({
      status: "idle",
      sequence: [],
      playerIndex: 0,
      score: 0,
      activeColor: null,
      showIndex: 0,
    });
  });
});

// ---------------------------------------------------------------------------
// simonReducer
// ---------------------------------------------------------------------------

describe("simonReducer", () => {
  // -----------------------------------------------------------------------
  // START_GAME
  // -----------------------------------------------------------------------
  describe("START_GAME", () => {
    it("resets the state to initial values", () => {
      const dirtyState: SimonGameState = {
        status: "gameover",
        sequence: ["green", "red", "blue"],
        playerIndex: 2,
        score: 5,
        activeColor: "red",
        showIndex: 1,
      };

      const result = simonReducer(dirtyState, { type: "START_GAME" });
      expect(result).toEqual(initialState);
    });

    it("returns a new object (immutability)", () => {
      const result = simonReducer(initialState, { type: "START_GAME" });
      expect(result).not.toBe(initialState);
      expect(result).toEqual(initialState);
    });
  });

  // -----------------------------------------------------------------------
  // EXTEND_SEQUENCE
  // -----------------------------------------------------------------------
  describe("EXTEND_SEQUENCE", () => {
    it("appends the given color to the sequence", () => {
      const result = simonReducer(initialState, {
        type: "EXTEND_SEQUENCE",
        color: "green",
      });

      expect(result.sequence).toEqual(["green"]);
    });

    it("sets status to showing", () => {
      const result = simonReducer(initialState, {
        type: "EXTEND_SEQUENCE",
        color: "red",
      });

      expect(result.status).toBe("showing");
    });

    it("resets showIndex to 0", () => {
      const state: SimonGameState = {
        ...initialState,
        showIndex: 3,
        sequence: ["green", "red"],
      };

      const result = simonReducer(state, {
        type: "EXTEND_SEQUENCE",
        color: "blue",
      });

      expect(result.showIndex).toBe(0);
      expect(result.sequence).toEqual(["green", "red", "blue"]);
    });

    it("does not modify other fields", () => {
      const state: SimonGameState = {
        ...initialState,
        score: 3,
        playerIndex: 1,
      };

      const result = simonReducer(state, {
        type: "EXTEND_SEQUENCE",
        color: "yellow",
      });

      expect(result.score).toBe(3);
      expect(result.playerIndex).toBe(1);
    });
  });

  // -----------------------------------------------------------------------
  // SHOW_STEP
  // -----------------------------------------------------------------------
  describe("SHOW_STEP", () => {
    it("sets activeColor to the current sequence element at showIndex", () => {
      const state: SimonGameState = {
        ...initialState,
        sequence: ["green", "red", "blue"],
        showIndex: 1,
        status: "showing",
      };

      const result = simonReducer(state, { type: "SHOW_STEP" });
      expect(result.activeColor).toBe("red");
    });

    it("increments showIndex by 1", () => {
      const state: SimonGameState = {
        ...initialState,
        sequence: ["green", "red", "blue"],
        showIndex: 0,
        status: "showing",
      };

      const result = simonReducer(state, { type: "SHOW_STEP" });
      expect(result.showIndex).toBe(1);
    });

    it("handles the first step (showIndex 0)", () => {
      const state: SimonGameState = {
        ...initialState,
        sequence: ["yellow"],
        showIndex: 0,
        status: "showing",
      };

      const result = simonReducer(state, { type: "SHOW_STEP" });
      expect(result.activeColor).toBe("yellow");
      expect(result.showIndex).toBe(1);
    });
  });

  // -----------------------------------------------------------------------
  // CLEAR_ACTIVE
  // -----------------------------------------------------------------------
  describe("CLEAR_ACTIVE", () => {
    it("sets activeColor to null", () => {
      const state: SimonGameState = {
        ...initialState,
        activeColor: "green",
      };

      const result = simonReducer(state, { type: "CLEAR_ACTIVE" });
      expect(result.activeColor).toBeNull();
    });

    it("does not modify other fields", () => {
      const state: SimonGameState = {
        ...initialState,
        activeColor: "red",
        score: 5,
        status: "playing",
      };

      const result = simonReducer(state, { type: "CLEAR_ACTIVE" });
      expect(result.score).toBe(5);
      expect(result.status).toBe("playing");
    });
  });

  // -----------------------------------------------------------------------
  // SHOW_COMPLETE
  // -----------------------------------------------------------------------
  describe("SHOW_COMPLETE", () => {
    it("sets activeColor to null", () => {
      const state: SimonGameState = {
        ...initialState,
        activeColor: "blue",
        status: "showing",
      };

      const result = simonReducer(state, { type: "SHOW_COMPLETE" });
      expect(result.activeColor).toBeNull();
    });

    it("sets showIndex to -1", () => {
      const state: SimonGameState = {
        ...initialState,
        showIndex: 3,
        status: "showing",
      };

      const result = simonReducer(state, { type: "SHOW_COMPLETE" });
      expect(result.showIndex).toBe(-1);
    });

    it("resets playerIndex to 0", () => {
      const state: SimonGameState = {
        ...initialState,
        playerIndex: 2,
        status: "showing",
      };

      const result = simonReducer(state, { type: "SHOW_COMPLETE" });
      expect(result.playerIndex).toBe(0);
    });

    it("sets status to playing", () => {
      const state: SimonGameState = {
        ...initialState,
        status: "showing",
      };

      const result = simonReducer(state, { type: "SHOW_COMPLETE" });
      expect(result.status).toBe("playing");
    });
  });

  // -----------------------------------------------------------------------
  // PLAYER_TAP — correct tap
  // -----------------------------------------------------------------------
  describe("PLAYER_TAP (correct)", () => {
    it("sets activeColor to the tapped color", () => {
      const state: SimonGameState = {
        ...initialState,
        sequence: ["green", "red"],
        playerIndex: 0,
        status: "playing",
      };

      const result = simonReducer(state, {
        type: "PLAYER_TAP",
        color: "green",
      });

      expect(result.activeColor).toBe("green");
    });

    it("increments playerIndex", () => {
      const state: SimonGameState = {
        ...initialState,
        sequence: ["green", "red"],
        playerIndex: 0,
        status: "playing",
      };

      const result = simonReducer(state, {
        type: "PLAYER_TAP",
        color: "green",
      });

      expect(result.playerIndex).toBe(1);
    });

    it("does not change status or score for a mid-sequence tap", () => {
      const state: SimonGameState = {
        ...initialState,
        sequence: ["green", "red", "blue"],
        playerIndex: 0,
        status: "playing",
        score: 2,
      };

      const result = simonReducer(state, {
        type: "PLAYER_TAP",
        color: "green",
      });

      expect(result.status).toBe("playing");
      expect(result.score).toBe(2);
    });
  });

  // -----------------------------------------------------------------------
  // PLAYER_TAP — completes the round
  // -----------------------------------------------------------------------
  describe("PLAYER_TAP (round complete)", () => {
    it("increments score when the last color in the sequence is tapped correctly", () => {
      const state: SimonGameState = {
        ...initialState,
        sequence: ["green"],
        playerIndex: 0,
        status: "playing",
        score: 0,
      };

      const result = simonReducer(state, {
        type: "PLAYER_TAP",
        color: "green",
      });

      expect(result.score).toBe(1);
    });

    it("sets status to idle on round completion", () => {
      const state: SimonGameState = {
        ...initialState,
        sequence: ["green", "red"],
        playerIndex: 1,
        status: "playing",
        score: 1,
      };

      const result = simonReducer(state, {
        type: "PLAYER_TAP",
        color: "red",
      });

      expect(result.status).toBe("idle");
      expect(result.score).toBe(2);
    });

    it("handles a longer sequence round completion", () => {
      const state: SimonGameState = {
        ...initialState,
        sequence: ["green", "red", "blue", "yellow"],
        playerIndex: 3,
        status: "playing",
        score: 3,
      };

      const result = simonReducer(state, {
        type: "PLAYER_TAP",
        color: "yellow",
      });

      expect(result.status).toBe("idle");
      expect(result.score).toBe(4);
      expect(result.playerIndex).toBe(4);
    });
  });

  // -----------------------------------------------------------------------
  // PLAYER_TAP — wrong color
  // -----------------------------------------------------------------------
  describe("PLAYER_TAP (incorrect)", () => {
    it("sets status to gameover when wrong color is tapped", () => {
      const state: SimonGameState = {
        ...initialState,
        sequence: ["green", "red"],
        playerIndex: 0,
        status: "playing",
        score: 1,
      };

      const result = simonReducer(state, {
        type: "PLAYER_TAP",
        color: "blue",
      });

      expect(result.status).toBe("gameover");
    });

    it("preserves the score on gameover", () => {
      const state: SimonGameState = {
        ...initialState,
        sequence: ["green"],
        playerIndex: 0,
        status: "playing",
        score: 5,
      };

      const result = simonReducer(state, {
        type: "PLAYER_TAP",
        color: "red",
      });

      expect(result.status).toBe("gameover");
      expect(result.score).toBe(5);
    });

    it("does not modify playerIndex on incorrect tap", () => {
      const state: SimonGameState = {
        ...initialState,
        sequence: ["green", "red"],
        playerIndex: 1,
        status: "playing",
      };

      const result = simonReducer(state, {
        type: "PLAYER_TAP",
        color: "blue",
      });

      expect(result.playerIndex).toBe(1);
    });
  });

  // -----------------------------------------------------------------------
  // ROUND_COMPLETE
  // -----------------------------------------------------------------------
  describe("ROUND_COMPLETE", () => {
    it("returns the same state (no-op)", () => {
      const state: SimonGameState = {
        ...initialState,
        score: 3,
        status: "playing",
      };

      const result = simonReducer(state, { type: "ROUND_COMPLETE" });
      expect(result).toBe(state);
    });
  });

  // -----------------------------------------------------------------------
  // Unknown action (default branch)
  // -----------------------------------------------------------------------
  describe("unknown action", () => {
    it("returns the same state for an unrecognized action type", () => {
      const state: SimonGameState = { ...initialState, score: 2 };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = simonReducer(state, { type: "UNKNOWN" } as any);
      expect(result).toBe(state);
    });
  });

  // -----------------------------------------------------------------------
  // Full game flow integration
  // -----------------------------------------------------------------------
  describe("full game flow", () => {
    it("plays through a complete round", () => {
      // 1. Start game
      let state = simonReducer(initialState, { type: "START_GAME" });
      expect(state.status).toBe("idle");

      // 2. Extend with first color
      state = simonReducer(state, {
        type: "EXTEND_SEQUENCE",
        color: "green",
      });
      expect(state.status).toBe("showing");
      expect(state.sequence).toEqual(["green"]);

      // 3. Show step
      state = simonReducer(state, { type: "SHOW_STEP" });
      expect(state.activeColor).toBe("green");

      // 4. Clear active
      state = simonReducer(state, { type: "CLEAR_ACTIVE" });
      expect(state.activeColor).toBeNull();

      // 5. Show complete
      state = simonReducer(state, { type: "SHOW_COMPLETE" });
      expect(state.status).toBe("playing");

      // 6. Player taps correctly
      state = simonReducer(state, {
        type: "PLAYER_TAP",
        color: "green",
      });
      expect(state.score).toBe(1);
      expect(state.status).toBe("idle");

      // 7. Next round: extend
      state = simonReducer(state, {
        type: "EXTEND_SEQUENCE",
        color: "red",
      });
      expect(state.sequence).toEqual(["green", "red"]);
      expect(state.status).toBe("showing");
    });

    it("plays through multiple rounds then game over", () => {
      let state = simonReducer(initialState, { type: "START_GAME" });

      // Round 1: [green]
      state = simonReducer(state, {
        type: "EXTEND_SEQUENCE",
        color: "green",
      });
      state = simonReducer(state, { type: "SHOW_STEP" });
      state = simonReducer(state, { type: "CLEAR_ACTIVE" });
      state = simonReducer(state, { type: "SHOW_COMPLETE" });
      state = simonReducer(state, {
        type: "PLAYER_TAP",
        color: "green",
      });
      expect(state.score).toBe(1);

      // Round 2: [green, red]
      state = simonReducer(state, {
        type: "EXTEND_SEQUENCE",
        color: "red",
      });
      state = simonReducer(state, { type: "SHOW_STEP" });
      state = simonReducer(state, { type: "CLEAR_ACTIVE" });
      state = simonReducer(state, { type: "SHOW_STEP" });
      state = simonReducer(state, { type: "CLEAR_ACTIVE" });
      state = simonReducer(state, { type: "SHOW_COMPLETE" });
      state = simonReducer(state, {
        type: "PLAYER_TAP",
        color: "green",
      });
      state = simonReducer(state, {
        type: "PLAYER_TAP",
        color: "red",
      });
      expect(state.score).toBe(2);

      // Round 3: [green, red, blue] - player fails on second step
      state = simonReducer(state, {
        type: "EXTEND_SEQUENCE",
        color: "blue",
      });
      state = simonReducer(state, { type: "SHOW_STEP" });
      state = simonReducer(state, { type: "CLEAR_ACTIVE" });
      state = simonReducer(state, { type: "SHOW_STEP" });
      state = simonReducer(state, { type: "CLEAR_ACTIVE" });
      state = simonReducer(state, { type: "SHOW_STEP" });
      state = simonReducer(state, { type: "CLEAR_ACTIVE" });
      state = simonReducer(state, { type: "SHOW_COMPLETE" });
      state = simonReducer(state, {
        type: "PLAYER_TAP",
        color: "green",
      });
      // Wrong color on second tap
      state = simonReducer(state, {
        type: "PLAYER_TAP",
        color: "yellow",
      });
      expect(state.status).toBe("gameover");
      expect(state.score).toBe(2);
    });
  });
});
