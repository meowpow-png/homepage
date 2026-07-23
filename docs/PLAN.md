# Implementation Plan

## Stage 1 — Planning

### Goals

- [x] Review architecture and design
- [x] Discuss implementation strategy
- [x] Decide implementation order
- [x] Identify missing decisions
- [x] Finalize implementation plan

### Decisions

- Application: single-page composition with anchor navigation; no router
- Styling: CSS Modules plus shared global styles for reset, design tokens, and typography
- Content: lorem ipsum placeholders; `docs/CONTENT.md` remains reference-only
- Typography: bundled IBM Plex Mono via `@fontsource/ibm-plex-mono`
- SVG assets: `src/shared/assets/icons/`
- Build order: foundation → layout → About → Projects → Blog → Common Questions → polish and release

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

- Page structure: header → main → footer
- Navigation: About uses `/`, Projects uses `/projects`, Blog uses `/blog`, and Questions uses `/#questions`
- Footer: visual structure and SVG icons in Stage 3; real GitHub URL, LinkedIn URL, and email address supplied during Stage 4
- Navigation: maintain visual dimensions with at least `44px × 44px` touch targets

## Stage 4 — Sections

### Goals

- [x] Discuss section structure
- [x] Implement About
- [x] Implement Projects
- [x] Implement Blog
- [ ] Implement Common Questions
- [ ] Verify content and spacing

### Decisions

- Footer social links: use at least `44px × 44px` touch targets when real destinations are added
- Sections: `About`, `Projects`, `Blog`, and `Questions`; each is self-contained and exports its root component through `index.ts`
- Styling: colocated CSS Module per section; no hooks, types, shared abstractions, cards, or accordions unless needed
- Routes and anchors: About owns `#about` on `/`; Projects and Blog are pages at `/projects` and `/blog`; Questions uses `#questions` on `/`
- Order: About → Projects → Blog → Questions
- Content: real section headings with lorem ipsum placeholder copy

## Stage 5 — Polish

### Goals

- [ ] Review visual consistency
- [ ] Implement interaction states
- [ ] Implement subtle transitions
- [ ] Verify accessibility
- [ ] Verify responsiveness

### Decisions

- Navigation: active state follows the current hash or visible section
- Accessibility: add a skip-to-content link and explicit keyboard focus styles

## Stage 6 — Release

### Goals

- [ ] Configure metadata
- [ ] Add icons and social assets
- [ ] Optimize production build
- [ ] Configure deployment
- [ ] Perform final review

### Decisions
