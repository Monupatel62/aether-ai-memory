# Dependencies and Contracts — aether-ai-memory

## Direct dependencies
- aether-ai-database: persistence interfaces and migration ownership.
- aether-ai-security: authorization and data-classification contracts.

## Contracts
- Version memory records and retrieval responses.
- Define scope, provenance, created/updated times, retention class, and deletion state.
- Bound query size, candidate count, returned tokens/bytes, and timeout.
- Require current authorization before returning any candidate.

## Prohibited dependency behavior
No direct access to another service's private tables; no implicit authorization from a tenant ID; no mandatory vector database before an accepted ADR.

## Compatibility
Breaking record or API changes require a versioned migration plan and consumer inventory.
