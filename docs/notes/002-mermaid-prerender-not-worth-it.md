# Note: Considered build-time mermaid pre-rendering, reverted

## Context

Follow-up to [[001-mermaid-dev-render-delay]]. After fixing the dev-server
stall via `optimizeDeps.include: ['mermaid']`, a ~100-200ms delay remained
on every client-side mount of a `<Mermaid>` diagram (initial load and SPA
back-and-forth navigation alike). Since the diagrams are static content that
never changes post-deployment, I explored pre-rendering them to static SVG
at build time instead of running mermaid in the browser at all.

## Observations

Implemented it with `rehype-mermaid` (uses a headless browser via
`mermaid-isomorphic`/Playwright to run mermaid's layout ahead of time)
wired into the MDX pipeline, converting `<Mermaid>` blocks to `mermaid` 
code fences. It worked: the production bundle dropped to one ~296KB chunk 
with no mermaid/dagre/cytoscape code, and diagrams rendered as 
plain inline `<svg>`with correct theming.

It also introduced a hard build-time dependency on a working Chromium
install. On Fedora Kinoite (an immutable/atomic host), `playwright install`
isn't officially supported and falls back to an untested build; getting a
working browser required either layering packages onto the OS, using
toolbox/distrobox, or a container — and this same install is needed by
anyone building the project (other contributors, CI), not just this machine.

Separately, testing the *original* client-side approach against a real
production build (`npm run build` && `npm run preview`) showed both 
diagrams loading and rendering instantly, no perceptible lag at all.

## Analysis

The build-time pre-render only pays off the residual ~100-200ms of
client-side render compute (parse + dagre layout + DOM text measurement).
Weighed against that: it makes a headless browser a mandatory part of the
build for every environment that runs it, with no path around it (Docker
would be the properly portable fix, but that's a new hard dependency for 
the whole project). 

For a personal blog with two small diagrams, that cost was disproportionate 
to the benefit — especially once production testing showed there 
was no visible lag to fix in the first place.

## Conclusions

- Confirmed: the client-side `optimizeDeps` fix alone is sufficient;
  production has no perceptible diagram-loading delay
- Decided against build-time SVG pre-rendering: the remaining render cost
  it would eliminate is small, static, and unnoticeable in practice, while
  the toolchain cost (mandatory headless browser for every build
  environment) is real and ongoing

## Next Steps

Reverted the `rehype-mermaid`/Playwright changes; kept only the
`optimizeDeps` fix from [[001-mermaid-dev-render-delay]]. No further
action planned. Revisit only if the number or complexity of diagrams
grows enough that render cost becomes actually noticeable in production.

## References

- [Slow first mermaid diagram render in dev](001-mermaid-dev-render-delay.md)
