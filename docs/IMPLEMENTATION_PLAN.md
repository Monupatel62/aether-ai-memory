# Implementation Plan — aether-ai-memory

## Phase 0 — contract approval
- [ ] Resolve tenant/membership authority and authorization-context trust.
- [ ] Define record schema, scope rules, retention/deletion, export, and provenance.
- [ ] Accept storage/search ADRs.

## Phase 1 — safe vertical slice
- [ ] Implement create/read/list/delete for synthetic records behind repository interfaces.
- [ ] Enforce authorization before retrieval and again before returning results.
- [ ] Add hard payload/query/result limits and safe error mapping.

## Phase 2 — retrieval quality
- [ ] Add deterministic ranking and provenance.
- [ ] Add optional embedding/vector retrieval only after benchmark evidence.
- [ ] Add migration and embedding-version strategy.

## Phase 3 — release gate
- [ ] Cross-tenant, stale-index, deleted-record, prompt-injection, retention, and failure tests.
- [ ] Review redaction, operational alerts, backup/restore, and deletion propagation.

No phase is marked complete; this is a plan, not implementation evidence.
