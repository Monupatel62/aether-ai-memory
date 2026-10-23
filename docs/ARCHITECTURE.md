# Architecture — aether-ai-memory

## Boundary
The memory module owns memory lifecycle and retrieval policy interfaces. It does not authenticate users or invent tenant membership.

## Logical flow
1. Receive a trusted principal/tenant context from the approved security boundary.
2. Validate requested memory scope and policy.
3. Retrieve candidate records from the database/search interface.
4. Apply current authorization and retention/deletion filters.
5. Return provenance-tagged, size-bounded context to the caller.

## Key rules
- Stored memory is untrusted content.
- Deleted or revoked records must not be returned because an index/cache is stale.
- Persistent storage and vector retrieval are behind interfaces until infrastructure ADRs are accepted.
- Failure of authorization or membership lookup fails closed.

## Observability
Emit correlation IDs, operation outcomes, duration, and safe counts; do not log raw memory or prompts by default.
