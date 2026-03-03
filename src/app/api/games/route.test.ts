import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

// Mock dependencies
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/mongoose", () => ({
  default: vi.fn(),
}));

vi.mock("@/models/GameSession", () => ({
  default: {
    create: vi.fn(),
  },
}));

vi.mock("@/models/User", () => ({
  default: {
    findOneAndUpdate: vi.fn(),
  },
}));

import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import GameSession from "@/models/GameSession";
import User from "@/models/User";

describe("POST /api/games", () => {
  const validRequestBody = {
    score: 5,
    sequence: ["green", "red", "yellow", "blue"],
    startedAt: "2026-03-03T10:00:00.000Z",
    endedAt: "2026-03-03T10:05:30.000Z",
    duration: 330,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when user is not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const request = new Request("http://localhost/api/games", {
      method: "POST",
      body: JSON.stringify(validRequestBody),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.errors.form).toBeDefined();
    expect(data.errors.form[0]).toContain("Authentication required");
  });

  it("returns 401 when session has no user id", async () => {
    vi.mocked(auth).mockResolvedValue({ user: {} } as never);

    const request = new Request("http://localhost/api/games", {
      method: "POST",
      body: JSON.stringify(validRequestBody),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.errors.form[0]).toContain("Authentication required");
  });

  it("returns 400 when request body is invalid JSON", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user123" },
    } as never);

    const request = new Request("http://localhost/api/games", {
      method: "POST",
      body: "not-json",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.errors.form).toBeDefined();
    expect(data.errors.form[0]).toContain("Invalid request body");
  });

  it("returns 400 when validation fails (negative score)", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user123" },
    } as never);

    const request = new Request("http://localhost/api/games", {
      method: "POST",
      body: JSON.stringify({ ...validRequestBody, score: -1 }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.errors.score).toBeDefined();
  });

  it("returns 400 when validation fails (invalid color)", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user123" },
    } as never);

    const request = new Request("http://localhost/api/games", {
      method: "POST",
      body: JSON.stringify({
        ...validRequestBody,
        sequence: ["green", "purple"],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.errors.sequence).toBeDefined();
  });

  it("returns 400 when validation fails (missing field)", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user123" },
    } as never);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { score, ...incomplete } = validRequestBody;
    const request = new Request("http://localhost/api/games", {
      method: "POST",
      body: JSON.stringify(incomplete),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.errors.score).toBeDefined();
  });

  it("returns 201 and saves game session successfully", async () => {
    const userId = "user123";
    vi.mocked(auth).mockResolvedValue({
      user: { id: userId },
    } as never);
    vi.mocked(dbConnect).mockResolvedValue(undefined as never);
    vi.mocked(GameSession.create).mockResolvedValue({
      _id: "game456",
      userId,
      ...validRequestBody,
    } as never);
    vi.mocked(User.findOneAndUpdate).mockResolvedValue(null);

    const request = new Request("http://localhost/api/games", {
      method: "POST",
      body: JSON.stringify(validRequestBody),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toBe("game456");
    expect(GameSession.create).toHaveBeenCalledWith({
      userId,
      score: validRequestBody.score,
      sequence: validRequestBody.sequence,
      startedAt: expect.any(Date),
      endedAt: expect.any(Date),
      duration: validRequestBody.duration,
    });
    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: userId },
      {
        $inc: { gamesPlayed: 1 },
        $max: { highestScore: validRequestBody.score },
      }
    );
  });

  it("updates user stats with correct score", async () => {
    const userId = "user123";
    const highScore = 10;
    vi.mocked(auth).mockResolvedValue({
      user: { id: userId },
    } as never);
    vi.mocked(dbConnect).mockResolvedValue(undefined as never);
    vi.mocked(GameSession.create).mockResolvedValue({
      _id: "game789",
      userId,
      ...validRequestBody,
    } as never);
    vi.mocked(User.findOneAndUpdate).mockResolvedValue(null);

    const request = new Request("http://localhost/api/games", {
      method: "POST",
      body: JSON.stringify({ ...validRequestBody, score: highScore }),
    });

    await POST(request);

    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: userId },
      {
        $inc: { gamesPlayed: 1 },
        $max: { highestScore: highScore },
      }
    );
  });

  it("returns 500 when database operation fails", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user123" },
    } as never);
    vi.mocked(dbConnect).mockResolvedValue(undefined as never);
    vi.mocked(GameSession.create).mockRejectedValue(
      new Error("Database error")
    );

    const request = new Request("http://localhost/api/games", {
      method: "POST",
      body: JSON.stringify(validRequestBody),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.errors.form).toBeDefined();
    expect(data.errors.form[0]).toContain("unexpected error");
  });

  it("calls dbConnect before creating game session", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "user123" },
    } as never);
    vi.mocked(dbConnect).mockResolvedValue(undefined as never);
    vi.mocked(GameSession.create).mockResolvedValue({
      _id: "game111",
    } as never);
    vi.mocked(User.findOneAndUpdate).mockResolvedValue(null);

    const request = new Request("http://localhost/api/games", {
      method: "POST",
      body: JSON.stringify(validRequestBody),
    });

    await POST(request);

    expect(dbConnect).toHaveBeenCalled();
  });
});
