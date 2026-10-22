# Repository specification: aether-ai-memory

**Status:** Documentation baseline copied from the Aether AI master specification. Implementation status must be verified separately.

## Mission

Conversation/session memory abstractions, safe summarization, retrieval interfaces, retention, deletion, and tenant isolation.

## Dependencies and connections

Database, security, compatible @woho/memory.

## Owned capabilities

Separate ephemeral context from persistent memory; define per-user/session scopes, retention/deletion, retrieval ranking, redaction, and memory poisoning defenses.

## Must not own

- Responsibilities assigned to another repository in the master catalog.
- Secrets, identity decisions, or authorization bypasses outside its documented boundary.
- Private database tables owned by another service.
- Unversioned contracts or undocumented side effects.

## Required contracts

- Typed schemas, explicit versioning, stable error categories, limits, and compatibility policy.
- Tenant/user context and authorization rules for any scoped data/action.
- Correlation IDs, safe telemetry, and explicit failure/timeout/retry behavior.
- Retention/deletion semantics whenever data is persisted.

## Security and privacy checklist

- [ ] Threat model and abuse cases documented.
- [ ] Least privilege and tenant isolation defined.
- [ ] Sensitive fields excluded or redacted in logs.
- [ ] Input size/type validation and rate/usage limits defined.
- [ ] Deletion, retention, export, and audit requirements defined where applicable.

## Test plan

Unit tests, contract tests, authorization/tenant isolation tests, malformed-input tests, dependency failure tests, and a non-production integration smoke test are required before release. Tests use synthetic or sanitized data only.

## Implementation gates

1. Create the repository only when the owner and direct dependencies are ready.
2. Review this specification against [the master catalog](../REPOSITORY_CATALOG.md).
3. Record an ADR for unresolved technology choices before selecting a database, identity provider, queue, cache, vector store, or payment provider.
4. Implement a minimal vertical slice with tests and operational docs.
5. Update the master catalog and this spec when the contract changes.

## Research references

- [Aether AI master catalog](../REPOSITORY_CATALOG.md)
- [WoHo AI DevKit](https://github.com/Monupatel62/woho-ai-devkit) — separate dependency; verify exact package APIs and license.
- [AI DIAL Core](https://github.com/epam/ai-dial-core) — model gateway reference; verify exact release/license before reuse.
- [AI DIAL Chat](https://github.com/epam/ai-dial-chat) — UI/BFF reference; verify file-level notices before reuse.
- [Model Context Protocol](https://modelcontextprotocol.io/) — relevant for MCP/tool integration.

These links are research inputs, not proof that the Aether implementation exists or that all referenced code is reusable under one license.## Memory persistence and retrieval gate

See [Data Infrastructure Evaluation](../DATA_INFRASTRUCTURE_EVALUATION.md). A durable relational store is the proposed baseline for memory metadata and policy, while vector search can initially use pgvector if the measured retrieval quality is sufficient. Define per-user/session/tenant scope, retention, export/deletion, summarization provenance and embedding-version migration before implementation. Memory retrieval is untrusted context: filter by authorization before assembling model context, do not treat memory text as policy, and test cross-tenant access, stale/deleted memories and prompt-injection content.

## Related documentation

- [Master repository catalog](../REPOSITORY_CATALOG.md)
- [Master architecture](../MASTER_ARCHITECTURE.md)
- [Architecture audit](../ARCHITECTURE_AUDIT.md)
- [Security threat model](../SECURITY_THREAT_MODEL.md)
- [Open decisions and research](../OPEN_DECISIONS_RESEARCH.md)
- [Continuity handoff](../WORK_HANDOFF.md)
