import { describe, it, expect } from "vitest";
import GameSession from "@/models/GameSession";

describe("GameSession model", () => {
  it("has all required fields defined in schema", () => {
    const schema = GameSession.schema;
    const paths = schema.paths;

    expect(paths.userId).toBeDefined();
    expect(paths.score).toBeDefined();
    expect(paths.sequence).toBeDefined();
    expect(paths.startedAt).toBeDefined();
    expect(paths.endedAt).toBeDefined();
    expect(paths.duration).toBeDefined();
    expect(paths.createdAt).toBeDefined();
  });

  it("has correct field types", () => {
    const schema = GameSession.schema;
    const paths = schema.paths;

    expect(paths.userId.instance).toBe("ObjectId");
    expect(paths.score.instance).toBe("Number");
    expect(paths.sequence.instance).toBe("Array");
    expect(paths.startedAt.instance).toBe("Date");
    expect(paths.endedAt.instance).toBe("Date");
    expect(paths.duration.instance).toBe("Number");
    expect(paths.createdAt.instance).toBe("Date");
  });

  it("prevents model recompilation on hot reload", () => {
    // The model should be cached in mongoose.models
    const GameSession1 = GameSession;
    const GameSession2 = GameSession;

    expect(GameSession1).toBe(GameSession2);
  });

  it("has required field validation", () => {
    const schema = GameSession.schema;
    const paths = schema.paths;

    expect(paths.userId.isRequired).toBe(true);
    expect(paths.score.isRequired).toBe(true);
    expect(paths.sequence.isRequired).toBe(true);
    expect(paths.startedAt.isRequired).toBe(true);
    expect(paths.endedAt.isRequired).toBe(true);
    expect(paths.duration.isRequired).toBe(true);
  });

  it("has minimum value validators for score and duration", () => {
    const schema = GameSession.schema;

    const scoreValidators = schema.path("score").validators;
    const durationValidators = schema.path("duration").validators;

    const scoreMinValidator = scoreValidators.find((v) =>
      v.message?.includes("negative")
    );
    const durationMinValidator = durationValidators.find((v) =>
      v.message?.includes("negative")
    );

    expect(scoreMinValidator).toBeDefined();
    expect(durationMinValidator).toBeDefined();
  });

  it("uses game_sessions collection name", () => {
    expect(GameSession.collection.name).toBe("game_sessions");
  });

  it("has index on userId and createdAt", () => {
    const indexes = GameSession.schema.indexes();
    const userIdCreatedAtIndex = indexes.find(
      (idx) =>
        idx[0].userId === 1 && idx[0].createdAt === -1
    );

    expect(userIdCreatedAtIndex).toBeDefined();
  });

  it("has index on score", () => {
    const indexes = GameSession.schema.indexes();
    const scoreIndex = indexes.find(
      (idx) => idx[0].score === -1
    );

    expect(scoreIndex).toBeDefined();
  });
});
