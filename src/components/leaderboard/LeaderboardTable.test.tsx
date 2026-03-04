import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LeaderboardTable from "./LeaderboardTable";
import type { LeaderboardEntry } from "@/types/game";

describe("LeaderboardTable", () => {
  const mockEntries: LeaderboardEntry[] = [
    { rank: 1, username: "alice", highestScore: 15 },
    { rank: 2, username: "bob", highestScore: 12 },
    { rank: 3, username: "charlie", highestScore: 10 },
    { rank: 4, username: "diana", highestScore: 8 },
  ];

  it("renders all leaderboard entries", () => {
    render(<LeaderboardTable entries={mockEntries} />);

    expect(screen.getByText("alice")).toBeTruthy();
    expect(screen.getByText("bob")).toBeTruthy();
    expect(screen.getByText("charlie")).toBeTruthy();
    expect(screen.getByText("diana")).toBeTruthy();
  });

  it("displays scores for each entry", () => {
    render(<LeaderboardTable entries={mockEntries} />);

    expect(screen.getByText("15")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
    expect(screen.getByText("10")).toBeTruthy();
    expect(screen.getByText("8")).toBeTruthy();
  });

  it("shows medal emojis for top 3 ranks", () => {
    render(<LeaderboardTable entries={mockEntries} />);

    const rows = screen.getAllByRole("row");
    // row 0 is header, rows 1-4 are data
    expect(rows[1].textContent).toContain("🥇");
    expect(rows[2].textContent).toContain("🥈");
    expect(rows[3].textContent).toContain("🥉");
  });

  it("shows numeric rank for positions beyond 3rd", () => {
    render(<LeaderboardTable entries={mockEntries} />);

    const rows = screen.getAllByRole("row");
    expect(rows[4].textContent).toContain("4");
    expect(rows[4].textContent).not.toContain("🥇");
    expect(rows[4].textContent).not.toContain("🥈");
    expect(rows[4].textContent).not.toContain("🥉");
  });

  it("shows empty state message when no entries", () => {
    render(<LeaderboardTable entries={[]} />);

    expect(
      screen.getByText("No scores yet. Be the first to play!")
    ).toBeTruthy();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("renders table headers correctly", () => {
    render(<LeaderboardTable entries={mockEntries} />);

    expect(screen.getByText("Rank")).toBeTruthy();
    expect(screen.getByText("Player")).toBeTruthy();
    expect(screen.getByText("Score")).toBeTruthy();
  });
});
