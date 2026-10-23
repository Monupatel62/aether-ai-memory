# Dependencies and Contracts — aether-ai-memory

## Dependency boundary

- `aether-ai-database`: consume shared persistence interfaces and migration tooling only. Memory owns its domain record semantics and retention behavior; the database repository does not own Memory's business rules or private domain schema.
- `aether-ai-security`: consume authorization and data-classification contracts. A tenant/workspace identifier is scope metadata, never proof of authorization.
- Do not add a mandatory vector database or other storage backend before the relevant architecture decision is accepted.

## Contracts

- Version memory records and retrieval responses.
- Define scope, provenance, created/updated times, retention class, and deletion state.
- Bound query size, candidate count, returned tokens/bytes, and timeout.
- Require current authorization against the authoritative policy/resource contract before returning any candidate.
- Preserve deletion/revocation semantics and make retries/idempotency explicit for persisted mutations.

## Prohibited dependency behavior

No direct access to another service's private tables; no implicit authorization from a tenant ID; no mandatory vector database before an accepted ADR.

## Compatibility

Breaking record or API changes require a versioned migration plan and consumer inventory.
