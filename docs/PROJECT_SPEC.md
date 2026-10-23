# Project Specification — aether-ai-memory

## Purpose
Define safe conversation/session memory abstractions, retrieval interfaces, summarization provenance, retention, deletion, and tenant isolation.

## Scope
- Separate ephemeral prompt context from persisted memory.
- Scope records to the authenticated principal, session, and tenant where applicable.
- Support authorization-filtered retrieval, provenance, redaction, retention, export, and deletion.
- Treat retrieved memory as untrusted data, never as system policy.

## Out of scope
Identity-provider ownership, canonical membership/role authority, model gateway execution, and private tables owned by another repository.

## Acceptance criteria
- Every memory item has an explicit scope, owner, version, and lifecycle.
- Retrieval filters authorization before context assembly.
- Deletion/revocation cannot be bypassed by stale caches or embeddings.
- Synthetic cross-tenant and prompt-injection tests pass before release.

## Status
Documentation only; no application implementation exists in the inspected default-branch tree.
