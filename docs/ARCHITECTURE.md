# Architecture

## Overview

The frontend follows a section-oriented architecture that groups
related UI and application logic into self-contained modules.

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
    content/
    sections/
    shared/
        assets/
            icons/
    App.tsx
    main.tsx
```

| Module                 | Responsibility                    |
| ---------------------- | --------------------------------- |
| `content/`             | Authored MDX content              |
| `sections/`            | Self-contained website sections   |
| `shared/`              | Reusable components and utilities |
| `shared/assets/icons/` | Reusable SVG icon assets          |

## Sections

A typical section contains:

- `components/`
- `hooks/`
- `types.ts`
- `index.ts`

**Rules**

- Sections are self-contained
- Sections must not depend on other sections
- External consumers import through the section's `index.ts`
- Deep imports into a section's internal files are not allowed

## Shared Modules

Shared modules contain reusable code used across multiple sections.

Reusable SVG icons are stored in `src/shared/assets/icons/`.

**Rules**

- Shared modules must not depend on section modules
- A shared submodule exposes `index.ts` once it has more than one exported member
- A single-file module is imported directly

## Content

Authored MDX content lives in `src/content/`. Sections render content;
MDX may use shared modules but must not depend on section modules.

Each content submodule exposes its data through `index.ts`.

## Styling

Styles are colocated with the components they belong to using CSS Modules.

Shared styles belong in `shared/`.

## Routing

Routing is configured centrally and composes sections into navigable pages.
Internal navigation is client-side and must not reload the document.

| Route          | Page                 |
| -------------- | -------------------- |
| `/`            | Redirect to `/about` |
| `/about`       | About                |
| `/projects`    | Projects             |
| `/blog`        | Blog                 |
| `/questions`   | Questions            |
| Unmatched path | Not Found            |

## Imports

Imports are grouped by purpose:

1. Runtime dependencies
2. Type-only imports
3. Static assets

A module is imported through `index.ts`, never through an internal file path.

## Dependency Rules

```text
sections
    ↓
shared, content

content
    ↓
shared

App
    ↓
sections, shared

main
    ↓
App
```

**Rules**

- Sections must not depend on other sections
- Shared modules must not depend on section modules
- Content must not depend on section modules
- `App` composes sections and shared infrastructure but contains no application logic
