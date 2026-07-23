# Design Reference Sheet

## Color Palette & Tokens

- `--color-canvas`: `#151619`
- `--color-surface`: `#1A1B1F`
- `--color-text-primary`: `#F5F5F5`
- `--color-text-secondary`: `#AAAAB0`
- `--color-accent`: `#FF6F3D`
- `--color-border`: `rgba(255, 255, 255, 0.12)`
- `--color-icon`: `#8A8C92`
- `--font-family-mono`: `"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace`

## Typography

- Font family: `IBM Plex Mono`
- Font package: `@fontsource/ibm-plex-mono`
- Body: `16px` / `1.75` / `400` / `--color-text-primary`
- Body secondary: `16px` / `1.75` / `400` / `--color-text-secondary`
- Header navigation: `18px` / `1.4` / `400`
- Brand: `19px` / `1.4` / `500`
- Eyebrow: `28px` / `1.35` / `400`
- Hero name: `96px` / `1` / `700` / letter-spacing `-0.06em`
- Section heading: `24px` / `1.35` / `600` / `--color-accent`
- Footer text: `15px` / `1.65` / `400` / `--color-text-secondary`

## Spacing

- `--space-page-top`: `64px`
- `--space-page-inline`: `32px`
- `--space-header-to-hero`: `88px`
- `--space-eyebrow-to-name`: `20px`
- `--space-name-to-summary`: `24px`
- `--space-summary-to-divider`: `48px`
- `--space-divider-to-section-heading`: `36px`
- `--space-heading-to-copy`: `20px`
- `--space-paragraph`: `22px`
- `--space-section-to-footer`: `36px`
- `--space-navigation-links`: `48px`
- `--space-social-links`: `18px`

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
- Summary max-width: `400px`
- Content measure: `68–74ch`
- Divider: full main-content width; `1px` solid `--color-border`
- Footer layout: divider above; icon group left; attribution right
- Footer attribution max-width: `340px`

## Components

- Brand mark
  - Accent dot: `12px × 12px`; circular; `--color-accent`
  - Label: `marin.dev`
  - Dot-to-label gap: `14px`
- Primary navigation
  - Links: `About`, `Projects`, `Blog`, `Questions`
  - Destinations: `/about`, `/projects`, `/blog`, `/questions`
  - Default color: `--color-text-primary`
  - Active color: `--color-accent`
  - Active state: current route
  - Active indicator: `2px` bottom border; `--color-accent`; `16px` below label
  - Hit-area minimum: `44px × 44px`
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
  - Hit-area minimum: `44px × 44px`
  - Icon group gap: `32px`
- Question disclosure
  - Prompt: `20px` / `1.5`
  - Prompt quote: accent `“`; `32px` / `0.8`
  - Disclosure control: accent `+` when closed; `−` when open; aligned at the prompt end
  - Answer: `15px` / `1.65` / `--color-text-secondary` on `--color-surface`

## Icons

- Style: simple monochrome brand/outline icons
- Stroke weight: `1.5–2px`
- GitHub: filled/octocat mark
- LinkedIn: filled wordmark tile
- Email: outlined envelope
- Accent use: active navigation, brand dot, hero terminal dot, footer prompt only

## Borders, Radius & Shadows

- Divider, active navigation indicator, and question disclosures
- Border width: `1px`
- Border color: `--color-border`
- Question disclosures: top border on each item; bottom border on the final item
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

## Accessibility

- Skip link target: `#main-content`
- Keyboard focus: visible focus treatment
