# aether-ai-memory

**Status:** Documentation-only on the inspected `main` branch. No application implementation is present in the audited tree.

## Purpose

Conversation/session memory abstractions, safe summarization, scoped retrieval, retention, deletion, and tenant isolation.

## Dependencies

aether-ai-database and aether-ai-security.

## Documentation

- [Repository specification](docs/REPOSITORY_SPECIFICATION.md)
- [Master repository catalog](https://github.com/Monupatel62/aether-ai-platform/blob/main/docs/REPOSITORY_CATALOG.md)
- [Master architecture](https://github.com/Monupatel62/aether-ai-platform/blob/main/docs/MASTER_ARCHITECTURE.md)

## Project rules

- No implementation starts until the documentation and cross-repository contracts are reviewed.
- Do not commit secrets, credentials, or real user data.
- Keep retention, deletion, access control, and privacy behavior documented and tested before persistence features are enabled.
