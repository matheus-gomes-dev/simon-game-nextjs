# Deliverables — Simon Game

## Overview

This document summarizes all Azure DevOps user stories delivered for the Simon Game project. The application is a classic Simon memory game built with Next.js 16, TypeScript, MongoDB, and Auth.js v5.

## User Stories

| US | ADO # | Title | PR # | Phase | Status |
|----|-------|-------|------|-------|--------|
| US-1 | #4242 | Play Simon Game | PR #2787 | 1 — Foundation | Merged |
| US-2 | #4243 | Register an Account | PR #2962 | 2 — Auth | Merged |
| US-3 | #4244 | Log In and Log Out | PR #2979 | 2 — Auth | Merged |
| US-4 | #4245 | Protected Game Page | — | 2 — Auth | Delivered (with US-3) |
| US-5 | #4246 | Save Game Session | PR #2982 | 3 — Persistence | Merged |
| US-6 | #4247 | View Game History | PR #3005 | 4 — History | Merged |
| US-7 | #4248 | View Leaderboard | PR #3018 | 4 — Leaderboard | Merged |
| US-8 | #4249 | Responsive Layout and Loading States | PR #3022 | 5 — Polish | Merged |
| US-9 | #4620 | Navbar UX Enhancements | PR #3023 | 5 — Polish | Merged |

## Phase Breakdown

### Phase 1 — Foundation
- **US-1: Play Simon Game** — Fully playable client-side Simon game with color sequence display, player input, score tracking, and game-over detection.

### Phase 2 — Database + Authentication
- **US-2: Register an Account** — User registration with email/username/password, Zod validation, bcrypt hashing, and MongoDB persistence.
- **US-3: Log In and Log Out** — Auth.js v5 Credentials provider, JWT sessions (7-day expiry), login/logout flows with session management.
- **US-4: Protected Game Page** — Server-side `auth()` checks on `/play`, redirecting unauthenticated users to `/login`. Delivered as part of US-3.

### Phase 3 — Game Persistence
- **US-5: Save Game Session** — Game sessions saved to MongoDB on game over, tracking score, sequence, duration, and timestamps. User high score denormalized for leaderboard performance.

### Phase 4 — History + Leaderboard
- **US-6: View Game History** — Paginated game history page for authenticated users showing past sessions with scores, dates, and durations.
- **US-7: View Leaderboard** — Public server-rendered leaderboard displaying top scores across all players.

### Phase 5 — Polish
- **US-8: Responsive Layout and Loading States** — Mobile-responsive design, loading spinners, and skeleton states for improved UX across all screen sizes.
- **US-9: Navbar UX Enhancements** — Improved navigation bar with active route indicators, authentication-aware links, and responsive mobile menu.
