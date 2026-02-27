# ADR-005: Denormalized highestScore on User model

## Status

Accepted

## Date

2026-02-26

## Context

The leaderboard page displays a ranked list of users by their highest score. This is a public, read-heavy page that is expected to be one of the most frequently accessed views in the application.

There are two approaches to produce this ranking:

1. **Compute on read.** Run a MongoDB aggregation pipeline on the `game_sessions` collection: group by `userId`, compute `$max` of `score`, sort descending, and join with the `users` collection for display names. This is the normalized approach.
2. **Denormalize on write.** Store a `highestScore` field directly on the `users` document. Update it whenever a game session is saved and the new score exceeds the current highest. The leaderboard query becomes a simple `find().sort({ highestScore: -1 }).limit(N)`.

The `game_sessions` collection will grow over time as users play more games. The leaderboard is rendered as a Server Component and is requested by every visitor, authenticated or not.

## Decision

We will store a **denormalized `highestScore` field on the `users` collection**, indexed with `{ highestScore: -1 }`. When a game session is saved via `POST /api/games`, the route handler compares the new score to the user's current `highestScore` and updates it if the new score is higher.

The leaderboard query is:
```
db.users.find({}).sort({ highestScore: -1 }).limit(50)
```

## Consequences

### Positive

- **Fast leaderboard queries.** A single indexed query on the `users` collection returns the leaderboard in O(log n) time, regardless of how many game sessions exist. No aggregation pipeline, no `$lookup`, no cross-collection joins.
- **Scalable with game volume.** As the `game_sessions` collection grows to thousands or millions of documents, the leaderboard query performance remains constant. The aggregation approach would degrade as the collection grows.
- **Simple caching.** The leaderboard result is a straightforward query that can be cached at the Next.js page level (ISR or `revalidate`) or in an application cache without worrying about stale aggregation results.
- **Reduced database load.** The leaderboard page is public and read-heavy. Avoiding an aggregation pipeline on every request keeps MongoDB CPU and memory usage low.

### Negative

- **Write-time overhead.** Every game save requires a conditional update to the `users` collection (`$max` or compare-and-set). This adds one extra database operation per game save. For the expected write volume (tens of games per minute), this is negligible.
- **Potential data inconsistency.** If the update to `highestScore` fails after the game session is saved (e.g., network error between the two writes), the user's highest score will be stale. There is no transaction wrapping both operations.
- **Harder to recompute.** If the scoring logic changes or a bug corrupts `highestScore` values, recomputing requires scanning all `game_sessions` grouped by user. This is a batch operation, not a real-time concern, but it must be planned for.

### Risks

- **Score deletion or modification.** If an admin feature is added to delete fraudulent game sessions, the `highestScore` must be recomputed for affected users. Without automation, this is easy to forget.
- **Multiple score dimensions.** If the leaderboard evolves to support multiple ranking criteria (e.g., longest streak, fastest reaction time), each dimension would need its own denormalized field, increasing write complexity.

**Mitigation:** Implement a utility script or admin endpoint that recomputes `highestScore` for all users from the `game_sessions` collection. Run it periodically or on demand as a data integrity check.
