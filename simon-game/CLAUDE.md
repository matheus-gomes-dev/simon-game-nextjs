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
