# ADR-004: useReducer for game state management

## Status

Accepted

## Date

2026-02-26

## Context

The Simon Game has complex client-side state with multiple interdependent fields and well-defined state transitions:

- **State fields:** current sequence, player input progress, score, game status (`idle`, `playing`, `showing`, `gameover`), active button highlight, and speed/timing.
- **Transitions:** Starting a game, extending the sequence, showing the sequence to the player, accepting player input, validating each tap, advancing rounds, and ending the game on failure.

These transitions involve updating multiple state fields atomically. For example, when a player taps the wrong button, the game must simultaneously set the status to `gameover`, record the final score, and stop the sequence playback.

We considered three approaches:

1. **Multiple `useState` hooks.** Simple but leads to scattered state updates and potential inconsistencies between related fields.
2. **`useReducer` in a custom hook.** Centralizes all state transitions in a single reducer function, dispatched by action type.
3. **Global state manager (Redux, Zustand).** Provides a global store with middleware, devtools, and cross-component state sharing.

## Decision

We will manage all game state with **`useReducer`** inside a custom hook (`src/hooks/useSimonGame.ts`). The reducer defines explicit action types for each game transition, and the hook exposes a clean API to the component tree.

The game state is local to the `/play` page and its child components. No other page or feature needs access to the in-progress game state.

## Consequences

### Positive

- **Predictable state transitions.** Each action type (`START_GAME`, `EXTEND_SEQUENCE`, `PLAYER_TAP`, `GAME_OVER`, etc.) maps to a pure function that produces the next state. This makes transitions easy to reason about and test in isolation.
- **Atomic multi-field updates.** A single dispatch updates all related fields together, eliminating the class of bugs where `score` is updated but `status` is not, or vice versa.
- **No external dependencies.** `useReducer` is a built-in React hook. There is no library to install, no provider to wrap the app in, and no additional bundle size.
- **Encapsulation via custom hook.** The `useSimonGame` hook hides the reducer internals and exposes only the methods and state that components need (e.g., `startGame()`, `handleTap(color)`, `state.score`). Components remain simple and declarative.
- **Testability.** The reducer is a pure function: given a state and an action, it returns the next state. Unit tests can verify every transition without rendering components or mocking timers.

### Negative

- **Boilerplate.** Defining action types, the reducer switch/case, and the hook API involves more code than a few `useState` calls. For a game with only four or five state fields this might feel over-engineered initially.
- **No built-in devtools.** Unlike Redux or Zustand, `useReducer` has no time-travel debugging or action logging out of the box. Debugging requires `console.log` in the reducer or React DevTools inspection.
- **Local scope only.** If a future feature (e.g., a persistent sidebar showing the current score) needs access to game state from outside the `/play` page tree, the state would need to be lifted or migrated to a context/global store.

### Risks

- **Complexity creep.** If the game logic grows significantly (e.g., multiplayer, power-ups, difficulty modes), the reducer may become large and unwieldy. At that point, splitting into multiple reducers or adopting a state machine library (XState) may be warranted.

**Mitigation:** Keep the reducer focused on game state transitions only. Side effects (sound playback, API calls to save the game) are handled in the hook's `useEffect` blocks or callback functions, not inside the reducer.
