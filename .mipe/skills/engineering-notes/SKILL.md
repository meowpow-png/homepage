---
name: engineering-notes
description: Writes engineering notes. Use after an investigation, experiment, or non-obvious technical decision.
---

An engineering note captures technical knowledge that isn't derivable from the code itself:
It is not a changelog or a design doc — it's a record for future-me of *why*, backed by evidence.

## Workflow

1. Read `docs/notes/000-note-template.md` for the current section structure
2. List `docs/notes/` to find the highest `NNN-` prefix in use
3. Draft the note as `docs/notes/{{next NNN}}-{{kebab-case-title}}.md`
4. Fill in every template section without exception
5. Link related notes with a relative markdown link, e.g. `[Title](001-slug.md)`,
   both inline where relevant and under References. Include only links to related notes

## Constraints

- Replace every `{{placeholder}}` — never leave one in the final document
- Never leave the template's own instructions in the output
- If there are no relevant references, write "None." rather than an empty section
- Write content strictly from a first-person perspective

## Keep it concise

A note that restates the same fact three times across sections
is harder to use than a short one. Default to trimming:

- State a measurement or fact once, in the section it belongs to
- Prefer one representative number over a table of every number gathered
- Conclusions and Next Steps should read as a distinct addition to what
  Observations and Analysis already said, not a rephrasing of it
- Cut a sentence if removing it loses no information a future reader needs
