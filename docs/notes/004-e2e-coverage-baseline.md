# Note: E2E coverage needed a full-codebase baseline

## Context

While wiring per-scope coverage (unit / e2e / combined) into the CI
job summary, I noticed something that shouldn't be possible: e2e-only
coverage read 78.99%, higher than the combined figure of 70.72%.
Combined is built by merging unit and e2e coverage maps together,
so it can only go up relative to either source alone, never down.

## Observations

`vite-plugin-istanbul` only instruments files the browser actually
loads during a run — it instrumented 37 files across the e2e suite.
Vitest's istanbul provider works differently: by default it eagerly
reports every file matching its `src/` include pattern, even ones
no test ever imports, at 0% baseline. The unit run's file set
(36 files) reflected that exhaustive scan.

So the e2e-only report was never measuring "how much of the codebase
does e2e cover." It was measuring "how much of the files e2e happened
to load does e2e cover" — a smaller, self-selected denominator
biased toward whatever the visited routes pulled in.

## Analysis

I checked `vite-plugin-istanbul`'s docs for an option to eagerly
instrument every matching file regardless of whether it's loaded,
the way Vitest's provider does. It doesn't have one — the plugin
only hooks Vite's transform pipeline for modules actually requested.

The fix had to happen at the merge step. Before merging e2e's raw
coverage into its own report, I seed a zeroed-out copy of the unit
run's file set (already exhaustive over `src/`) as a baseline, then
merge the real e2e hits on top. Files e2e never touched now stay
present at 0% instead of being absent from the report entirely,
so e2e-only and combined share the same denominator.

## Conclusions

- E2e-only dropped from 78.99% to 56.9% once measured against the
  full file set, correctly landing below combined's 70.72%
- The root cause was mismatched denominators between two
  independently-instrumented reports, not a bug in the merge logic
- Vitest's istanbul provider and `vite-plugin-istanbul` differ in a
  way that isn't obvious from either tool's output alone: one report
  is exhaustive by default, the other only covers what actually ran

## Next Steps

None. Implemented and verified end-to-end against
real coverage data before landing.

## References

- [E2E tests run in Docker, not on host](003-e2e-tests-run-in-docker-not-on-host.md)
