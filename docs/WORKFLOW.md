# Workflow

## Branch overview

| Branch    | Purpose                                   |
|-----------|-------------------------------------------|
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

## Environments

| Environment | Branch    | URL                           |
|-------------|-----------|-------------------------------|
| Production  | `main`    | `https://meowpow.dev`         |
| Staging     | `dev`     | `https://staging.meowpow.dev` |
| Preview     | `topic/*` | Vercel preview deployment     |

Staging is public and always reflects what's about to ship. Vercel deploys
all branches automatically; however, only production and preview get 
stable domain, topic branches just get a throwaway preview URL each.

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
2. Update `CHANGELOG.md`
3. Bump the version in `package.json` and commit
4. Promote `dev` to `main`
5. Tag the release and push
6. CI creates the GitHub Release and deploys production
7. Bring `dev` back in sync with `main`

```sh
git switch main

git merge --no-ff dev -m "Release v2026.08.0"

git tag v2026.08.0
git push origin main --tags

git switch dev
git merge --ff-only main
git push origin dev
```
