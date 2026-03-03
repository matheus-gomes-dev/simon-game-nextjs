import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GameHistoryTable from "@/components/history/GameHistoryTable";
import type { GameHistoryItem } from "@/types/game";

const mockGames: GameHistoryItem[] = [
  {
    id: "1",
    score: 10,
    duration: 45,
    createdAt: "2026-03-01T14:30:00.000Z",
  },
  {
    id: "2",
    score: 5,
    duration: 125,
    createdAt: "2026-03-02T10:15:00.000Z",
  },
  {
    id: "3",
    score: 15,
    duration: 60,
    createdAt: "2026-02-28T09:00:00.000Z",
  },
];

describe("GameHistoryTable", () => {
  it("renders table with correct column headers", () => {
    const onSort = vi.fn();
    render(
      <GameHistoryTable games={mockGames} sortBy="date" sortDirection="desc" onSort={onSort} />
    );

    expect(screen.getByText(/^Date/)).toBeTruthy();
    expect(screen.getByText(/^Score/)).toBeTruthy();
    expect(screen.getByText("Duration")).toBeTruthy();
  });

  it("renders the correct number of rows", () => {
    const onSort = vi.fn();
    render(
      <GameHistoryTable games={mockGames} sortBy="date" sortDirection="desc" onSort={onSort} />
    );

    const rows = screen.getAllByRole("row");
    // 1 header row + 3 data rows
    expect(rows).toHaveLength(4);
  });

  it("displays score and duration for each game", () => {
    const onSort = vi.fn();
    render(
      <GameHistoryTable games={mockGames} sortBy="date" sortDirection="desc" onSort={onSort} />
    );

    expect(screen.getByText("10")).toBeTruthy();
    expect(screen.getByText("5")).toBeTruthy();
    expect(screen.getByText("15")).toBeTruthy();
    // Duration: 45s, 2m 5s, 1m
    expect(screen.getByText("45s")).toBeTruthy();
    expect(screen.getByText("2m 5s")).toBeTruthy();
    expect(screen.getByText("1m")).toBeTruthy();
  });

  it("calls onSort with 'date' when Date header is clicked", () => {
    const onSort = vi.fn();
    render(
      <GameHistoryTable games={mockGames} sortBy="score" sortDirection="desc" onSort={onSort} />
    );

    fireEvent.click(screen.getByText("Date"));
    expect(onSort).toHaveBeenCalledWith("date");
  });

  it("calls onSort with 'score' when Score header is clicked", () => {
    const onSort = vi.fn();
    render(
      <GameHistoryTable games={mockGames} sortBy="date" sortDirection="desc" onSort={onSort} />
    );

    fireEvent.click(screen.getByText(/^Score/));
    expect(onSort).toHaveBeenCalledWith("score");
  });

  it("sets aria-sort descending on active column", () => {
    const onSort = vi.fn();
    render(
      <GameHistoryTable games={mockGames} sortBy="date" sortDirection="desc" onSort={onSort} />
    );

    const dateHeader = screen.getByText(/^Date/).closest("th");
    expect(dateHeader?.getAttribute("aria-sort")).toBe("descending");

    const scoreHeader = screen.getByText(/^Score/).closest("th");
    expect(scoreHeader?.getAttribute("aria-sort")).toBe("none");
  });

  it("sets aria-sort ascending on active column", () => {
    const onSort = vi.fn();
    render(
      <GameHistoryTable games={mockGames} sortBy="score" sortDirection="asc" onSort={onSort} />
    );

    const scoreHeader = screen.getByText(/^Score/).closest("th");
    expect(scoreHeader?.getAttribute("aria-sort")).toBe("ascending");
  });

  it("calls onSort when Enter is pressed on sortable header", () => {
    const onSort = vi.fn();
    render(
      <GameHistoryTable games={mockGames} sortBy="date" sortDirection="desc" onSort={onSort} />
    );

    const dateHeader = screen.getByText(/^Date/).closest("th")!;
    fireEvent.keyDown(dateHeader, { key: "Enter" });
    expect(onSort).toHaveBeenCalledWith("date");
  });

  it("calls onSort when Space is pressed on sortable header", () => {
    const onSort = vi.fn();
    render(
      <GameHistoryTable games={mockGames} sortBy="date" sortDirection="desc" onSort={onSort} />
    );

    const scoreHeader = screen.getByText(/^Score/).closest("th")!;
    fireEvent.keyDown(scoreHeader, { key: " " });
    expect(onSort).toHaveBeenCalledWith("score");
  });

  it("renders empty table body when no games", () => {
    const onSort = vi.fn();
    render(
      <GameHistoryTable games={[]} sortBy="date" sortDirection="desc" onSort={onSort} />
    );

    const rows = screen.getAllByRole("row");
    // Only header row
    expect(rows).toHaveLength(1);
  });
});
