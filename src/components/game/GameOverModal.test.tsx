import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GameOverModal from "@/components/game/GameOverModal";

describe("GameOverModal", () => {
  it("renders the Game Over title", () => {
    render(<GameOverModal score={5} onPlayAgain={vi.fn()} />);
    expect(screen.getByText("Game Over!")).toBeTruthy();
  });

  it("displays the final score", () => {
    render(<GameOverModal score={7} onPlayAgain={vi.fn()} />);
    expect(screen.getByText("7")).toBeTruthy();
    expect(screen.getByText(/Final Score:/)).toBeTruthy();
  });

  it("renders the Play Again button", () => {
    render(<GameOverModal score={3} onPlayAgain={vi.fn()} />);
    expect(screen.getByText("Play Again")).toBeTruthy();
  });

  it("calls onPlayAgain when the Play Again button is clicked", () => {
    const onPlayAgain = vi.fn();
    render(<GameOverModal score={3} onPlayAgain={onPlayAgain} />);

    fireEvent.click(screen.getByText("Play Again"));
    expect(onPlayAgain).toHaveBeenCalledTimes(1);
  });

  it("renders with backdrop blur overlay", () => {
    const { container } = render(
      <GameOverModal score={3} onPlayAgain={vi.fn()} />
    );

    const overlay = container.firstElementChild as HTMLElement;
    expect(overlay.className).toContain("backdrop-blur");
    expect(overlay.className).toContain("fixed");
    expect(overlay.className).toContain("inset-0");
  });

  it("displays the correct score value", () => {
    render(<GameOverModal score={42} onPlayAgain={vi.fn()} />);
    expect(screen.getByText("42")).toBeTruthy();
  });

  it("displays score 0 correctly", () => {
    render(<GameOverModal score={0} onPlayAgain={vi.fn()} />);
    expect(screen.getByText("0")).toBeTruthy();
  });

  it("has animation classes on the overlay", () => {
    const { container } = render(
      <GameOverModal score={1} onPlayAgain={vi.fn()} />
    );

    const overlay = container.firstElementChild as HTMLElement;
    expect(overlay.className).toContain("animate-");
  });
});
