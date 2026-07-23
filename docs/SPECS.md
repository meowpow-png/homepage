# Design Reference Sheet

## Color Palette & Tokens

- `--color-canvas`: `#151619`
- `--color-surface`: `#1A1B1F`
- `--color-text-primary`: `#F5F5F5`
- `--color-text-secondary`: `#AAAAB0`
- `--color-text-muted`: `#777980`
- `--color-accent`: `#FF6F3D`
- `--color-border`: `rgba(255, 255, 255, 0.12)`
- `--color-icon`: `#8A8C92`
- `--font-family-mono`: `"JetBrains Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace`

## Typography

- Font family: `var(--font-family-mono)`
- Body: `16px` / `1.75` / `400` / `--color-text-primary`
- Body secondary: `16px` / `1.75` / `400` / `--color-text-secondary`
- Header navigation: `18px` / `1.4` / `400`
- Brand: `19px` / `1.4` / `500`
- Eyebrow: `28px` / `1.35` / `400`
- Hero name: `96px` / `1` / `700` / letter-spacing `-0.06em`
- Section heading: `24px` / `1.35` / `600` / `--color-accent`
- Footer text: `15px` / `1.65` / `400` / `--color-text-secondary`

## Spacing

- `--space-1`: `8px`
- `--space-2`: `16px`
- `--space-3`: `24px`
- `--space-4`: `32px`
- `--space-5`: `48px`
- `--space-6`: `64px`
- `--space-7`: `80px`
- Page top padding: `64px`
- Header-to-hero gap: `88px`
- Eyebrow-to-name gap: `20px`
- Name-to-summary gap: `24px`
- Summary-to-divider gap: `48px`
- Divider-to-section-heading gap: `36px`
- Heading-to-copy gap: `20px`
- Paragraph gap: `22px`
- Section-to-footer gap: `36px`

## Layout

- Viewport reference: `896px` wide
- Page background: `--color-canvas`
- Main content max-width: `688px`
- Main content horizontal alignment: centered
- Main content side padding: `32px`
- Header max-width: `724px`
- Header layout: horizontal flex; brand left; navigation right
- Header navigation gap: `48px`
- Hero layout: single column; left-aligned
- Summary max-width: `560px`
- Content measure: `68–74ch`
- Divider: full main-content width; `1px` solid `--color-border`
- Footer layout: divider above; icon group left; attribution right
- Footer attribution max-width: `350px`

## Components

- Brand mark
  - Accent dot: `12px × 12px`; circular; `--color-accent`
  - Label: `marin.dev`
  - Dot-to-label gap: `14px`
- Primary navigation
  - Links: `About`, `Projects`, `Common Questions`
  - Default color: `--color-text-primary`
  - Active color: `--color-accent`
  - Active indicator: `2px` bottom border; `--color-accent`; `16px` below label
- Hero
  - Eyebrow: `Hi, I’m`
  - Name: primary display text
  - Terminal dot: `--color-accent`; baseline-aligned
  - Summary: secondary text
- Content section
  - Accent heading
  - Full-width body copy
  - Paragraph-only flow; no cards or containers
- Footer attribution
  - Accent prompt glyph: `>`
  - Secondary text
- Social links
  - GitHub, LinkedIn, email
  - Icon size: `30px`
  - Default color: `--color-icon`
  - Hit-area minimum: `40px × 40px`
  - Icon group gap: `32px`

## Icons

- Style: simple monochrome brand/outline icons
- Stroke weight: `1.5–2px`
- GitHub: filled/octocat mark
- LinkedIn: filled wordmark tile
- Email: outlined envelope
- Accent use: active navigation, brand dot, hero terminal dot, footer prompt only

## Borders, Radius & Shadows

- Divider and active navigation indicator only
- Border width: `1px`
- Border color: `--color-border`
- Border radius: `0px`
- Shadows: none
- Background effects: none

## Responsive Behavior

- Desktop: header horizontal; footer horizontal; navigation inline
- Main content: `max-width: 688px`; side padding `32px`
- `≤ 640px`
  - Page side padding: `24px`
  - Header: vertical stack; align start; gap `24px`
  - Navigation: wrap; gap `16px 24px`
  - Hero top gap: `64px`
  - Hero name: `64px`
  - Eyebrow: `24px`
  - Body: `15–16px`
  - Footer: vertical stack; gap `24px`
  - Attribution: max-width none
- `≤ 400px`
  - Page side padding: `20px`
  - Hero name: `52px`
  - Navigation link size: `16px`
  - Social icon group gap: `24px`
