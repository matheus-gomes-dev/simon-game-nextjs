import { describe, it, expect } from "vitest";
import { registerSchema } from "@/lib/validators";

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
