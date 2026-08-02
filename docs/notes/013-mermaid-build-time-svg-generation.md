# Note: Mermaid build-time SVG generation

## Context

Follow-up to [Mermaid prerender not worth it](002-mermaid-prerender-not-worth-it.md).

Previously I rejected pre-rendering mermaid diagrams to static SVG because
it made a headless browser a mandatory part of every build, for every
environment that runs it. I revisited the idea while looking into a
small pop-in delay and layout collision on the one post with diagrams,
this time generating the SVGs as a manual, local step instead of a build step.

## Observations

I wrote `generate-diagram-svg.js` script, driven by Playwright's Chromium,
against a throwaway Vite dev server serving `design/diagrams/render.ts`.
That script loads mermaid, renders each `.mmd` source in `design/diagrams/source/`,
and writes the result into `src/shared/assets/images/` as a committed
asset, the same way the existing PNG screenshots in that folder are handled.

Getting from mermaid's raw output to a usable standalone image surfaced two
real bugs. First, mermaid sizes its SVG for inline embedding, `width="100%"`
plus a `max-width` style, which gives a standalone `<img>` no intrinsic size
to lay out with. Both diagrams loaded with `naturalWidth` and `naturalHeight`
at zero until I rewrote those to explicit pixel values read off the `viewBox`.

With both diagrams rendering as correctly, I deleted the runtime `Mermaid`
component entirely and moved `mermaid` from `dependencies` to `devDependencies`.
The architecture post's own JS chunk dropped to 3 KB, and the production build
no longer ships mermaid, or any diagram-renderer code to the client at all.

## Analysis

This reaches the same end state note `#002` evaluated: static SVG, no mermaid
in the client bundle, no client-side render cost.

What changed is where the headless browser runs. Other version ran it on
every build, so it had to work everywhere the project gets built, including
CI and other people's machines. This version only runs on my own machine,
only when a diagram source actually changes, and its output is an ordinary
asset file like any other image already committed to the repo.

The sizing bug was never really a mermaid quirk. It's the general
gap between an SVG meant to be inlined into a document and an SVG
meant to stand alone as an image resource, the two are parsed
and sized under different rules by the same browser.

## Conclusions

- Confirmed: local generation gets the same static-SVG outcome
  note `#002` rejected, without making a headless browser
  part of the build for anyone but me
- Confirmed, via `naturalWidth`/`naturalHeight` checks in a live browser
  across dev, `vite preview`, and the prerendered build: both diagrams
  render at correct size with no runtime mermaid involved
- Root cause of the sizing bug was standalone-image SVG requiring explicit
  dimensions and well-formed strict XML, not anything specific to mermaid

## Next Steps

None. Re-run `npm run generate:diagram-svgs` and commit the output
whenever a diagram's source changes.

## References

- [Mermaid prerender not worth it](002-mermaid-prerender-not-worth-it.md)
- [Slow first mermaid diagram render in dev](001-mermaid-dev-render-delay.md)
- [Streaming SSR and blog content split](010-streaming-ssr-and-blog-content-split.md)
