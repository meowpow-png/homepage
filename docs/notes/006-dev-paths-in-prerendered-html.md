# Note: Dev paths in prerendered HTML

## Context

Building `scripts/prerender.js`, which uses Vite's SSR module runner
to render each route to HTML and write the result into the build
output. The goal was static HTML that's usable as-is, dropped
straight into the already-built output.

## Observations

The rendered HTML referenced assets by their dev-mode paths, since
the SSR module runner resolves modules the same way the dev server would.
Those paths don't exist in the built output — Vite's production build
hashes and relocates every asset. Writing the dev-mode HTML directly
into the build output would ship pages whose scripts and styles 404.

## Analysis

Vite's build manifest option writes a JSON file mapping each source
module path to its final hashed output path. Reading that file
after the build but before running the prerender step gives an
exact source-to-prod path table, so the dev-mode paths in the
rendered HTML can be string-replaced with the real ones.

## Conclusions

- Confirmed: rendered output always contains dev-mode asset paths
  when produced via the SSR module runner, regardless of build mode
- The manifest is the only source of truth for the dev-to-prod path mapping;
  there's no way to make the SSR module runner emit prod paths directly
- The manifest itself is a build-time-only artifact with no runtime use,
  so it gets deleted at the end of the prerender step rather than shipped

## Next Steps

None. Implemented and verified by inspecting prerendered
output for leftover dev-mode references before landing.

## References

None.
