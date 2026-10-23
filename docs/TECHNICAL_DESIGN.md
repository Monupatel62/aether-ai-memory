# Technical Design — aether-ai-memory

## Data model proposal
MemoryItem: memory_id, owner_principal_id, optional tenant_id/session_id, content reference, content classification, provenance, version, created_at, updated_at, retention_class, deleted_at, embedding_version (optional).

## API behavior
- Every operation receives a server-derived authentication context.
- Read/list/search operations authorize before candidate retrieval where possible and re-authorize before response.
- Pagination uses bounded opaque cursors; ordering is deterministic.
- Deletion returns a durable acknowledgment only when authoritative deletion state is persisted.

## Failure behavior
Timeouts and authorization-source failures fail closed. Retry only idempotent operations. Never include stored text or provider details in public errors.

## Open decisions
Storage, embedding model, retention durations, deletion SLA, and record encryption details require accepted ADRs before production implementation.
