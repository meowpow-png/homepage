---
name: commit-message
description: Proposes a commit message after work is done. Use proactively once a change is finished.
---

After finishing an implementation, draft a commit message matching the user's style.

## Workflow

1. Reuse commit subjects already visible in context; otherwise run `git log -5 --format=%s`
2. Derive style: length, capitalization, mood/tense, punctuation, scope prefixes
3. Draft one message for the change just made, matching that style
4. Present as a suggestion only

## Constraints

- Never read more than 5 commits
- Never inspect diffs or commit bodies (subjects only)
- Never run `git commit` or any other write operation
