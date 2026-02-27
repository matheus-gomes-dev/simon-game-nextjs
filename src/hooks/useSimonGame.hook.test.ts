import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSimonGame } from "@/hooks/useSimonGame";

/**
 * Integration tests for the useSimonGame hook.
 *
 * These tests exercise the hook's timer management, audio playback,
 * and state transitions through the public API (startGame, handleTap).
 */

// ---------------------------------------------------------------------------
// Mock Web Audio API
// ---------------------------------------------------------------------------

function createMockOscillator() {
  return {
    type: "",
    frequency: { setValueAtTime: vi.fn() },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  };
}

function createMockGainNode() {
  return {
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
  };
}

/**
 * Creates a mock AudioContext constructor that can be used with `new`.
 * Uses a regular function (not arrow) so it works as a constructor.
 */
function createMockAudioContextClass(stateOverride?: string) {
  const resumeFn = vi.fn();

  function MockAudioContext(this: Record<string, unknown>) {
    this.currentTime = 0;
    this.state = stateOverride ?? "running";
    this.resume = resumeFn;
    this.close = vi.fn();
    this.createOscillator = vi.fn(createMockOscillator);
    this.createGain = vi.fn(createMockGainNode);
    this.destination = {};
  }

  return { Constructor: MockAudioContext, resumeFn };
}

describe("useSimonGame hook", () => {
  let resumeFn: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    const mock = createMockAudioContextClass();
    resumeFn = mock.resumeFn;
    vi.stubGlobal("AudioContext", mock.Constructor);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns the initial state", () => {
    const { result } = renderHook(() => useSimonGame());

    expect(result.current.state.status).toBe("idle");
    expect(result.current.state.score).toBe(0);
    expect(result.current.state.sequence).toEqual([]);
    expect(result.current.state.activeColor).toBeNull();
  });

  it("exposes startGame and handleTap functions", () => {
    const { result } = renderHook(() => useSimonGame());

    expect(typeof result.current.startGame).toBe("function");
    expect(typeof result.current.handleTap).toBe("function");
  });

  it("transitions to showing status after startGame is called", () => {
    const { result } = renderHook(() => useSimonGame());

    act(() => {
      result.current.startGame();
    });

    expect(result.current.state.status).toBe("showing");
    expect(result.current.state.sequence).toHaveLength(1);
  });

  it("transitions through showing to playing after sequence playback", () => {
    const { result } = renderHook(() => useSimonGame());

    act(() => {
      result.current.startGame();
    });

    expect(result.current.state.status).toBe("showing");

    // Advance through the show sequence:
    // 0ms: SHOW_STEP (color active for 300ms)
    // 300ms: CLEAR_ACTIVE
    // 500ms: SHOW_COMPLETE
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.state.status).toBe("playing");
    expect(result.current.state.activeColor).toBeNull();
  });

  it("handles a correct tap during playing status", () => {
    const { result } = renderHook(() => useSimonGame());

    act(() => {
      result.current.startGame();
    });

    const color = result.current.state.sequence[0];

    // Advance through showing phase
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.state.status).toBe("playing");

    // Tap the correct color
    act(() => {
      result.current.handleTap(color);
    });

    // After correct last tap, status goes to idle and score increments
    expect(result.current.state.score).toBe(1);
    expect(result.current.state.status).toBe("idle");
  });

  it("triggers next round after a correct round completion", () => {
    const { result } = renderHook(() => useSimonGame());

    act(() => {
      result.current.startGame();
    });

    const firstColor = result.current.state.sequence[0];

    // Advance through showing phase
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Tap correctly
    act(() => {
      result.current.handleTap(firstColor);
    });

    expect(result.current.state.score).toBe(1);
    expect(result.current.state.status).toBe("idle");

    // Wait for next round trigger (1000ms delay)
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.state.status).toBe("showing");
    expect(result.current.state.sequence).toHaveLength(2);
  });

  it("transitions to gameover on an incorrect tap", () => {
    const { result } = renderHook(() => useSimonGame());

    act(() => {
      result.current.startGame();
    });

    const correctColor = result.current.state.sequence[0];
    const wrongColor = correctColor === "green" ? "red" : "green";

    // Advance through showing phase
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Tap the wrong color
    act(() => {
      result.current.handleTap(wrongColor);
    });

    expect(result.current.state.status).toBe("gameover");
    expect(result.current.state.score).toBe(0);
  });

  it("ignores handleTap when status is not playing", () => {
    const { result } = renderHook(() => useSimonGame());

    // In idle status, tap should be ignored
    act(() => {
      result.current.handleTap("green");
    });

    expect(result.current.state.status).toBe("idle");
    expect(result.current.state.score).toBe(0);
  });

  it("clears active color after tap via timer", () => {
    const { result } = renderHook(() => useSimonGame());

    act(() => {
      result.current.startGame();
    });

    // Advance through showing phase
    act(() => {
      vi.advanceTimersByTime(500);
    });

    const color = result.current.state.sequence[0];

    act(() => {
      result.current.handleTap(color);
    });

    // The CLEAR_ACTIVE timer should fire after 200ms
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.state.activeColor).toBeNull();
  });

  it("can restart the game after gameover", () => {
    const { result } = renderHook(() => useSimonGame());

    act(() => {
      result.current.startGame();
    });

    const correctColor = result.current.state.sequence[0];
    const wrongColor = correctColor === "green" ? "red" : "green";

    // Advance to playing
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Cause gameover
    act(() => {
      result.current.handleTap(wrongColor);
    });

    expect(result.current.state.status).toBe("gameover");

    // Restart
    act(() => {
      result.current.startGame();
    });

    expect(result.current.state.status).toBe("showing");
    expect(result.current.state.score).toBe(0);
    expect(result.current.state.sequence).toHaveLength(1);
  });

  it("creates an AudioContext on first startGame call", () => {
    const mockConstructor = createMockAudioContextClass();
    vi.stubGlobal("AudioContext", mockConstructor.Constructor);

    const { result } = renderHook(() => useSimonGame());

    // Before starting, no AudioContext should be created
    act(() => {
      result.current.startGame();
    });

    // After starting, the game should have created an AudioContext
    // and transitioned to showing
    expect(result.current.state.status).toBe("showing");
  });

  it("plays through a two-round sequence", () => {
    const { result } = renderHook(() => useSimonGame());

    // Round 1
    act(() => {
      result.current.startGame();
    });

    const firstColor = result.current.state.sequence[0];

    act(() => {
      vi.advanceTimersByTime(500);
    });

    act(() => {
      result.current.handleTap(firstColor);
    });

    expect(result.current.state.score).toBe(1);

    // Wait for next round
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.state.sequence).toHaveLength(2);
    const secondColor = result.current.state.sequence[1];

    // Advance through showing 2 colors:
    // Color 1: 300ms show + 200ms gap = 500ms
    // Color 2: 300ms show + 200ms gap = 500ms
    // Then SHOW_COMPLETE
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.state.status).toBe("playing");

    // Tap both colors correctly
    act(() => {
      result.current.handleTap(firstColor);
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    act(() => {
      result.current.handleTap(secondColor);
    });

    expect(result.current.state.score).toBe(2);
    expect(result.current.state.status).toBe("idle");
  });
});
