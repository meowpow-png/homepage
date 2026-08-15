# AGENTS.md

This document defines conventions for working in this repository.

## Architecture

Before making architectural changes, read `docs/ARCHITECTURE.md`.
This document is the source of truth unless the user explicitly requests otherwise.

## Implementation

### Imports

- Use `@` alias for cross-feature imports
- Keep relative imports within the same feature or directory
- Prefer feature-level barrel exports over importing implementation files directly
- Use `import type` for type-only imports

### TypeScript

- Add explicit return types to exported functions
- Prefer type inference for local variables; do not annotate obvious locals

### Routing

- Use the project's `<Link>` component for navigation whenever possible
- Only use router hooks when declarative navigation is insufficient

### MDX

- Keep frontmatter metadata generic.
- Cast metadata at the usage site via:

```ts
getMetadata<T>(metadata)
```

### Assets

- Store icons as standalone `.svg` assets and import SVGs with `?react`
- Wrap SVGs in React components only when adding behavior

### Component Design

- Do not extract components or hooks until there is genuine reuse
- Keep helper functions local unless they become shared

### Styling

- Let CSS own presentation (layout, colors, transforms, animations)
- Keep React components focused on structure and behavior

## Testing

Before writing or reviewing any test, read `docs/TESTING.md` and follow it.
