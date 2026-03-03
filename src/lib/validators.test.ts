import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema, saveGameSchema } from "@/lib/validators";

describe("registerSchema", () => {
  const validInput = {
    username: "player_one",
    email: "player@example.com",
    password: "securepass123",
  };

  it("accepts valid input", () => {
    const result = registerSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("accepts username with underscores", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      username: "player_one_2",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing username", () => {
    const result = registerSchema.safeParse({
      email: validInput.email,
      password: validInput.password,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.username).toBeDefined();
      expect(errors.username!.length).toBeGreaterThan(0);
    }
  });

  it("rejects missing email", () => {
    const result = registerSchema.safeParse({
      username: validInput.username,
      password: validInput.password,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.email).toBeDefined();
      expect(errors.email!.length).toBeGreaterThan(0);
    }
  });

  it("rejects missing password", () => {
    const result = registerSchema.safeParse({
      username: validInput.username,
      email: validInput.email,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.password).toBeDefined();
      expect(errors.password!.length).toBeGreaterThan(0);
    }
  });

  it("rejects invalid email format", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.email).toBeDefined();
      expect(errors.email![0]).toContain("valid email");
    }
  });

  it("rejects password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      password: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.password).toBeDefined();
      expect(errors.password![0]).toContain("at least 8");
    }
  });

  it("rejects username shorter than 3 characters", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      username: "ab",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.username).toBeDefined();
      expect(errors.username![0]).toContain("at least 3");
    }
  });

  it("rejects username longer than 20 characters", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      username: "a".repeat(21),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.username).toBeDefined();
      expect(errors.username![0]).toContain("at most 20");
    }
  });

  it("rejects username with special characters", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      username: "player@one!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.username).toBeDefined();
      expect(errors.username![0]).toContain("letters, numbers, and underscores");
    }
  });

  it("rejects username with spaces", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      username: "player one",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.username).toBeDefined();
    }
  });

  it("accepts exactly 3-character username", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      username: "abc",
    });
    expect(result.success).toBe(true);
  });

  it("accepts exactly 20-character username", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      username: "a".repeat(20),
    });
    expect(result.success).toBe(true);
  });

  it("accepts exactly 8-character password", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      password: "12345678",
    });
    expect(result.success).toBe(true);
  });

  it("rejects password longer than 72 characters", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      password: "a".repeat(73),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.password).toBeDefined();
      expect(errors.password![0]).toContain("at most 72");
    }
  });

  it("accepts exactly 72-character password", () => {
    const result = registerSchema.safeParse({
      ...validInput,
      password: "a".repeat(72),
    });
    expect(result.success).toBe(true);
  });
});

describe("loginSchema", () => {
  const validInput = {
    email: "player@example.com",
    password: "mypassword",
  };

  it("accepts valid input", () => {
    const result = loginSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("accepts a single-character password", () => {
    const result = loginSchema.safeParse({
      ...validInput,
      password: "x",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing email", () => {
    const result = loginSchema.safeParse({ password: validInput.password });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.email).toBeDefined();
      expect(errors.email!.length).toBeGreaterThan(0);
    }
  });

  it("rejects missing password", () => {
    const result = loginSchema.safeParse({ email: validInput.email });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.password).toBeDefined();
      expect(errors.password!.length).toBeGreaterThan(0);
    }
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      ...validInput,
      password: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.password).toBeDefined();
      expect(errors.password![0]).toContain("required");
    }
  });

  it("rejects invalid email format", () => {
    const result = loginSchema.safeParse({
      ...validInput,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.email).toBeDefined();
      expect(errors.email![0]).toContain("valid email");
    }
  });

  it("rejects empty email", () => {
    const result = loginSchema.safeParse({
      ...validInput,
      email: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.email).toBeDefined();
    }
  });
});

