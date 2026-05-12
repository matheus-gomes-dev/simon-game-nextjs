# ADR-007: Zod for validation

## Status

Accepted

## Date

2026-02-26

## Context

All API endpoints accept user input (registration data, login credentials, game session results). This input must be validated before processing to prevent malformed data from reaching the database, to provide clear error messages, and to defend against injection or type-confusion attacks.

We considered the following validation libraries:

1. **Zod.** A TypeScript-first schema validation library that infers static types from schemas. No decorators, no code generation.
2. **Yup.** A popular schema validation library with a fluent API, widely used in the React/Formik ecosystem. Predates TypeScript-first design.
3. **Joi.** A mature validation library from the Hapi ecosystem. Powerful and battle-tested but designed for JavaScript, not TypeScript.
4. **class-validator.** Decorator-based validation for class instances. Common in NestJS projects but requires class instantiation and `reflect-metadata`.

The project uses TypeScript in strict mode throughout. The team values type safety and wants validation schemas to serve as the single source of truth for both runtime validation and compile-time types.

## Decision

We will use **Zod** for all input validation. Schemas are defined in `src/lib/validators.ts` and imported by both API route handlers (server-side validation) and form components (client-side validation).

TypeScript types are inferred from Zod schemas using `z.infer<typeof schema>`, ensuring that the validation rules and the TypeScript types can never drift apart.

Example:
```typescript
const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(128),
});

type RegisterInput = z.infer<typeof registerSchema>;
```

## Consequences

### Positive

- **TypeScript-first design.** Zod schemas produce TypeScript types via `z.infer<>`. There is no need to define a type and a schema separately and keep them in sync. The schema IS the type definition.
- **Composable schemas.** Schemas can be extended (`.extend()`), merged (`.merge()`), picked (`.pick()`), or omitted (`.omit()`). This allows defining a base schema and deriving variations (e.g., a registration schema that omits the `_id` field from the full User type).
- **No decorators or classes.** Zod works with plain objects and functions. It does not require `reflect-metadata`, experimental decorators, or class instantiation. This aligns with the functional style used throughout the Next.js application.
- **Small bundle size.** Zod is approximately 13 KB minified and gzipped. It can be included in client-side bundles for form validation without significant size impact.
- **Rich error messages.** Zod returns structured error objects (`ZodError`) with per-field error paths and messages, making it straightforward to map validation errors to form fields in the UI.
- **Shared between client and server.** The same schema defined in `src/lib/validators.ts` is imported by both the Route Handler (server-side) and the React form component (client-side). Validation logic is written once and applied in both environments.

### Negative

- **Ecosystem size.** While Zod's adoption is growing rapidly, Yup and Joi have larger ecosystems of plugins and integrations. Some form libraries have deeper Yup integration (e.g., Formik's `validationSchema` prop expects Yup by default).
- **Learning curve for Zod-specific patterns.** Features like discriminated unions, transforms, and refinements have a learning curve. Simple validation is intuitive, but advanced patterns require consulting the documentation.
- **Runtime-only validation.** Zod validates at runtime. It does not provide compile-time guarantees about data shape beyond what `z.infer<>` produces. If a schema is not applied to an input, TypeScript will not catch the omission.

### Risks

- **Breaking changes in major versions.** Zod is pre-1.0 (currently v3.x). Major version bumps could introduce breaking API changes that require updating all schemas. However, the Zod API has been stable for over two years.

**Mitigation:** Pin the Zod version in `package.json` and update deliberately. Centralizing all schemas in `src/lib/validators.ts` means that any API changes only affect one file.
