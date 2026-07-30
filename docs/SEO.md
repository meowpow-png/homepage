# SEO

Notes on how the site is set up to be crawlable, indexable,
and correctly described when it's shared. Written for whoever
touches routing, content, or the build pipeline next.

See [ROADMAP.md](ROADMAP.md#discoverability) for what's done and what's left.

## Blocking staging from indexing

Only staging.meowpow.dev should ever be kept out of search results.
Production and local builds must behave identically to each other,
so the guard is "is this a real non-production Vercel deployment,"
not "is this production."

Two independent layers cover this, since crawlers and tools don't all read
HTML the same way. A Vite plugin injects a noindex meta tag at build time:

```js
if (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production') return html
return html.replace('<head>', '<head>\n  <meta content="noindex, nofollow" name="robots" />')
```

And a Vercel header rule adds the same signal at the HTTP level,
scoped to the staging host:

```json
{
  "source": "/(.*)",
  "has": [{ "type": "host", "value": "staging.meowpow.dev" }],
  "headers": [{ "key": "X-Robots-Tag", "value": "noindex, nofollow" }]
}
```

The tricky part is the condition, not the mechanism: `VERCEL_ENV`
is unset for local dev and local builds, so unset has to be
treated the same as production, not the same as staging.

## Prerendering per-route HTML

The app is a client-rendered SPA, but crawlers and link-preview bots
don't run JavaScript reliably, so the build has a third step that walks
every route and writes a real static HTML file for it into `dist/`:

```json
"build": "tsc -b && vite build && node scripts/prerender.js"
```

It works by booting a Vite server in middleware mode just to get
`ssrLoadModule`, then calling `renderToString` on the app for each route.
No headless browser involved, so `useEffect` never runs during
prerendering — only the initial render lands in the static HTML.

See [002-mermaid-prerender-not-worth-it.md](notes/002-mermaid-prerender-not-worth-it.md)
for how that interacts with mermaid diagrams specifically.

A few things that aren't obvious from reading the script:

- `/` and `/about` share output. They're byte-identical content, so
  instead of writing two pages with two different canonical URLs, `/`
  renders `/about`'s content but canonicalizes to `/about`
- 404 is a real prerendered page, not a fallback. `dist/404.html` gets
  rendered through a sentinel pathname that matches no real route, so the
  app naturally shows `NotFound`. Vercel picks this file up automatically
  for any unmatched path and serves it with a real 404 status

## Page metadata

Title, description, and canonical URL all come from one place per
route, not from scattered `document.title` calls. Static routes
carry both fields directly on the route entry:

```ts
'/about': {
  title: 'Marin',
  description: "I enjoy building software that makes other developers' lives a little easier.",
  render: () => <About />,
},
```

Blog posts carry the same two fields as frontmatter, one per `.mdx`
file. Every canonical URL is built from a single constant:

```ts
export const SITE_URL = 'https://meowpow.dev'
```

Metadata is applied in two places:

- **Server-side**, the prerender script's `injectHead` function sets title
  and description always, and sets or omits the canonical link depending
  on whether the page has one. The 404 page gets no canonical tag at all
- **Client-side**, an effect in `App.tsx` keeps the same three things
  in sync on every navigation. It follows the same rule as the server:
  no matched route means the canonical tag gets removed
