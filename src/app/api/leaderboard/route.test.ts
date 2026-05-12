import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";

vi.mock("@/lib/leaderboard", () => ({
  getTopPlayers: vi.fn(),
}));

import { getTopPlayers } from "@/lib/leaderboard";

describe("GET /api/leaderboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with leaderboard entries", async () => {
    const mockEntries = [
      { rank: 1, username: "alice", highestScore: 15 },
      { rank: 2, username: "bob", highestScore: 12 },
    ];
    vi.mocked(getTopPlayers).mockResolvedValue(mockEntries);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.leaderboard).toEqual(mockEntries);
    expect(getTopPlayers).toHaveBeenCalledWith(10);
  });

  it("returns 200 with empty array when no scores exist", async () => {
    vi.mocked(getTopPlayers).mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.leaderboard).toEqual([]);
  });

  it("returns Cache-Control header for caching", async () => {
    vi.mocked(getTopPlayers).mockResolvedValue([]);

    const response = await GET();

    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=60, stale-while-revalidate=30"
    );
  });

  it("returns 500 when database operation fails", async () => {
    vi.mocked(getTopPlayers).mockRejectedValue(new Error("Database error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.errors.form).toBeDefined();
    expect(data.errors.form[0]).toContain("unexpected error");
  });
});
