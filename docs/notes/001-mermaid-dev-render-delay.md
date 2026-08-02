# Note: Slow first mermaid diagram render in dev

## Context

Rendering a mermaid diagram (`src/shared/components/Mermaid.tsx`)
took ~1 second in dev — high for a couple of small flowcharts.

## Observations

In a production build, both diagrams loaded and rendered in ~200ms. In dev,
on a cold Vite cache, the same page took ~1055ms. Resource timing showed
`mermaid.js` loading fine, then a ~320ms gap before `flowDiagram-*.js`
(mermaid's internally lazy-loaded flowchart renderer) was even requested —
and everything after that gap reloaded under a new `?v=` hash. Reloading
the page again (deps already cached) dropped nav time to ~112ms.

## Analysis

Mermaid v11 lazily `import()`s a renderer per diagram type instead of
shipping one bundle. Vite's dev-server only discovers dependencies reachable
by static imports at startup, so it had no way to know `flowDiagram-*.js`
existed until the diagram actually rendered. The hash change is Vite's
"new dependency found mid-request → re-optimize → reload" cycle — that
cycle, not mermaid itself, caused the delay. Production is unaffected
because Rollup resolves the full dependency graph statically ahead of time.

I also confirmed that eagerly importing mermaid's parsers at startup would
not fix the smaller 100-200ms delay seen on client-side (SPA) navigation
back to the page. Ny then modules are already cached, so that cost is
`mermaid.render()`'s real work (parsing, dagre layout, DOM text measurement),
which runs on every mount regardless of module load time.

## Conclusions

- Root cause: Vite's static-only dependency scan can't see dynamic
  imports buried inside a pre-bundled dependency's internals,
  causing a one-time re-optimization stall on first render in dev
- Not a production issue, and not fixable by eager-loading parsers

## Next Steps

Added `mermaid` to `optimizeDeps.include` in `vite.config.ts` — verified this
removes the stall (single `?v=` hash, ~160ms nav on cold cache).

The residual 100-200ms client-side render cost is unaddressed. Since these
diagrams are static content, the likely follow-up is pre-rendering them to
SVG at build time (e.g. `rehype-mermaid`) and dropping the client-side
`mermaid` dependency. Not yet implemented.

## References

_None._
