import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GameOverModal from "@/components/game/GameOverModal";

describe("GameOverModal", () => {
  it("renders the Game Over title", () => {
    render(<GameOverModal score={5} onPlayAgain={vi.fn()} isAuthenticated={true} />);
    expect(screen.getByText("Game Over!")).toBeTruthy();
  });

  it("displays the final score", () => {
    render(<GameOverModal score={7} onPlayAgain={vi.fn()} isAuthenticated={true} />);
    expect(screen.getByText("7")).toBeTruthy();
    expect(screen.getByText(/Final Score:/)).toBeTruthy();
  });

  it("renders the Play Again button", () => {
    render(<GameOverModal score={3} onPlayAgain={vi.fn()} isAuthenticated={true} />);
    expect(screen.getByText("Play Again")).toBeTruthy();
  });

  it("calls onPlayAgain when the Play Again button is clicked", () => {
    const onPlayAgain = vi.fn();
    render(<GameOverModal score={3} onPlayAgain={onPlayAgain} isAuthenticated={true} />);

    fireEvent.click(screen.getByText("Play Again"));
    expect(onPlayAgain).toHaveBeenCalledTimes(1);
  });

  it("renders with backdrop blur overlay", () => {
    const { container } = render(
      <GameOverModal score={3} onPlayAgain={vi.fn()} isAuthenticated={true} />
    );

    const overlay = container.firstElementChild as HTMLElement;
    expect(overlay.className).toContain("backdrop-blur");
    expect(overlay.className).toContain("fixed");
    expect(overlay.className).toContain("inset-0");
  });

  it("displays the correct score value", () => {
    render(<GameOverModal score={42} onPlayAgain={vi.fn()} isAuthenticated={true} />);
    expect(screen.getByText("42")).toBeTruthy();
  });

  it("displays score 0 correctly", () => {
    render(<GameOverModal score={0} onPlayAgain={vi.fn()} isAuthenticated={true} />);
    expect(screen.getByText("0")).toBeTruthy();
  });

  it("has animation classes on the overlay", () => {
    const { container } = render(
      <GameOverModal score={1} onPlayAgain={vi.fn()} isAuthenticated={true} />
    );

    const overlay = container.firstElementChild as HTMLElement;
    expect(overlay.className).toContain("animate-");
  });

  it("renders 'Saving score...' when saveStatus is 'saving'", () => {
    render(
      <GameOverModal score={5} onPlayAgain={vi.fn()} isAuthenticated={true} saveStatus="saving" />
    );
    expect(screen.getByText("Saving score...")).toBeTruthy();
  });

  it("disables Play Again button when saveStatus is 'saving'", () => {
    render(
      <GameOverModal score={5} onPlayAgain={vi.fn()} isAuthenticated={true} saveStatus="saving" />
    );
    const button = screen.getByText("Play Again") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("renders 'Score saved!' when saveStatus is 'saved'", () => {
    render(
      <GameOverModal score={5} onPlayAgain={vi.fn()} isAuthenticated={true} saveStatus="saved" />
    );
    expect(screen.getByText("Score saved!")).toBeTruthy();
  });

  it("renders error message when saveStatus is 'error'", () => {
    const errorMessage = "Failed to save game";
    render(
      <GameOverModal
        score={5}
        onPlayAgain={vi.fn()}
        isAuthenticated={true}
        saveStatus="error"
        saveError={errorMessage}
      />
    );
    expect(screen.getByText(errorMessage)).toBeTruthy();
  });

  it("does not render 'Score saved!' when there is an error", () => {
    render(
      <GameOverModal
        score={5}
        onPlayAgain={vi.fn()}
        isAuthenticated={true}
        saveStatus="error"
        saveError="Error occurred"
      />
    );
    expect(screen.queryByText("Score saved!")).toBeNull();
  });

  it("does not render 'Saving score...' when saveStatus is not 'saving'", () => {
    render(
      <GameOverModal score={5} onPlayAgain={vi.fn()} isAuthenticated={true} saveStatus="saved" />
    );
    expect(screen.queryByText("Saving score...")).toBeNull();
  });

  it("renders Play Again button as enabled when not saving", () => {
    render(
      <GameOverModal score={5} onPlayAgain={vi.fn()} isAuthenticated={true} saveStatus="saved" />
    );
    const button = screen.getByText("Play Again") as HTMLButtonElement;
    expect(button.disabled).toBe(false);
  });

  it("does not show any save status when saveStatus is not provided", () => {
    render(<GameOverModal score={5} onPlayAgain={vi.fn()} isAuthenticated={true} />);
    expect(screen.queryByText("Score saved!")).toBeNull();
    expect(screen.queryByText("Saving score...")).toBeNull();
    const button = screen.getByText("Play Again") as HTMLButtonElement;
    expect(button.disabled).toBe(false);
  });

  it("does not show any save status when saveStatus is 'idle'", () => {
    render(
      <GameOverModal score={5} onPlayAgain={vi.fn()} isAuthenticated={true} saveStatus="idle" />
    );
    expect(screen.queryByText("Score saved!")).toBeNull();
    expect(screen.queryByText("Saving score...")).toBeNull();
  });

  it("shows guest prompt with login and register links when not authenticated", () => {
    render(<GameOverModal score={5} onPlayAgain={vi.fn()} isAuthenticated={false} />);
    expect(screen.getByText(/sign in to save your scores/i)).toBeTruthy();
    expect(screen.getByRole("link", { name: /log in/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /register/i })).toBeTruthy();
  });

  it("does not show save status messages for guest users", () => {
    render(<GameOverModal score={5} onPlayAgain={vi.fn()} isAuthenticated={false} saveStatus="saved" />);
    expect(screen.queryByText("Score saved!")).toBeNull();
    expect(screen.queryByText("Saving score...")).toBeNull();
  });

  it("does not show guest prompt for authenticated users", () => {
    render(<GameOverModal score={5} onPlayAgain={vi.fn()} isAuthenticated={true} />);
    expect(screen.queryByText(/sign in to save your scores/i)).toBeNull();
  });
});
