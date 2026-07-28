---
name: architecture
description: Designs or refactors architecture. Use when introducing new structure, reorganizing code, or making architectural decisions.
---

Before making architectural changes, read `docs/ARCHITECTURE.md` unless
it is already available in the current context. The architecture document
is the source of truth unless the user explicitly requests otherwise.

## Architecture

- Keep modules self-contained
- Preserve section-oriented architecture
- Favor explicit boundaries over additional abstraction

## Dependencies

- Do not introduce dependencies that violate the architecture

## Refactoring

- prefer incremental refactoring to rewrites
- Preserve behavior unless the user requests otherwise
