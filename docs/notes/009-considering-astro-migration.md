# Note: Considering a migration to Astro

## Context

Following up on [Code-splitting routes](008-code-splitting-routes.md):
a Lighthouse audit after that work still showed "Reduce unused JavaScript",
plus a new "Avoid large layout shifts" finding on `/projects/`. I wanted to
know if these were the same problem resurfacing, whether my fixes were helping
or making things worse, and whether the approach I've been patching onto is even sound.

## Observations

Note `#008` never actually fixed the unused-JS finding. The same three chunks
load on every route no matter which section it is, traced to `src/content/blog/index.ts`
eagerly globbing every blog post's compiled content, including one that imports Mermaid.

Whatever imports that file (the router, to match blog post URLs) drags
Mermaid and `rough.js` into every page, whether it renders a diagram or not.
This predates `#008` by many commits and was never in its scope to begin with.

I fixed the layout shift by having the prerender script inject a preload link for
each route's own lazy section chunk, since every prerendered page was stamped from
one shared template that never mentioned it. That fixed CLS on `/projects/`, but the
next full audit showed it newly present across every blog post page too,
somewhere between `0.1` and `0.285` - pages I hadn't checked before.

I then tried the real fix for unused-JS: splitting the blog content glob into
an eager metadata-only import and a separate lazy content import. The build immediately
explained why this doesn't work: Rollup won't split a module into its own chunk
if the same file is imported both statically and dynamically anywhere in
the app, so it merged everything back into the main bundle anyway.

It also broke prerendering, since the newly-lazy content wasn't
pre-warmed the way `#008` requires section modules to be.

## Analysis

All three problems trace back to one choice: prerendering with renderToString,
which doesn't support Suspense at all. 008 worked around that with a retry-until-
settled loop instead of using React's streaming renderer, which is built for
exactly this and waits for Suspense to resolve on its own, no polling needed.

The layout shift bug has the same shape: one static HTML template gets reused
for every route, so each page's actual asset needs get bolted on after the
fact via manual manifest lookups. A real SSG tool builds routing and the
build together, so each page's HTML always matches what it needs.

The unused-JS bug is the same shape again: content and its frontmatter
are one module, so there's no way to read one without pulling in the other,
short of fighting Rollup's chunking rules. A framework that treats frontmatter
as data separate from rendered content doesn't have this problem, because
it was never deriving metadata from the same import it renders from.

## Conclusions

These aren't three separate bugs, they're one hand-rolled prerendering pipeline
fighting itself in three places, which is why fixing one keeps surfacing or
worsening another. Astro is the concrete candidate I looked at: streaming SSR
with real Suspense support, per-route HTML generation, and a content layer that keeps
frontmatter and rendered content separate. Its default of shipping zero client JS
unless a component is explicitly hydrated also kills most of what "unused
JavaScript" is measuring here, not just the Mermaid case.

It's not free, though. Astro's default routing is full page reloads,
not the client-side transitions the site has now - getting that back means
adopting its View Transitions router as a deliberate extra step. Test coverage
also stops meaning much once most components render server-only, and needs a
different approach rather than a straight port. And it touches routing,
the MDX pipeline, content loading, and most of the test suite -
a multi-day rewrite, not a config change.

## Next Steps

No decision made yet, two paths are open:

- Stay on the current stack: switch the prerender script to React's
  streaming renderer, and solve the frontmatter/content coupling with
  a plugin that reads frontmatter without ever importing the compiled post
- Migrate to Astro, scoped as its own project rather than more patches
  on the current router and prerender script

## References

- [Code-splitting routes](008-code-splitting-routes.md)
