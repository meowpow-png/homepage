# Contributing

Notes for anyone poking around this repo, including future me.

## Content

Projects, blog posts, and questions all live in `src/content/` as `.mdx` files.

See [CONTENT.md](docs/CONTENT.md) for more information on how to write content.

## Quality checks

Before you push, run:

```sh
npm run verify
```

See [QUALITY.md](docs/QUALITY.md) for what each check does and how to fix what it flags.

## Testing

See [TESTING.md](docs/TESTING.md) for what to test, how tests are organized, and how to run them.

## Releasing

Releases are cut from `dev` and promoted to `main` on a CalVer schedule.

See [WORKFLOW.md](docs/WORKFLOW.md) for branching, versioning, and release steps.
