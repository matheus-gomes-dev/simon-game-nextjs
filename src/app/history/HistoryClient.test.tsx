import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HistoryClient from "./HistoryClient";
import type { GameHistoryItem } from "@/types/game";

const mockGames: GameHistoryItem[] = [
  { id: "1", score: 10, duration: 45, createdAt: "2026-03-01T14:30:00.000Z" },
  { id: "2", score: 5, duration: 125, createdAt: "2026-03-02T10:15:00.000Z" },
  { id: "3", score: 15, duration: 60, createdAt: "2026-02-28T09:00:00.000Z" },
];

const fetchMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = fetchMock;
});

describe("HistoryClient", () => {
  it("shows loading spinner initially", () => {
    fetchMock.mockReturnValue(new Promise(() => {})); // never resolves
    render(<HistoryClient />);
    expect(document.querySelector(".animate-spin")).toBeTruthy();
  });

  it("renders game table after successful fetch", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ games: mockGames }),
    });

    render(<HistoryClient />);

    await waitFor(() => {
      expect(screen.getByText("10")).toBeTruthy();
    });

    expect(screen.getByText("5")).toBeTruthy();
    expect(screen.getByText("15")).toBeTruthy();
  });

  it("renders error message with retry button on fetch failure", async () => {
    fetchMock.mockResolvedValue({ ok: false });

    render(<HistoryClient />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load game history.")).toBeTruthy();
    });

    expect(screen.getByText("Try Again")).toBeTruthy();
  });

  it("retries fetch when Try Again is clicked", async () => {
    fetchMock
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ games: mockGames }),
      });

    render(<HistoryClient />);

    await waitFor(() => {
      expect(screen.getByText("Try Again")).toBeTruthy();
    });

    fireEvent.click(screen.getByText("Try Again"));

    await waitFor(() => {
      expect(screen.getByText("10")).toBeTruthy();
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("renders empty state with link to /play when no games", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ games: [] }),
    });

    render(<HistoryClient />);

    await waitFor(() => {
      expect(screen.getByText("Play your first game")).toBeTruthy();
    });

    const playLink = screen.getByText("Play your first game");
    expect(playLink.closest("a")?.getAttribute("href")).toBe("/play");
    expect(screen.getByText(/No games yet/)).toBeTruthy();
  });

  it("sorts by date descending by default", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ games: mockGames }),
    });

    render(<HistoryClient />);

    await waitFor(() => {
      expect(screen.getAllByRole("row")).toHaveLength(4);
    });

    const dateHeader = screen.getByText(/^Date/).closest("th");
    expect(dateHeader?.getAttribute("aria-sort")).toBe("descending");
  });

  it("toggles sort direction when clicking same column", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ games: mockGames }),
    });

    render(<HistoryClient />);

    await waitFor(() => {
      expect(screen.getAllByRole("row")).toHaveLength(4);
    });

    // Click Date header to toggle from desc to asc
    fireEvent.click(screen.getByText(/^Date/).closest("th")!);

    const dateHeader = screen.getByText(/^Date/).closest("th");
    expect(dateHeader?.getAttribute("aria-sort")).toBe("ascending");
  });

  it("switches to score sort when clicking Score column", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ games: mockGames }),
    });

    render(<HistoryClient />);

    await waitFor(() => {
      expect(screen.getAllByRole("row")).toHaveLength(4);
    });

    // Click Score header
    fireEvent.click(screen.getByText(/^Score/).closest("th")!);

    const scoreHeader = screen.getByText(/^Score/).closest("th");
    expect(scoreHeader?.getAttribute("aria-sort")).toBe("descending");

    const dateHeader = screen.getByText(/^Date/).closest("th");
    expect(dateHeader?.getAttribute("aria-sort")).toBe("none");
  });
});
