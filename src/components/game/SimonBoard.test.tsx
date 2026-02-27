import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SimonBoard from "@/components/game/SimonBoard";

describe("SimonBoard", () => {
  it("renders four buttons for the four colors", () => {
    render(
      <SimonBoard activeColor={null} status="idle" onTap={vi.fn()} />
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);
  });

  it("renders buttons with correct aria-labels", () => {
    render(
      <SimonBoard activeColor={null} status="playing" onTap={vi.fn()} />
    );

    expect(screen.getByLabelText("green pad")).toBeTruthy();
    expect(screen.getByLabelText("red pad")).toBeTruthy();
    expect(screen.getByLabelText("yellow pad")).toBeTruthy();
    expect(screen.getByLabelText("blue pad")).toBeTruthy();
  });

  it("passes activeColor correctly to highlight the right button", () => {
    render(
      <SimonBoard activeColor="red" status="showing" onTap={vi.fn()} />
    );

    const redButton = screen.getByLabelText("red pad");
    expect(redButton.className).toContain("bg-red-400");

    const greenButton = screen.getByLabelText("green pad");
    expect(greenButton.className).toContain("bg-green-700");
  });

  it("disables all buttons when status is not playing", () => {
    render(
      <SimonBoard activeColor={null} status="showing" onTap={vi.fn()} />
    );

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect((button as HTMLButtonElement).disabled).toBe(true);
    });
  });

  it("enables all buttons when status is playing", () => {
    render(
      <SimonBoard activeColor={null} status="playing" onTap={vi.fn()} />
    );

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect((button as HTMLButtonElement).disabled).toBe(false);
    });
  });

  it("calls onTap with the correct color when a button is clicked", () => {
    const onTap = vi.fn();
    render(
      <SimonBoard activeColor={null} status="playing" onTap={onTap} />
    );

    fireEvent.click(screen.getByLabelText("blue pad"));
    expect(onTap).toHaveBeenCalledWith("blue");

    fireEvent.click(screen.getByLabelText("green pad"));
    expect(onTap).toHaveBeenCalledWith("green");
  });

  it("applies pointer-events-none when status is not playing", () => {
    const { container } = render(
      <SimonBoard activeColor={null} status="idle" onTap={vi.fn()} />
    );

    const grid = container.firstElementChild as HTMLElement;
    expect(grid.className).toContain("pointer-events-none");
  });

  it("does not apply pointer-events-none when status is playing", () => {
    const { container } = render(
      <SimonBoard activeColor={null} status="playing" onTap={vi.fn()} />
    );

    const grid = container.firstElementChild as HTMLElement;
    expect(grid.className).not.toContain("pointer-events-none");
  });

  it("renders with a 2-column grid layout", () => {
    const { container } = render(
      <SimonBoard activeColor={null} status="playing" onTap={vi.fn()} />
    );

    const grid = container.firstElementChild as HTMLElement;
    expect(grid.className).toContain("grid");
    expect(grid.className).toContain("grid-cols-2");
    expect(grid.className).toContain("gap-4");
  });
});
