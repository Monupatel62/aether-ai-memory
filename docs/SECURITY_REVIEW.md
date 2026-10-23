# Security Review — aether-ai-memory

Status: review checklist; no implementation or test evidence is present.

## Threats
Cross-tenant retrieval, stale ACLs, memory poisoning, prompt injection, accidental retention, deletion gaps, sensitive data in logs, and oversized retrieval responses.

## Required controls
- [ ] Trusted principal and tenant resolution; never accept client-authored grants.
- [ ] Authorization filtering before context assembly and before response.
- [ ] Record provenance and scope; memory cannot override system/developer policy.
- [ ] Retention, export, deletion, and index/cache propagation defined.
- [ ] Input/output byte, item-count, and token limits enforced.
- [ ] Secrets and raw memory excluded from default telemetry.
- [ ] Dependency, secret, and vulnerability scans enabled before release.

## Required tests
Synthetic cross-tenant reads, revoked membership, stale/deleted index entries, malicious memory instructions, malformed input, and authorization service outage.
