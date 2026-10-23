# Engineering Standard — aether-ai-memory

- Keep storage, retrieval, and embedding providers behind narrow interfaces.
- Use typed, versioned contracts and stable error codes.
- Make authorization and retention decisions explicit in code paths.
- Require idempotency for mutating operations that may be retried.
- Use deterministic synthetic fixtures; never commit customer memory or secrets.
- Add tests with each behavior change and document migrations/rollback.
- Use structured metadata-only telemetry with correlation IDs.
- No dependency, framework, or runtime choice is accepted until reviewed in an ADR.
