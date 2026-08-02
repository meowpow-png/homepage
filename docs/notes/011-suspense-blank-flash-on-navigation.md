# Note: Suspense blank flash on navigation

## Context

Follow-up to [Streaming SSR and blog content split](010-streaming-ssr-and-blog-content-split.md).
With the bundle-size work done, I went looking for anything Lighthouse's
per-page audits couldn't see, since a single-page audit has no concept of
what happens after a visitor clicks somewhere. Manually clicking around the
site turned up something real: switching between sections showed a blank
main area for close to a second before the new page appeared, every time.

## Observations

The network tab showed nothing useful, literally zero new requests, every
resource already served from cache. A real performance trace backed that up
further: no task over 50ms anywhere near the click. Whatever was causing the
pause wasn't a fetch and wasn't heavy computation either.

I first assumed the missing piece was that only the current page's
chunk gets preloaded, so I added idle-time prefetching for the other
three sections, fetching their chunks quietly once the page settles.
That's a reasonable thing to have regardless, but it didn't change
what I was seeing by itself.

The actual cause came from comparing behavior directly against the commit
that introduced lazy-loaded sections. Before that commit, the whole site was
one bundle, so switching sections was just a re-render, nothing to wait on.

That commit wrapped every route in `<Suspense fallback={null}>`, and by
React's default behavior, a Suspense boundary whose child suspends gets
unmounted immediately in favor of the fallback, rather than staying on
screen until the replacement is ready. Since the pathname update was
a plain state change, that's exactly what was happening on every
click: the old page vanished instantly, and the new one only
reappeared once its import resolved.

The fix was small once identified: wrap that state update in
`startTransition`. That tells React the update may suspend and that
it should keep showing the current content until the next one is ready,
instead of tearing it down straight away. I confirmed the fix by sampling
the main content area on every animation frame across a real navigation
in a live browser, and it never went empty, not even briefly.

## Analysis

This is the flip side of the work in the previous note. Splitting the app
into lazy-loaded chunks was the right call for reducing what a single page
ships, but it also introduced a class of problem that only shows up once
a visitor actually navigates. React fix wasn't about bundle size or network
speed at all, it was about which of two entirely reasonable Suspense
behaviors the app was opting into, and the default one happens to
look like a real performance regression from the outside.

## Conclusions

The blank-flash bug is fixed and confirmed live. The idle-prefetch
change is a genuine improvement on its own, but it was never the
actual fix for this bug and shouldn't be mistaken for one later.

## Next Steps

Separately, I kept chasing a specific Lighthouse layout-shift finding:
a fixed-size footer shift on the Projects page and every blog post.

The Mermaid-diagram case turned out to be real and got fixed.

Two other plausible causes, a font-swap flash and a mobile viewport quirk,
were both implemented correctly and neither moved the number at all.
That shift is still unexplained and worth returning to with a more direct
approach, such as diffing the page's actual computed styles before and
after it happens, rather than guessing at more CSS mechanisms.

## References

- [Streaming SSR and blog content split](010-streaming-ssr-and-blog-content-split.md)
- [Code-splitting routes](008-code-splitting-routes.md)
