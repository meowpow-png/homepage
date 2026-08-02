# Note: Streaming SSR and blog content split

## Context

Note `#009` left two paths open: migrate to Astro, or fix the
same problems in the current Vite/React setup without changing
frameworks. I went with the narrow fix, since the gains
were well understood and didn't need a rewrite to get.

## Observations

The prerender script used to call `renderToString` and then re-render
in a loop until a Suspense abort marker disappeared, because `renderToString`
doesn't wait for Suspense at all. React ships an API built for exactly
this case, `prerenderToNodeStream`, which waits for every boundary to
resolve before handing back HTML. Swapping to it let me delete the whole
retry loop outright, replacing it with a plain timeout as a safety
net in case a boundary genuinely never resolves.

Around the same time I revisited the per-route preload links I'd added to
the prerendered HTML. They only covered a page's own chunk, not that chunk's
own dependencies. So I extended the lookup to walk the build manifest
recursively, stopping as soon as it hits the shared entry chunk so
it can't wander back into code that's already loaded anyway.

The bigger find was the actual source of the "unused JavaScript" Lighthouse
kept flagging. `content/blog/index.ts` eagerly globbed every blog post's
compiled content just to read its title and date, and one of those posts
imports Mermaid to render a diagram. That import doesn't fully code-split by
itself, since Rollup won't split a module that's both statically and
dynamically imported anywhere in the app.

Mermaid and its dependencies were quietly along for the ride on every
single page, not just the one post that uses it. I split that apart
with a small Vite plugin that reads each post's frontmatter straight
off disk and exposes it through a virtual module.

Nothing about listing posts or matching a route by slug needs to
import a post's actual content anymore, so Rollup finally splits each
post into its own chunk the way it was always supposed to.

The main bundle dropped from 356 KB to 205 KB.

That still left a residual "unused" number on every page, so I traced it
with the bundle's own sourcemap rather than guessing. The vast majority of
what's left, roughly 85% of the file, is `react-dom`'s own client runtime.
Lighthouse's coverage snapshot just doesn't manage to exercise every code
path a single page's hydration touches, and there's no way to split "the
parts of React this page doesn't use" out of one production bundle.

That's not a bug in this project, it's what shipping React looks like.

## Analysis

All three of these traced back to the same kind of mistake: something that
was structurally reachable from every page, whether that page actually needed it.
The prerender retry loop existed because the wrong rendering API was in use.

The preload gap existed because I'd only looked at the immediate chunk,
not its dependencies. The blog bloat existed because metadata and rendered
content were bundled as one unit when they didn't need to be.

Once each of those was addressed directly, the underlying
numbers moved on their own, no extra tuning required.

## Conclusions

Streaming SSR, deeper preload walk, and the blog metadata split are all
implemented, tested, and confirmed working by rebuilding and inspecting
the output bundle. The unused-JS finding is now dominated by React's
own runtime rather than by anything specific to this app, and I
don't consider that worth chasing further.

## Next Steps

None on this thread.

See: [Suspense blank flash on navigation](011-suspense-blank-flash-on-navigation.md).

## References

- [Considering a migration to Astro](009-considering-astro-migration.md)
- [Code-splitting routes](008-code-splitting-routes.md)
