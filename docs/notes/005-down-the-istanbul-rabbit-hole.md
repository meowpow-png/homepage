# Note: Down the Istanbul rabbit hole

## Context

Pushing combined coverage from ~75% toward the 80% badge threshold,
I'd already closed the cheap, legitimate gaps (dead code, untested 
pure functions). What was left was concentrated in the site navigation
component, fully exercised by passing e2e tests yet reported well
below 100%. I wanted to know whether that gap was real missing
coverage or a measurement problem before writing more tests
aimed at code that might already be running.

## Observations

E2e coverage runs against the dev server both locally and in CI —
confirmed identical, 74.82% (547/731 lines), on two independent runs.

The raw istanbul statement map for the component mapped statements
up to line 168, against a real 105-line source file. The first two
statements after the function signature — a state hook and a ref
hook, which must execute on every render — showed 0 hits despite
the component mounting on every one of the suite's ~10 page loads.

Forcing coverage instrumentation into a production build and running
one isolated e2e test against it gave a clean result: 21 statements,
max line 98, and the previously-zero lines at 7 hits. Running the 
full 10-test suite against that same, unrebuilt bundle reproduced 
the broken shape again — on both my machine and the user's,
regardless  of parallelism or server-reuse settings.

Combined coverage barely moved between the two measurements: 74.82%
(547/731) vs. 74.23% (317/427). The total line count itself dropped 
by 304 under production — mostly-static components instrument down 
to a handful of statements once dev-only tracking code isn't
there to inflate them.

## Analysis

Ruled out, in order:

- Plugin ordering — forcing the instrumentation plugin to run after
  every other transform didn't change the statement map at all
- Stale build — the one built file containing the component had an
  unchanged timestamp across both the isolated and full-suite runs
- Chunk duplication — only one built file references the component,
  so there's no second, differently-instrumented copy being loaded
- Parallelism and server-reuse settings — toggled independently,
  same broken result both times
- Test global setup — only deletes the coverage output directory;
  unrelated

The working theory going in was that React's dev-only Fast Refresh
injects hook-tracking code that breaks the sourcemap-based line
attribution. The isolated production-build test supported this. But
the full-suite result contradicts it under the exact same, unrebuilt
build — and since the served code is provably identical between the
two runs, "different code got served" can't explain the difference
either. I stopped without finding a mechanism that fits all the
evidence.

## Conclusions

Part of the gap to 80% is a measurement artifact, not missing test
coverage — but there's no free fix. Production build measurement
trades one distortion for another (fewer phantom uncovered lines, but
a proportionally smaller denominator), so it isn't worth adopting on
its own. The root cause remains open: something about running the
full suite, not just this file or this build, resets or corrupts
istanbul's attribution, and every mechanism I could name
for that was individually ruled out.

## Next Steps

Given TESTING.md's own stance against maximizing the coverage number,
I'm not planning to keep chasing the remaining gap. This note exists
so that future me who notices the same components looking suspiciously 
undercovered doesn't re-derive all of the above from scratch.

## References

- [E2E coverage needed a full-codebase baseline](004-e2e-coverage-baseline.md)
- [E2E tests run in Docker, not on host](003-e2e-tests-run-in-docker-not-on-host.md)
