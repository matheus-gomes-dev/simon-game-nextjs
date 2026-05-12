# ADR-002: Data Model Design

**Status:** Accepted
**Date:** 2025-02-12

## Context

The Simon game has a small but critical data model. We need to represent:

1. **Colors** — the four buttons the player interacts with.
2. **Game state** — what phase the game is in at any moment.
3. **Sequence** — the growing list of colors the player must memorize.
4. **Player progress** — where the player is within the current sequence.

The model must support these interactions:
- Generating and extending a random sequence
- Playing back the sequence with timed animations
- Validating player input one press at a time
- Tracking score and transitioning between game phases

We need to decide where this state lives (global store, component state, custom hook) and how it's structured.

## Decision

### Type Definitions (`src/types/game.ts`)

Two union types define the entire domain:

```typescript
type SimonColor = "green" | "red" | "yellow" | "blue";
type GameStatus = "idle" | "playing" | "showing" | "gameover";
```

### State Shape (inside `useSimonGame` hook)

All game state is co-located in a single custom hook with five pieces of state:

| State | Type | Purpose |
|---|---|---|
| `sequence` | `SimonColor[]` | The full color sequence for the current game |
| `playerIndex` | `number` | Which position in `sequence` the player is currently on |
| `status` | `GameStatus` | Current game phase |
| `activeColor` | `SimonColor \| null` | Which button is currently lit up (for animations) |
| `score` | `number` | Number of rounds completed successfully |

A `useRef<NodeJS.Timeout[]>` holds references to animation timeouts for cleanup.

### State Management Approach

- **Custom hook (`useSimonGame`)** owns all state and exposes only two actions (`startGame`, `handleColorPress`) plus three read values (`status`, `score`, `activeColor`).
- **No external state library** (Redux, Zustand, Context). React's built-in `useState` is sufficient.
- **Components are stateless.** `SimonBoard`, `SimonButton`, and `GameControls` receive everything via props.

### Rationale

**String union types over enums or constants:**
- `SimonColor` and `GameStatus` as string unions provide exhaustive type checking without runtime overhead.
- They work naturally in switch statements, comparisons, and as Record keys.
- Easier to read than numeric enums — `status === "playing"` is self-explanatory.

**Flat state over nested objects:**
- Five independent `useState` calls are simpler than a single reducer with a nested state object.
- Each piece of state updates independently — no need for immutable spread patterns on nested structures.
- The game logic is small enough that `useCallback` dependencies are manageable.

**Custom hook over Context or global store:**
- The game is a single-page, single-instance application. There is no need to share state across distant components.
- A custom hook provides encapsulation — components cannot directly mutate the sequence or status.
- Testing is straightforward: render a component that calls the hook.

**`activeColor` as separate state over a `Map` or highlighting array:**
- Only one button is ever lit at a time (during sequence playback) or one button is briefly highlighted (during player input).
- A single `SimonColor | null` is the simplest correct representation.

**`playerIndex` counter over filtering/slicing:**
- Comparing `sequence[playerIndex]` with the pressed color is O(1).
- Incrementing a counter is simpler than maintaining a shrinking "remaining" array.

## Consequences

### Positive
- **Minimal surface area:** Two types and five state variables describe the entire game. Easy to understand at a glance.
- **Type safety:** It's impossible to set `status` to an invalid value or put an invalid color in the sequence — TypeScript enforces this at compile time.
- **Encapsulation:** Components only see `status`, `score`, and `activeColor`. The sequence and playerIndex are internal implementation details.
- **No dependencies:** No state management library to install, learn, or maintain.

### Negative
- **No persistence:** State is entirely in-memory. Closing the tab loses everything. (Story 8 addresses this with `localStorage` for high scores.)
- **No undo/replay:** Without a reducer or event log, there's no built-in way to replay a game or step backward. This is acceptable — the game doesn't need it.
- **Timeout management:** Animation timing relies on `setTimeout` chains stored in a ref. This works but is harder to test than a declarative animation model.

### Risks
- If the game grows to need more complex state interactions (multiplayer, difficulty settings, sound state), the flat `useState` approach may need to evolve into a `useReducer` or a small state machine. The current hook boundary makes this refactor contained.
- The `sequence` array grows unboundedly. For practical gameplay this is not an issue (a 100-round game would be extraordinary), but if persistence is added, a maximum length should be considered.
