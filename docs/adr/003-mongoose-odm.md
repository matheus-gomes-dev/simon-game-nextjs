# ADR-003: Mongoose as ODM

## Status

Accepted

## Date

2026-02-26

## Context

The application uses MongoDB as its primary data store. We needed to decide how application code interacts with the database. The main options considered were:

1. **Raw MongoDB Node.js driver.** Direct access to the database with no abstraction layer.
2. **Mongoose.** The most established ODM (Object Document Mapper) for MongoDB in the Node.js ecosystem, providing schema definitions, validation, middleware hooks, and TypeScript type generation.
3. **Prisma with MongoDB.** A TypeScript-first ORM/query builder that added MongoDB support as a preview feature, now generally available.

The project has two collections (`users` and `game_sessions`) with well-defined schemas, indexes, and relationships. Data integrity and developer ergonomics are higher priorities than raw query performance.

## Decision

We will use **Mongoose** as the ODM for all database interactions. Models are defined in `src/models/` with TypeScript interfaces, and a cached connection is maintained in `src/lib/mongoose.ts` to handle the serverless/edge execution model of Next.js.

A separate native `MongoClient` instance (`src/lib/mongodb.ts`) is maintained solely for the Auth.js MongoDB adapter, which requires it.

## Consequences

### Positive

- **Schema-level validation.** Mongoose enforces field types, required fields, and custom validators at the application layer before data reaches MongoDB. This provides a safety net beyond what Zod catches at the API boundary.
- **TypeScript integration.** Mongoose 7+ generates TypeScript types from schema definitions. Combined with explicit interfaces on the models, this provides end-to-end type safety from database to API response.
- **Middleware hooks.** Pre-save and pre-validate hooks enable cross-cutting concerns (e.g., updating `updatedAt` timestamps, normalizing email casing) without scattering logic across route handlers.
- **Mature ecosystem.** Mongoose has over a decade of production usage, extensive documentation, and a large community. Debugging issues is straightforward because most problems have well-documented solutions.
- **Index management.** Indexes defined in the schema (`{ highestScore: -1 }`, `{ userId: 1, createdAt: -1 }`) are automatically ensured when the application connects, reducing the risk of missing indexes in new environments.

### Negative

- **Abstraction overhead.** Mongoose adds a layer of abstraction over the MongoDB driver. For complex aggregation pipelines or bulk operations, developers sometimes need to drop down to the native driver, which defeats the purpose of the ODM.
- **Connection management complexity.** In serverless environments (Vercel), Mongoose connections must be cached to avoid exhausting the connection pool. The `src/lib/mongoose.ts` utility handles this, but it is an extra concern that the raw driver or Prisma handles differently.
- **Bundle size.** Mongoose is a substantial dependency (~2 MB unpacked). For a server-side-only dependency this is acceptable, but it contributes to cold-start time in serverless functions.

### Risks

- **Prisma gaining ground.** Prisma's MongoDB support is improving and offers a more modern developer experience (auto-generated client, migrations-as-code). If the team grows and prefers Prisma's workflow, switching would require rewriting all model definitions and queries.
- **Schema rigidity.** Mongoose schemas can inadvertently impose rigidity on a document database that is designed for flexible schemas. If requirements change frequently, overly strict schemas may slow down iteration.

**Mitigation:** Keep Mongoose schemas as close to the documented database schema as possible. Avoid deeply nested subdocuments or complex discriminators that would make a future migration to another ODM more difficult.
