# Architecture

## Overview

The frontend follows a section-oriented architecture that groups related UI and application logic into self-contained modules.

The architecture emphasizes clear boundaries, explicit data flow, and minimal complexity.

## Design Principles

- Section-oriented organization
- Explicit separation of UI and application logic
- Self-contained sections
- Shared functionality through common modules
- Minimal architectural complexity

## Project Structure

```text
src/
    sections/
    shared/
        assets/
            icons/
    App.tsx
    main.tsx
```

| Module      | Responsibility                    |
|-------------|-----------------------------------|
| `sections/` | Self-contained website sections   |
| `shared/`   | Reusable components and utilities |
| `shared/assets/icons/` | Reusable SVG icon assets |

## Sections

A typical section contains:

- `components/`
- `hooks/`
- `types.ts`
- `index.ts`

**Rules**

- Sections are self-contained
- Sections must not depend on other sections
- External consumers import through the section's public API

## Shared Modules

Shared modules contain reusable code used across multiple sections.

Reusable SVG icons are stored in `src/shared/assets/icons/`.

**Rules**

- Shared modules must not depend on section modules

## Styling

Styles are colocated with the components they belong to using CSS Modules.

Shared styles belong in `shared/`.

## Routing

Routing is configured centrally and composes sections into navigable pages.

## Imports

Imports are grouped by purpose:

1. Runtime dependencies
2. Type-only imports
3. Static assets

## Dependency Rules

```text
sections
    ↓
shared

App
    ↓
sections

main
    ↓
App
```

**Rules**

- Sections must not depend on other sections
- Shared modules must not depend on section modules
- `App` composes sections but contains no application logic
