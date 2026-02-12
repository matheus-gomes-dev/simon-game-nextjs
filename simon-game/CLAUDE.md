# CLAUDE.md - Simon Game

## Project Overview

A browser-based Simon memory game. Players watch a sequence of colored flashes and must repeat the sequence. Each successful round adds one more color to the sequence.

## Tech Stack

- Next.js 16 with App Router
- TypeScript (strict mode)
- Tailwind CSS 4
- React 19

## Project Structure

```
src/
  app/
    layout.tsx       # Root layout with metadata and fonts
    page.tsx         # Main page, renders the game (client component)
    globals.css      # Global styles / Tailwind imports
  components/
    SimonBoard.tsx   # 2x2 grid of colored buttons
    SimonButton.tsx  # Individual colored button with active/inactive states
    GameControls.tsx # Start button, score display, status messages
  hooks/
    useSimonGame.ts  # Core game logic: sequence generation, validation, state
  types/
    game.ts          # Shared types: SimonColor, GameStatus
```

## Key Patterns

- **Client components**: The game is fully client-side. `page.tsx` and all components use `"use client"`.
- **Game state hook**: All game logic lives in `useSimonGame`. Components are purely presentational.
- **Four colors**: green (top-left), red (top-right), yellow (bottom-left), blue (bottom-right).
- **Game states**: `idle` (waiting to start), `showing` (playing sequence animation), `playing` (waiting for player input), `gameover` (wrong input).

## Commands

```bash
npm run dev    # Start dev server on http://localhost:3000
npm run build  # Production build
npm run lint   # Run ESLint
```

## Code Conventions

- Use `@/` path alias for imports from `src/`
- Tailwind utility classes for all styling (no CSS modules)
- Functional components with TypeScript interfaces for props
- Game logic separated from rendering via custom hooks

## User Stories

### Story 1: Start a New Game
**As a** player, **I can** click a "Start Game" button **so that** a new round begins and the first color sequence is shown.

| Detail | Value |
|---|---|
| **Complexity** | S |
| **Dependencies** | None |

**Acceptance Criteria:**
1. A "Start Game" button is visible when the game is idle
2. Clicking it transitions the game to the "showing" state and plays a 1-color sequence
3. The button is disabled/hidden while a sequence is playing
4. The score resets to 0 on a new game

---

### Story 2: Watch the Color Sequence
**As a** player, **I can** watch the board light up a sequence of colors **so that** I know which pattern to repeat.

| Detail | Value |
|---|---|
| **Complexity** | M |
| **Dependencies** | Story 1 |

**Acceptance Criteria:**
1. Each color in the sequence lights up (glow effect) one at a time
2. There is a visible pause (~300ms) between each color flash
3. Each flash lasts long enough to be clearly seen (~600ms)
4. The player cannot click buttons while the sequence is playing
5. After the sequence finishes, the game transitions to "playing" state

---

### Story 3: Repeat the Sequence
**As a** player, **I can** click the colored buttons to repeat the shown sequence **so that** I can prove I memorized it and advance to the next round.

| Detail | Value |
|---|---|
| **Complexity** | M |
| **Dependencies** | Story 2 |

**Acceptance Criteria:**
1. Clicking a button provides immediate visual feedback (brief glow)
2. If the player clicks the correct color, the game accepts it and waits for the next input
3. After completing the full sequence correctly, a new color is appended and the next round begins
4. If the player clicks the wrong color, the game transitions to "game over"

---

### Story 4: See My Current Score
**As a** player, **I can** see my current score (sequence length) during gameplay **so that** I know how far I've progressed.

| Detail | Value |
|---|---|
| **Complexity** | S |
| **Dependencies** | Story 1 |

**Acceptance Criteria:**
1. The current score is displayed on screen during active gameplay
2. The score increments by 1 each time a round is completed successfully
3. A status message reflects the current game state (e.g., "Watch carefully!", "Your turn!", "Game Over!")

---

### Story 5: Restart After Game Over
**As a** player, **I can** start a new game after losing **so that** I can try again without refreshing the page.

| Detail | Value |
|---|---|
| **Complexity** | S |
| **Dependencies** | Story 3 |

**Acceptance Criteria:**
1. When the game is over, a "Play Again" button is shown
2. Clicking it resets the sequence, score, and game state
3. A new round starts immediately after clicking
4. The previous score is no longer displayed (replaced by the new score of 0)

---

### Story 6: Responsive Board Layout
**As a** player, **I can** play the game on both mobile and desktop screens **so that** the experience works regardless of device.

| Detail | Value |
|---|---|
| **Complexity** | S |
| **Dependencies** | None |

**Acceptance Criteria:**
1. The 4-color board renders as a 2x2 grid on all screen sizes
2. Buttons scale appropriately (smaller on mobile, larger on desktop)
3. Controls and score are accessible without horizontal scrolling
4. Buttons are large enough to tap comfortably on a touch screen

---

### Story 7: Add Sound Effects
**As a** player, **I can** hear a distinct tone for each color button **so that** I get audio feedback that reinforces the visual pattern.

| Detail | Value |
|---|---|
| **Complexity** | M |
| **Dependencies** | Story 2, Story 3 |

**Acceptance Criteria:**
1. Each of the 4 colors plays a unique tone when activated
2. Tones play during both the sequence playback and the player's input
3. A distinct "error" sound plays on game over
4. Sound does not block or delay the game animation timing

---

### Story 8: Persist High Score
**As a** player, **I can** see my all-time high score across sessions **so that** I have a goal to beat.

| Detail | Value |
|---|---|
| **Complexity** | S |
| **Dependencies** | Story 4 |

**Acceptance Criteria:**
1. The highest score achieved is saved to `localStorage`
2. The high score is displayed alongside the current score
3. The high score updates immediately when the player surpasses it
4. The high score persists after closing and reopening the browser

---

### Story Dependency Graph

```
Story 1 (Start Game)
  ├── Story 2 (Watch Sequence)
  │     └── Story 3 (Repeat Sequence)
  │           ├── Story 5 (Restart)
  │           └── Story 7 (Sound Effects)
  ├── Story 4 (Score Display)
  │     └── Story 8 (High Score)
  └── Story 6 (Responsive Layout)  [independent]
```

> **Note:** Stories 1–6 represent the core gameplay loop and are already implemented. Stories 7 and 8 are natural next enhancements — realistic in scope for a training project without over-engineering.