describe("saveGameSchema", () => {
  const validInput = {
    score: 5,
    sequence: ["green", "red", "yellow", "blue"],
    startedAt: "2026-03-03T10:00:00.000Z",
    endedAt: "2026-03-03T10:05:30.000Z",
    duration: 330,
  };

  it("accepts valid input", () => {
    const result = saveGameSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("accepts score of 0", () => {
    const result = saveGameSchema.safeParse({
      ...validInput,
      score: 0,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative score", () => {
    const result = saveGameSchema.safeParse({
      ...validInput,
      score: -1,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.score).toBeDefined();
      expect(errors.score![0]).toContain("non-negative");
    }
  });

  it("rejects invalid color string", () => {
    const result = saveGameSchema.safeParse({
      ...validInput,
      sequence: ["green", "purple", "yellow"],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.sequence).toBeDefined();
    }
  });

  it("rejects empty sequence array", () => {
    const result = saveGameSchema.safeParse({
      ...validInput,
      sequence: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.sequence).toBeDefined();
      expect(errors.sequence![0]).toContain("at least one");
    }
  });

  it("rejects missing score", () => {
    const result = saveGameSchema.safeParse({
      sequence: validInput.sequence,
      startedAt: validInput.startedAt,
      endedAt: validInput.endedAt,
      duration: validInput.duration,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.score).toBeDefined();
    }
  });

  it("rejects missing sequence", () => {
    const result = saveGameSchema.safeParse({
      score: validInput.score,
      startedAt: validInput.startedAt,
      endedAt: validInput.endedAt,
      duration: validInput.duration,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.sequence).toBeDefined();
    }
  });

  it("rejects missing startedAt", () => {
    const result = saveGameSchema.safeParse({
      score: validInput.score,
      sequence: validInput.sequence,
      endedAt: validInput.endedAt,
      duration: validInput.duration,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.startedAt).toBeDefined();
    }
  });

  it("rejects missing endedAt", () => {
    const result = saveGameSchema.safeParse({
      score: validInput.score,
      sequence: validInput.sequence,
      startedAt: validInput.startedAt,
      duration: validInput.duration,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.endedAt).toBeDefined();
    }
  });

  it("rejects missing duration", () => {
    const result = saveGameSchema.safeParse({
      score: validInput.score,
      sequence: validInput.sequence,
      startedAt: validInput.startedAt,
      endedAt: validInput.endedAt,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.duration).toBeDefined();
    }
  });

  it("rejects negative duration", () => {
    const result = saveGameSchema.safeParse({
      ...validInput,
      duration: -10,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.duration).toBeDefined();
      expect(errors.duration![0]).toContain("non-negative");
    }
  });

  it("rejects invalid datetime format for startedAt", () => {
    const result = saveGameSchema.safeParse({
      ...validInput,
      startedAt: "not-a-date",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.startedAt).toBeDefined();
    }
  });

  it("rejects invalid datetime format for endedAt", () => {
    const result = saveGameSchema.safeParse({
      ...validInput,
      endedAt: "not-a-date",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.endedAt).toBeDefined();
    }
  });

  it("accepts all valid SimonColor values", () => {
    const validColors = ["green", "red", "yellow", "blue"];
    const result = saveGameSchema.safeParse({
      ...validInput,
      sequence: validColors,
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-integer score", () => {
    const result = saveGameSchema.safeParse({
      ...validInput,
      score: 5.5,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.score).toBeDefined();
    }
  });

  it("rejects score exceeding maximum", () => {
    const result = saveGameSchema.safeParse({
      ...validInput,
      score: 1001,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.score).toBeDefined();
      expect(errors.score![0]).toContain("maximum");
    }
  });

  it("accepts score at maximum boundary", () => {
    const result = saveGameSchema.safeParse({
      ...validInput,
      score: 1000,
    });
    expect(result.success).toBe(true);
  });

  it("rejects sequence exceeding maximum length", () => {
    const longSequence = Array(1002).fill("green");
    const result = saveGameSchema.safeParse({
      ...validInput,
      sequence: longSequence,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.sequence).toBeDefined();
      expect(errors.sequence![0]).toContain("too long");
    }
  });

  it("rejects endedAt before startedAt", () => {
    const result = saveGameSchema.safeParse({
      ...validInput,
      startedAt: "2026-03-03T10:05:00.000Z",
      endedAt: "2026-03-03T10:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  it("rejects endedAt equal to startedAt", () => {
    const result = saveGameSchema.safeParse({
      ...validInput,
      startedAt: "2026-03-03T10:00:00.000Z",
      endedAt: "2026-03-03T10:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });
});
