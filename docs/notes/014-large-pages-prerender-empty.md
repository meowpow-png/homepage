# Note: Large pages prerender empty

## Context

A production report of section content trailing the page shell by
a second or two led back to `scripts/prerender.js`. Two of ten pages,
Projects and the largest blog post, were shipping with an empty section
in the static HTML, filled in only after the client loaded and hydrated.

## Observations

The prerendered HTML for those two pages held a Suspense boundary in
its pending state, an empty `<template>` tag, instead of real content.
No error was thrown, `onError` never fired, and the build completed
successfully. Bisecting by tree shape ruled out CSS, anchor tags, and
sibling count and order individually, none of them mattered on their
own. Rendering the exact same failing tree with the section's content
already resolved, no `React.lazy` involved at all, still produced the
same empty placeholder at the same byte length. Retrying the identical
render three times in the same process changed nothing either.

The only thing that correlated cleanly across all ten pages was
output size: the two failures were by far the two largest,
and the eight that worked were all well under that.

`prerenderToNodeStream`'s own documentation says it waits for every
Suspense boundary to resolve before returning, and the only documented
way to get an incomplete boundary back is passing an `AbortSignal`,
which this code never did. Reading the installed source directly
confirmed there's no documented size limit either, so whatever's
actually happening isn't something React explains anywhere I could find.

## Analysis

This codebase used to work around a related problem the same way:
retry `renderToString` in a loop until the fallback marker disappears,
from [Code-splitting routes](008-code-splitting-routes.md).
[Streaming SSR and blog content split](010-streaming-ssr-and-blog-content-split.md)
later replaced that loop with `prerenderToNodeStream` on the assumption
that a single call would always resolve everything, and that held
for every page at the time. It stopped holding once Projects
and that blog post grew past whatever the real limit is.

`renderToString` doesn't have this problem, because it never tries to
wait in the first place. Every call bails to the fallback on the first
pass regardless of page size, but the underlying import keeps loading
in the background. This means a second call after a real wait, picks
up the resolved result. I confirmed the retry approach resolves both
previously-broken pages reliably, repeated across several runs.

## Conclusions

Confirmed: this is a size-correlated failure in `prerenderToNodeStream`
itself, not in this app's component code, CSS, or async timing.

Ruling that out took retrying, resolving the import ahead of time,
and testing plain synchronous trees of the same size,
all of which reproduced the identical failure.

Not confirmed: the actual mechanism inside React causing it.
From what I have investigated no matching GitHub issue turned up,
and the documented behavior directly contradicts what's observed.

`renderToString` with a capped, backoff retry loop reliably
resolves both pages and is the same approach this codebase
already proved out once before.

## Next Steps

Prerender script now fails the build if any page ships with an
unresolved boundary, instead of silently writing empty HTML.
Hygiene test checks the same thing against the actual build output.

Neither of those would have caught this in production on its own,
since e2e tests wait out hydration and would pass either way
regardless of what the server actually sent.

`scripts/check-prerendered-content.js` fetches live staging content
directly and checks for the same unresolved marker, the same way
`check-caching-headers.js` already does for cache headers.

Worth filing a minimal reproduction with React at some point, since
this looks like a real gap between documented and actual behavior.

## References

- [Code-splitting routes](008-code-splitting-routes.md)
- [Streaming SSR and blog content split](010-streaming-ssr-and-blog-content-split.md)
