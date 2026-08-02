# Workflow

## Branch overview

| Branch    | Purpose                                   |
| --------- | ----------------------------------------- |
| `main`    | Production                                |
| `dev`     | Preview (active development work)         |
| `topic/*` | Everything else — features, fixes, chores |

`main` and `dev` are long-lived. Everything else happens on `topic/*` — see below.

## Topic branches

A topic branch is a short-lived branch for one self-contained piece of work.
There's no separate prefix per kind of change — a typo fix and a new section
both just live under `topic/*`. Every topic branch must be tied to an actual
GitHub issue — that's what the merge commit below references.

Merge with `--no-ff`, referencing the issue it closes:

```sh
git switch dev
git merge --no-ff topic/42-fix-nav -m "Fix navigation issue" -m "Closes #42"
git push origin dev
```

`--no-ff` matters here: a plain merge often just fast-forwards with
no merge commit, leaving nowhere to put the issue reference. GitHub
only auto-closes an issue once a commit with `Closes #42` reaches
the default branch, so the issue stays open through staging
and closes when the fix actually ships, at release time.

## Versioning

Versions are CalVer, `YYYY.MM.PATCH`, tracked in `package.json`
and mirrored as a `v`-prefixed git tag:

```text
package.json → version: 2026.08.0
git tag      → v2026.08.0
```

`PATCH` resets to `0` when the month changes:

| Previous    | Next        |
| ----------- | ----------- |
| `2026.07.0` | `2026.07.1` |
| `2026.07.4` | `2026.08.0` |

The version bump happens once, right before cutting a release — not right
after one ships. Between releases, `package.json` just stays on whatever
version was last released, until it's time to prepare the next one.

## Releasing

1. Make sure `dev` is stable
2. Update changelog with dated entry for the target version
3. Bump `package.json` to that version and commit, then push
4. Wait for CI to pass on that commit
5. Tag the commit `-rc.N` and push the tag
6. If RC fails, fix it, commit, wait for CI, and re-tag with the next `-rc.N`
7. Once an RC passes, merge `dev` into `main`, referencing the release
8. Wait for CI to pass on `main`
9. Tag that commit (no `-rc`) and push the tag
10. Wait for Release workflow to succeed
11. Inspect resulting GitHub Release
12. Bring `dev` back in sync with `main`

> [!NOTE]
> RC and Release both check CI status for the tagged commit, so tagging
> before CI finishes fails immediately. That's why steps 4 and 8 come first.

To help visualize things:

```text
dev   ──●────●────●(rc.1)───────────────────────●──▶
                  │                             ▲
                  │ merge --no-ff               │ ff-only
                  ▼                             │
main  ─────────────────────────●(v2026.08.0)────●──▶
```

Here is how this looks in practice:

```sh
git switch dev
git add package.json CHANGELOG.md
git commit -m "Prepare release v2026.08.0"
git push origin dev

# wait for CI to pass on dev

git tag v2026.08.0-rc.1
git push origin v2026.08.0-rc.1

# wait for RC workflow to pass

git switch main
git merge --no-ff dev -m "Release v2026.08.0"
git push origin main

# wait for CI to pass on main

git tag v2026.08.0
git push origin v2026.08.0

# wait for release workflow to succeed
# then inspect GitHub Release

git switch dev
git merge --ff-only main
git push origin dev
```
