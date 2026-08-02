# Note: Canonical 404 mismatch

## Context

While designing an e2e test to cover per-route page metadata
(title,description, canonical), I extended the test to also
check the not-found page, since the prerender script has
explicit 404 handling. That's where this surfaced.

## Observations

The prerendered 404 page correctly has no canonical link tag — the
prerender script passes a null canonical path for the 404 entry, and
the head-injection function omits the tag entirely when there's none.
But navigating to an unknown route client-side left a stale canonical
tag in place, still pointing at whatever route was last visited.

## Analysis

The client-side metadata effect unconditionally wrote or updated the
canonical link on every navigation. It never accounted for the "no
route matched" case, so on 404 it just kept whatever canonical tag
already existed from the previous page instead of removing it. The
server and client were following different rules for the same page.

## Conclusions

- Root cause: the client-side effect had no branch for "no route,"
  only "update the canonical to the current route." The server-side
  script did have that branch, which is why this only showed up client-side
- The two implementations need to encode the same rule (no route means
  no canonical) even though they run in very different environments —
  one renders to a string, the other updates a live DOM

## Next Steps

Fixed by adding the same "no route → remove the canonical tag"
branch to the client effect. Covered by the page-metadata case
in navigation tests, which navigates into an unknown path and
asserts zero canonical tags remain.

## References

None.
