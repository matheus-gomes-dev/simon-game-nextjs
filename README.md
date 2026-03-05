# Simon Game

A classic Simon memory game built as a full-stack web application with user authentication, score persistence, and a global leaderboard.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5 (strict mode)
- **UI:** React 19, Tailwind CSS 4
- **Database:** MongoDB + Mongoose
- **Auth:** Auth.js v5 (Credentials provider, JWT sessions)
- **Validation:** Zod
- **Testing:** Vitest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```
MONGODB_URI=      # MongoDB connection string
AUTH_SECRET=      # Auth.js secret (min 32 chars)
AUTH_URL=         # App URL (http://localhost:3000 in dev)
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm run start
```

### Testing

```bash
npm run test            # Run tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
```

### Linting

```bash
npm run lint
```

## Features

- **Play Simon Game** — Repeat increasingly long color sequences to test your memory
- **User Registration & Login** — Secure authentication with hashed passwords and JWT sessions
- **Protected Routes** — Game page requires authentication
- **Score Persistence** — Game sessions are saved to MongoDB for authenticated users
- **Game History** — View your past games with scores and durations
- **Global Leaderboard** — Server-rendered public leaderboard of top scores

## Project Structure

```
src/
  app/          — Next.js App Router pages and API routes
  components/   — React components (game, auth, ui, history, leaderboard)
  hooks/        — Custom hooks (useSimonGame)
  lib/          — Database connections and validators
  models/       — Mongoose schemas (User, GameSession)
  types/        — TypeScript type definitions
  auth.ts       — Auth.js configuration
```
