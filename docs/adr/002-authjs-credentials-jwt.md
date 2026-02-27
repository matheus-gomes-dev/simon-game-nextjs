# ADR-002: Auth.js v5 with Credentials provider and JWT sessions

## Status

Accepted

## Date

2026-02-26

## Context

The application requires user authentication so that game sessions can be associated with user accounts and scores can appear on a leaderboard. We needed to decide:

1. **Auth library vs. custom implementation.** Building authentication from scratch (password hashing, session management, CSRF protection, token rotation) is time-consuming and error-prone.
2. **Authentication provider.** The application targets users who sign up with an email/username and password. OAuth providers (Google, GitHub) are not in scope for the initial release.
3. **Session strategy.** Sessions can be stored server-side in the database or encoded as stateless JWT tokens.

## Decision

We will use **Auth.js v5** (the Next.js-native successor to NextAuth.js) with the **Credentials provider** for email/password authentication and **JWT-based sessions** with a 7-day expiry.

Passwords are hashed with bcrypt at cost factor 12 before storage. The JWT contains the user ID, email, and username, allowing Route Handlers and Server Components to identify the user without a database lookup on every request.

## Consequences

### Positive

- **Native Next.js integration.** Auth.js v5 provides the `auth()` helper that works in Server Components, Route Handlers, and Middleware. Protecting a route is a single function call, not custom middleware wiring.
- **Battle-tested security defaults.** CSRF protection, secure cookie configuration, and token signing are handled by the library. This eliminates common authentication vulnerabilities that arise from hand-rolled implementations.
- **Stateless JWT sessions.** No session table in MongoDB means fewer database reads on every authenticated request. For a game application where the user makes rapid API calls during gameplay, this reduces latency and database load.
- **Simple mental model.** One library handles login, logout, session checking, and token refresh. The team does not need to learn multiple libraries or maintain custom session middleware.

### Negative

- **Credentials provider limitations.** Auth.js was originally designed around OAuth flows. The Credentials provider is less fully featured -- for example, it does not support built-in account linking or automatic email verification workflows. These features, if needed, must be built manually.
- **JWT cannot be revoked server-side.** If a user's account is compromised, there is no immediate way to invalidate existing tokens without switching to database sessions or maintaining a deny-list. The 7-day expiry limits the exposure window but does not eliminate it.
- **Token size.** JWTs are larger than a simple session ID cookie. Each request carries the full encoded token. For this application the payload is small (user ID, email, username), so the overhead is negligible.

### Risks

- **Auth.js v5 maturity.** Auth.js v5 is the rewritten version of NextAuth.js. While it is production-ready, the ecosystem of community plugins and documentation is still maturing compared to the v4 generation.
- **Future OAuth requirements.** If the product later requires social login (Google, GitHub), the Credentials provider and OAuth providers need to coexist, which introduces account-linking complexity that Auth.js does not fully automate for Credentials.

**Mitigation:** The Auth.js configuration is centralized in `src/auth.ts`. Adding an OAuth provider later requires modifying this single file and adding the provider's callback route. The JWT session strategy remains compatible with multiple providers.
