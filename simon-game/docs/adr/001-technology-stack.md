# ADR-001: Technology Stack Choices

**Status:** Accepted
**Date:** 2025-02-12

## Context

We need to build a browser-based Simon memory game as a training project. The game is a single-page, client-side interactive application with no backend requirements (no authentication, no database, no API). The primary goals are:

- Fast development cycle with good developer experience
- Strong type safety to catch bugs early
- Modern, maintainable codebase suitable for learning
- Responsive UI that works on mobile and desktop

We need to choose a framework, language, and styling solution.

## Decision

We chose the following stack:

| Layer | Choice | Version |
|---|---|---|
| **Framework** | Next.js (App Router) | 16 |
| **Language** | TypeScript (strict mode) | 5 |
| **UI Library** | React | 19 |
| **Styling** | Tailwind CSS | 4 |
| **Linting** | ESLint with eslint-config-next | 9 |

### Rationale

**Next.js over plain React (Vite/CRA):**
- `create-next-app` provides a batteries-included setup (TypeScript, ESLint, Tailwind, path aliases) with zero manual configuration.
- The App Router file-based routing is useful if the project grows (e.g., adding a settings or leaderboard page).
- For a single-page game the overhead is minimal — we use a single `page.tsx` marked as a client component.
- Trade-off accepted: Next.js is heavier than Vite for a purely client-side app, but the DX benefits and training relevance outweigh the bundle size difference.

**TypeScript over JavaScript:**
- Strict mode catches type errors at build time (e.g., passing an invalid color string, missing props).
- Union types (`SimonColor`, `GameStatus`) serve as self-documenting domain models.
- No runtime cost — types are stripped at build time.

**Tailwind CSS over CSS Modules or styled-components:**
- No context-switching between files — styles live inline with markup.
- Responsive design via utility prefixes (`sm:`, `md:`) without writing media queries.
- Consistent design tokens (colors, spacing) out of the box.
- No runtime CSS-in-JS overhead.

**React 19:**
- Ships with Next.js 16 by default.
- Hooks (`useState`, `useCallback`, `useRef`) are the standard for client-side state management and fit the game logic well.

## Consequences

### Positive
- **Zero config:** `npx create-next-app` scaffolds the entire project in one command.
- **Type safety:** TypeScript catches mismatched colors and invalid states before runtime.
- **Fast iteration:** Tailwind + hot reload means UI changes are visible instantly.
- **Industry-relevant:** Next.js + TypeScript + Tailwind is a widely adopted stack, making this training directly applicable.

### Negative
- **Bundle size:** Next.js includes server-side capabilities (routing, SSR) that this project does not use. The production bundle is larger than a minimal Vite app would be.
- **Learning curve:** Developers unfamiliar with the App Router may need to understand the `"use client"` directive and when it's required.
- **Tailwind verbosity:** Long class strings in JSX can reduce readability for complex components.

### Risks
- If the project later needs SSR or API routes (e.g., a server-side leaderboard), the infrastructure is already in place. No migration needed.
- If Tailwind classes become unwieldy, they can be extracted into component-level constants (as done in `SimonButton.tsx` with `COLOR_STYLES`).
