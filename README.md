# aether-ai-memory

**Status:** Initial scoped memory lifecycle service implemented on a feature branch. No production database or retention policy is configured.

## Implemented

- [Memory service source](src/index.js): user/session-scoped memory, explicit bounded retention, tenant/owner isolation, authorization on create/read/list/delete, and expiration filtering.
- [Unit tests](test/memory.test.js): scope validation, retention bounds, cross-user/tenant isolation, expiration, deletion, and authorization denial.
- Dependency-free Node.js package with Node 20/22 CI.

## Privacy and security limits

- Retention must be explicitly supplied for each memory; the code does not define a final product retention policy.
- No tenant-shared scope is supported by this initial baseline.
- The store adapter must enforce tenant/owner scoping and durable deletion. Expired records are hidden but require a scheduled physical purge.
- Encryption, export, audit, data-subject deletion propagation, semantic retrieval, and production deployment are not included.

## Documentation

- [Repository specification](docs/REPOSITORY_SPECIFICATION.md)
- [Project specification](docs/PROJECT_SPEC.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Dependencies and contracts](docs/DEPENDENCIES_AND_CONTRACTS.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Security review](docs/SECURITY_REVIEW.md)
- [Master catalog](https://github.com/Monupatel62/aether-ai-platform/blob/main/docs/REPOSITORY_CATALOG.md)
