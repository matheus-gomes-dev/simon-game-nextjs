# Architecture Decision Records

This directory contains the Architecture Decision Records (ADRs) for the Simon Game project.

ADRs document the key architectural choices made during the design and development of this application. Each record captures the context, the decision itself, and its consequences -- both positive and negative.

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [ADR-001](./001-nextjs-api-routes.md) | Next.js API Routes instead of an independent API | Accepted |
| [ADR-002](./002-authjs-credentials-jwt.md) | Auth.js v5 with Credentials provider and JWT sessions | Accepted |
| [ADR-003](./003-mongoose-odm.md) | Mongoose as ODM | Accepted |
| [ADR-004](./004-usereducer-game-state.md) | useReducer for game state management | Accepted |
| [ADR-005](./005-denormalized-highest-score.md) | Denormalized highestScore on User model | Accepted |
| [ADR-007](./007-zod-validation.md) | Zod for validation | Accepted |

## Format

Each ADR follows a consistent structure:

- **Status** -- Accepted, Superseded, or Deprecated
- **Date** -- When the decision was made
- **Context** -- The problem or situation driving the decision
- **Decision** -- What we chose to do
- **Consequences** -- Positive outcomes, negative trade-offs, and risks
