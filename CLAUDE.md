# Simon Game — Project Guide

## Overview

Classic Simon memory game built as a web application. Users must register and log in to play. Authenticated users get score persistence, game history, and leaderboard eligibility.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5 (strict mode)
- **UI:** React 19, Tailwind CSS 4
- **Database:** MongoDB + Mongoose
- **Auth:** Auth.js v5 (Credentials provider, JWT sessions)
- **Validation:** Zod

## Project Structure

```
src/
  app/
    api/auth/[...nextauth]/route.ts   — Auth.js route handler
    api/register/route.ts             — User registration
    api/games/route.ts                — POST save game, GET user history
    api/games/[id]/route.ts           — GET specific game
    api/leaderboard/route.ts          — GET top scores (public)
    login/page.tsx
    register/page.tsx
    play/page.tsx                     — Game page (protected)
    history/page.tsx                  — User's past games (protected)
    leaderboard/page.tsx              — Global leaderboard (public)
    layout.tsx
    page.tsx                          — Landing page
    globals.css
  components/
    game/        — SimonBoard, SimonButton, GameControls, GameOverModal
    auth/        — LoginForm, RegisterForm
    ui/          — Navbar, LoadingSpinner
    history/     — GameHistoryTable
    leaderboard/ — LeaderboardTable
  hooks/
    useSimonGame.ts                   — Core game logic (useReducer)
  lib/
    mongodb.ts                        — Native MongoClient (Auth.js adapter)
    mongoose.ts                       — Cached Mongoose connection
    validators.ts                     — Zod schemas
  models/
    User.ts                           — User schema (extends Auth.js)
    GameSession.ts                    — Game session schema
  types/
    game.ts                           — SimonColor, GameStatus, SimonGameState
    next-auth.d.ts                    — Auth.js type extensions
  auth.ts                             — Auth.js configuration
```

## Database Schema

### `users` collection
```typescript
{
  _id: ObjectId
  name: string
  email: string          // unique index
  username: string       // unique index
  passwordHash: string   // bcrypt, cost 12
  highestScore: number   // denormalized for leaderboard
  gamesPlayed: number
  createdAt: Date
  updatedAt: Date
}
```

### `game_sessions` collection
```typescript
{
  _id: ObjectId
  userId: ObjectId       // indexed, references users
  score: number
  sequence: string[]     // full color sequence
  startedAt: Date
  endedAt: Date
  duration: number       // seconds
  createdAt: Date
}
```

### Indexes
- `users`: `{ email: 1 }` unique, `{ username: 1 }` unique, `{ highestScore: -1 }`
- `game_sessions`: `{ userId: 1, createdAt: -1 }`, `{ score: -1 }`

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth | Auth.js v5 + Credentials + JWT | Native Next.js integration, MongoDB adapter |
| ODM | Mongoose | Schema validation, TypeScript types |
| State | `useReducer` in custom hook | Game transitions are complex, no global store needed |
| Leaderboard | Denormalized `highestScore` on User | Read-heavy query, avoids aggregation |
| API style | Route Handlers | REST semantics, easier to test than Server Actions |
| Validation | Zod | TypeScript-first, composable schemas |
| Rendering | Leaderboard = Server Component, Game = Client Component | Match interactivity needs |

## Implementation Phases

### Phase 1 — Foundation
Next.js project init + fully playable client-side Simon Game (no auth, no DB).

### Phase 2 — Database + Authentication
MongoDB connections, Auth.js v5 config, registration/login pages, protected routes.

### Phase 3 — Game Persistence
Save game sessions to MongoDB for authenticated users, track high scores, server-side sequence validation.

### Phase 4 — History + Leaderboard
Paginated game history for authenticated users, public server-rendered leaderboard.

### Phase 5 — Polish
Loading states, responsive design, rate limiting, accessibility.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run lint      # Run ESLint
```

## Environment Variables

```
MONGODB_URI=      # MongoDB connection string
AUTH_SECRET=      # Auth.js secret (min 32 chars)
AUTH_URL=         # App URL (http://localhost:3000 in dev)
```

## Git Workflow

- **PR target branch:** `certification-delivery` (NOT `master`)
- **Feature branches:** `feat/us-{id}-{short-description}` (e.g., `feat/us-2-register-account`)
- **Commit prefix:** `feat:`, `fix:`, `refactor:`, `test:`, `docs:`
- **Commit footer:** Include `AB#{workItemId}` to link Azure DevOps work items

## Agent Preference

- **Local-level agents should be used before user-level agents whenever possible.** When delegating work to sub-agents, prefer project-scoped (local) agents over user-scoped agents to keep context and actions relevant to this repository.

## Conventions

- Path alias: `@/*` maps to `src/*`
- Game types: `SimonColor` = `"green" | "red" | "yellow" | "blue"`, `GameStatus` = `"idle" | "playing" | "showing" | "gameover"`
- Passwords hashed with bcrypt, cost factor 12
- JWT sessions with 7-day expiry
- All API inputs validated with Zod before processing
- Protected routes check `auth()` server-side and redirect to `/login`
- `/play` requires authentication — unauthenticated users are redirected to `/login`
- `/history` and game save APIs require authentication
- **React components must avoid code repetition.** Extract repeated JSX or logic into smaller, reusable sub-components. Break down large components as needed to keep them focused and DRY.
