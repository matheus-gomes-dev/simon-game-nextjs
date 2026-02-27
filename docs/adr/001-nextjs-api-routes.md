# ADR-001: Next.js API Routes instead of an independent API

## Status

Accepted

## Date

2026-02-26

## Context

The Simon Game requires a backend API to handle user registration, authentication, game session persistence, and leaderboard queries. We needed to decide whether to build this API as:

1. **Co-located Route Handlers** inside the Next.js App Router (`src/app/api/`), or
2. **A separate backend service** using a framework such as Express, Fastify, or NestJS, deployed independently from the frontend.

The project is a small-to-medium web application with a single frontend client (the Next.js app itself). The team is small and values rapid iteration. There is no current requirement to serve a mobile app or third-party consumers from the same API.

## Decision

We will use Next.js Route Handlers (App Router) as the sole API layer. All endpoints -- authentication, registration, game persistence, and leaderboard -- are defined under `src/app/api/` and deployed as part of the same Next.js application.

## Consequences

### Positive

- **Single deployable unit.** One build, one deployment target. No need to coordinate releases between a frontend and a backend service. This simplifies CI/CD pipelines and hosting (a single Vercel project or a single Docker image).
- **Shared TypeScript types.** Types defined in `src/types/` (e.g., `SimonColor`, `GameStatus`, Zod schemas) are imported directly by both UI components and API route handlers. No code generation step, no OpenAPI sync, no risk of type drift between client and server.
- **No CORS configuration.** Because the browser makes requests to the same origin that served the page, cross-origin issues do not arise. This eliminates an entire class of bugs and security misconfiguration.
- **Reduced infrastructure complexity.** One server process, one set of environment variables, one monitoring target. There is no inter-service network hop, so latency between the frontend and API is effectively zero.
- **Faster development velocity.** Adding a new endpoint means creating a single `route.ts` file in the existing project. There is no context-switching between repositories, no separate dev server to run, and hot-reload covers both UI and API changes.
- **Auth.js native integration.** Auth.js v5 is designed to work within the Next.js request lifecycle. Using Route Handlers means `auth()` is available in both server components and API routes without any adapter or proxy layer.

### Negative

- **Tight coupling between frontend and API.** The API cannot be deployed, scaled, or versioned independently of the frontend. If the API needs to handle a traffic spike, the entire Next.js application must scale, including its SSR workload.
- **Harder to reuse the API for other clients.** If a mobile app or third-party integration needs access to the same endpoints in the future, they would hit the Next.js server directly. This works technically but means the API contract is implicitly tied to the Next.js routing conventions rather than being a standalone, documented service.
- **Serverless function constraints.** If deployed on Vercel or similar platforms, each Route Handler runs as a serverless function with execution time limits (typically 10-60 seconds) and cold start overhead. Long-running operations would need a different approach.
- **Testing ergonomics.** Integration-testing Route Handlers requires either spinning up the Next.js dev server or manually constructing `Request` objects. A standalone Express app can be tested more directly with libraries like `supertest`.

### Risks

- **Outgrowing the monolith.** If the project scope expands significantly (e.g., real-time multiplayer, a mobile client, webhook integrations), the co-located API may become a bottleneck. At that point, extracting a standalone API service would require non-trivial refactoring.
- **Vendor lock-in perception.** Tying the API to Next.js conventions makes it harder to migrate to a different frontend framework without also migrating the backend. However, the business logic in `src/lib/`, `src/models/`, and `src/hooks/` is framework-agnostic and portable.

**Mitigation:** Keep business logic in `src/lib/` and `src/models/`, separate from Route Handler plumbing. If extraction becomes necessary, the route handlers become thin adapters that can be replaced without rewriting domain logic.
