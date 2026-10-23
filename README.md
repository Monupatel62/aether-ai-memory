# aether-ai-memory

**Status:** Initial memory record metadata validator is in review. No storage adapter, retrieval service, or production deletion lifecycle is implemented.

## Purpose

Conversation/session memory abstractions, safe summarization, scoped retrieval, retention, deletion, and tenant isolation.

## Dependencies

aether-ai-database and aether-ai-security.

## Initial implementation

The draft package validates principal/session/tenant scope metadata, opaque content references, provenance references, classification, retention class, version monotonicity shape, and timestamp ordering. It does not authorize access, read referenced content, persist records, enforce retention, or guarantee deletion/revocation propagation. Those require accepted identity, storage, and retention contracts.

## Documentation

- [Repository specification](docs/REPOSITORY_SPECIFICATION.md)
- [Master repository catalog](https://github.com/Monupatel62/aether-ai-platform/blob/main/docs/REPOSITORY_CATALOG.md)
- [Master architecture](https://github.com/Monupatel62/aether-ai-platform/blob/main/docs/MASTER_ARCHITECTURE.md)

## Project rules

- No implementation starts until the documentation and cross-repository contracts are reviewed.
- Do not commit secrets, credentials, or real user data.
- Keep retention, deletion, access control, and privacy behavior documented and tested before persistence features are enabled.

## Repository documents

- [Project specification](docs/PROJECT_SPEC.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Dependencies and contracts](docs/DEPENDENCIES_AND_CONTRACTS.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Research and licenses](docs/RESEARCH_AND_LICENSES.md)
- [Technical design](docs/TECHNICAL_DESIGN.md)
- [Security review](docs/SECURITY_REVIEW.md)
- [Engineering standard](docs/ENGINEERING_STANDARD.md)
- [Work log](docs/WORKLOG.md)
