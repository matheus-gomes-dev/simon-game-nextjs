import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GameControls from "@/components/game/GameControls";

describe("GameControls", () => {
  describe("idle state with score 0 (initial)", () => {
    it("shows the Start Game button", () => {
      render(
        <GameControls score={0} status="idle" onStart={vi.fn()} />
      );

      expect(screen.getByText("Start Game")).toBeTruthy();
    });

    it("does not show score", () => {
      render(
        <GameControls score={0} status="idle" onStart={vi.fn()} />
      );

      expect(screen.queryByText(/Score:/)).toBeNull();
    });

    it("calls onStart when Start Game is clicked", () => {
      const onStart = vi.fn();
      render(
        <GameControls score={0} status="idle" onStart={onStart} />
      );

      fireEvent.click(screen.getByText("Start Game"));
      expect(onStart).toHaveBeenCalledTimes(1);
    });
  });

  describe("idle state with score > 0 (between rounds)", () => {
    it("does not show the Start Game button", () => {
      render(
        <GameControls score={3} status="idle" onStart={vi.fn()} />
      );

      expect(screen.queryByText("Start Game")).toBeNull();
    });

    it("shows the score with get ready message", () => {
      render(
        <GameControls score={3} status="idle" onStart={vi.fn()} />
      );

      expect(screen.getByText(/Score: 3/)).toBeTruthy();
      expect(screen.getByText(/Get ready/)).toBeTruthy();
    });
  });

  describe("showing state", () => {
    it("shows the score", () => {
      render(
        <GameControls score={2} status="showing" onStart={vi.fn()} />
      );

      expect(screen.getByText("Score: 2")).toBeTruthy();
    });

    it("shows Watch carefully status text", () => {
      render(
        <GameControls score={1} status="showing" onStart={vi.fn()} />
      );

      expect(screen.getByText("Watch carefully...")).toBeTruthy();
    });

    it("does not show the start button", () => {
      render(
        <GameControls score={1} status="showing" onStart={vi.fn()} />
      );

      expect(screen.queryByText("Start Game")).toBeNull();
      expect(screen.queryByText("Play Again")).toBeNull();
    });
  });

  describe("playing state", () => {
    it("shows the score", () => {
      render(
        <GameControls score={5} status="playing" onStart={vi.fn()} />
      );

      expect(screen.getByText("Score: 5")).toBeTruthy();
    });

    it("shows Your turn status text", () => {
      render(
        <GameControls score={5} status="playing" onStart={vi.fn()} />
      );

      expect(screen.getByText("Your turn!")).toBeTruthy();
    });

    it("does not show the start button", () => {
      render(
        <GameControls score={5} status="playing" onStart={vi.fn()} />
      );

      expect(screen.queryByText("Start Game")).toBeNull();
    });
  });

  describe("gameover state", () => {
    it("shows the Play Again button", () => {
      render(
        <GameControls score={3} status="gameover" onStart={vi.fn()} />
      );

      expect(screen.getByText("Play Again")).toBeTruthy();
    });

    it("calls onStart when Play Again is clicked", () => {
      const onStart = vi.fn();
      render(
        <GameControls score={3} status="gameover" onStart={onStart} />
      );

      fireEvent.click(screen.getByText("Play Again"));
      expect(onStart).toHaveBeenCalledTimes(1);
    });

    it("does not show score display during gameover", () => {
      render(
        <GameControls score={3} status="gameover" onStart={vi.fn()} />
      );

      expect(screen.queryByText("Your turn!")).toBeNull();
      expect(screen.queryByText("Watch carefully...")).toBeNull();
    });
  });
});
