# Note: E2E tests run in Docker, not on host

## Context

Added Playwright e2e tests per the testing docs' primary-user-journey
coverage. I didn't want Playwright's browser binaries touching my host
OS at all — the same constraint note `#002` hit with a build-time
headless-browser dependency on an immutable host. This time, instead
of avoiding the tool, the answer was to run it through Docker Compose.

## Observations

Pinned the compose service to Microsoft's official Playwright image,
version-matched to the installed test package, with its own isolated
volume for node_modules to avoid host/container binary conflicts.

Two permission issues followed. An exclusive SELinux mount label
locked this coding session itself out of the repo, since it also runs
in a bind-mounted container sharing the same mount — a shared label
fixed it. And running the container as root left coverage/test output
root-owned in the bind-mounted repo; pinning it to my own user instead
broke the install step, since a freshly created volume is
initialized root-owned by Docker before that user ever touches it.

## Analysis

Root-owned output is a mount-boundary problem, not a whole-container
one — only host-written directories need host ownership. Running as
root avoids the volume conflict, then handing those directories back
to the mount's actual owner, read dynamically rather than assumed,
as the last step gets the same result.

## Conclusions

- Root + reconcile-ownership-after beats pinning a non-root
  user once named volumes are involved
- Shared, not exclusive, SELinux labels are required wherever
  multiple containers or sessions share a bind mount
- The image must match the installed test package's version exactly

## Next Steps

Moved the run logic into its own script instead of an inline compose
command, for readability. Verified end-to-end; no further action planned.

## References

- [Considered build-time mermaid pre-rendering, reverted](002-mermaid-prerender-not-worth-it.md)
