# Note: The client was discarding prerendered HTML

## Context

Follow-up to [Suspense blank flash on navigation](011-suspense-blank-flash-on-navigation.md),
that left one finding unresolved:

> fixed-size footer layout shift on the Projects page and every blog post.

Two plausible CSS causes, font-swap and a mobile viewport unit quirk,
had already been implemented correctly and ruled out. Rather than guess
at a third CSS mechanism, I inspected `PerformanceObserver`
for `layout-shift` entries, live in the browser.

## Observations

The observer's sources gave the actual DOM node behind the shift,
along with its `previousRect` and `currentRect`. The rect was all zeros,
width, height, and position. That's not what a repositioned element looks
like. It's the signature of an element being torn out of the render tree
and reinserted, not shifted by a CSS property settling late.

That pointed at mounting, not styling. `main.tsx` was calling
`createRoot` on `#root` container, the same container prerender
script had already filled with real server-rendered markup.

`createRoot` doesn't compare against existing content, it wipes the
container and renders from scratch. So every page load was throwing away
the prerendered HTML, including the footer, and rebuilding the entire page client-side.

## Analysis

The fix was switching to `hydrateRoot`, which reuses the server-rendered
markup and only patches it in place instead of discarding it. I confirmed
this with the same `PerformanceObserver` test against a live navigation:
CLS went from 0.214 to exactly zero, no layout-shift entries at all.

Root hydration comes with a side effect `createRoot` doesn't have: it
actually compares server output against the client's first render, so it
can surface a genuine mismatch between them. Right after this fix landed,
React error `#418` started appearing, but only under development runs,
on every route, not just blog posts as I first assumed while bisecting.

The reason is structural rather than a bug: prerender script only
ever runs as a post-build step against `dist/`. Deploying in dev never runs it,
so `#root` in dev is always empty. Hydrating an empty container against a real
render is a guaranteed mismatch. Testing against `vite preview`, which serves the
actual prerendered output, confirmed the error doesn't exist there at all.

The fix was to pick the mount strategy per environment: `createRoot` in
dev, where there's nothing to hydrate against, and `hydrateRoot` in
production, where prerendered markup is always present.

## Conclusions

- Confirmed: the footer CLS root cause was `createRoot` discarding
  prerendered HTML on every load, unrelated to font-display or viewport
  units. Both of those changes are legitimate improvements but were never
  the actual fix
- Confirmed: switching to `hydrateRoot` resolves the shift entirely
  (CLS 0.214 → 0), verified live rather than inferred from a score
- Confirmed: the React #418 hydration mismatch that followed is expected
  dev-only behavior, not a regression, and is resolved by using
  `createRoot` in dev and `hydrateRoot` in production

## Next Steps

None further for this shift specifically.

## References

- [Suspense blank flash on navigation](011-suspense-blank-flash-on-navigation.md)
- [Dev paths in prerendered HTML](006-dev-paths-in-prerendered-html.md)
