import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTopPlayers } from "./leaderboard";

vi.mock("@/lib/mongoose", () => ({
  default: vi.fn(),
}));

vi.mock("@/models/User", () => {
  const mockLean = vi.fn();
  const mockSelect = vi.fn(() => ({ lean: mockLean }));
  const mockLimit = vi.fn(() => ({ select: mockSelect }));
  const mockSort = vi.fn(() => ({ limit: mockLimit }));
  const mockFind = vi.fn(() => ({ sort: mockSort }));

  return {
    default: {
      find: mockFind,
    },
    __mocks: { mockFind, mockSort, mockLimit, mockSelect, mockLean },
  };
});

import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { __mocks } = await import("@/models/User") as any;
const { mockFind, mockSort, mockLimit, mockSelect, mockLean } = __mocks;

describe("getTopPlayers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Re-chain the mocks for each test
    mockFind.mockReturnValue({ sort: mockSort });
    mockSort.mockReturnValue({ limit: mockLimit });
    mockLimit.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ lean: mockLean });
  });

  it("connects to the database before querying", async () => {
    mockLean.mockResolvedValue([]);

    await getTopPlayers();

    expect(dbConnect).toHaveBeenCalled();
  });

  it("queries users with highestScore > 0 sorted descending", async () => {
    mockLean.mockResolvedValue([]);

    await getTopPlayers();

    expect(User.find).toHaveBeenCalledWith({ highestScore: { $gt: 0 } });
    expect(mockSort).toHaveBeenCalledWith({ highestScore: -1 });
  });

  it("limits results to the specified count", async () => {
    mockLean.mockResolvedValue([]);

    await getTopPlayers(5);

    expect(mockLimit).toHaveBeenCalledWith(5);
  });

  it("defaults to 10 results", async () => {
    mockLean.mockResolvedValue([]);

    await getTopPlayers();

    expect(mockLimit).toHaveBeenCalledWith(10);
  });

  it("selects only username and highestScore fields", async () => {
    mockLean.mockResolvedValue([]);

    await getTopPlayers();

    expect(mockSelect).toHaveBeenCalledWith("username highestScore");
  });

  it("maps results to LeaderboardEntry format with ranks", async () => {
    mockLean.mockResolvedValue([
      { username: "alice", highestScore: 15 },
      { username: "bob", highestScore: 12 },
    ]);

    const result = await getTopPlayers();

    expect(result).toEqual([
      { rank: 1, username: "alice", highestScore: 15 },
      { rank: 2, username: "bob", highestScore: 12 },
    ]);
  });

  it("returns empty array when no users have scores", async () => {
    mockLean.mockResolvedValue([]);

    const result = await getTopPlayers();

    expect(result).toEqual([]);
  });
});
