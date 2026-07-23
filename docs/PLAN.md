# Implementation Plan

## Stage 1 — Planning

### Goals

- [x] Review architecture and design
- [x] Discuss implementation strategy
- [x] Decide implementation order
- [x] Identify missing decisions
- [x] Finalize implementation plan

### Decisions

_None_.

## Stage 2 — Foundation

### Goals

- [x] Scaffold project structure
- [x] Configure tooling
- [x] Implement design tokens
- [x] Implement global styles
- [x] Implement typography
- [x] Verify foundation

### Decisions

_None_.

## Stage 3 — Layout

### Goals

- [x] Discuss page layout
- [x] Decide responsive behavior
- [x] Implement app shell
- [x] Implement navigation
- [x] Implement footer
- [x] Verify layout

### Decisions

_None_.

## Stage 4 — Sections

### Goals

- [x] Discuss section structure
- [x] Implement About page
- [x] Implement Projects page
- [x] Implement Blog page
- [x] Implement Questions page
- [x] Implement client-side SPA routing

### Decisions

- Social link destinations: pending
- Routing: `/` redirects to `/about`; unmatched paths render Not Found without reloading the document

## Stage 5 — Content

### Goals

- [x] Define MDX content model
- [ ] Add MDX support
- [ ] Migrate authored content
- [ ] Add detail routes
- [ ] Verify content and authoring

### Decisions

- Authored content: MDX; React owns layout and routing
- Content: About, Projects, Blog, Questions

## Stage 6 — Polish

### Goals

- [ ] Review visual consistency
- [ ] Implement interaction states
- [ ] Implement subtle transitions
- [ ] Verify accessibility
- [ ] Verify responsiveness

### Decisions

_None_.

## Stage 7 — Release

### Goals

- [ ] Configure metadata
- [ ] Add icons and social assets
- [ ] Optimize production build
- [ ] Configure deployment
- [ ] Perform final review

### Decisions

_None_.
