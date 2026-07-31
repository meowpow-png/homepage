# Note: Code-splitting routes to reduce unused JavaScript

## Context

A Lighthouse audit flagged "Reduce unused JavaScript": every route shipped
About, Projects, Blog, and Questions in one bundle regardless of which
section was actually being viewed, since `routes.tsx` imported all four
statically. I wanted each section to load only when its route is visited.

## Observations

Switching those imports to `React.lazy()` split the JS cleanly. 
The main bundle shrank and each section became its own chunk — but it broke
prerendering. About `index.html` body came out empty, replaced by
an HTML comment telling the client to re-render because "the server used
renderToString which does not support Suspense." A first check of the
output looked fine only because a grep matched unrelated `<meta
name="description">` text, not the actual (empty) page body.

CSS split along with the JS, but not usefully: each section's styles 
were emitted as their own file, plus still fully duplicated inside 
the single `<style>` block the build already inlines everywhere.
The per-section files were never linked from anywhere.

## Analysis

`renderToString` never waits for a suspended import; it renders once
and bails if anything is still pending. Pre-warming the section's
module through Vite's SSR loader ahead of time didn't help, because
`React.lazy()`'s own resolution state lives on the lazy wrapper it
returns, not on the module cache. That state is only set the first 
time React actually attempts to render the lazy component and attaches 
its own `.then()` to the import promise. 

A single fixed wait after that first attempt wasn't reliable either: 
one real route needed more ticks to settle than a synthetic test 
of the same idea suggested, since Vite's SSR transform pipeline 
has its own async steps a plain dynamic import doesn't.

## Conclusions

- Prerendering a lazy-loaded route needs two things together: 
  a warm module cache, so the real import resolves fast once triggered, 
  and a render that's retried against the actual output until the 
  abort marker is gone, rather than a guessed number of ticks
- The CSS duplication was unrelated to Suspense. It's `cssCodeSplit`
  defaulting to on, which serves no purpose here since every page's CSS
  is already inlined as a single style block regardless of chunking

## Next Steps

Fixed: sections are lazy-loaded, `scripts/prerender.js` re-renders 
each page until it settles (capped, so a genuinely stuck boundary
fails the build instead of shipping empty HTML), and `cssCodeSplit: false` 
removes the orphaned per-section CSS files. 

No further action expected here.

## References

- [Mermaid prerender not worth it](002-mermaid-prerender-not-worth-it.md)
