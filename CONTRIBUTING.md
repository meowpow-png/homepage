# Contributing

Notes for anyone poking around this repo, including future me.

## Writing content

Projects, blog posts, and questions all live in `src/content/` as `.mdx` files.

See [CONTENT.md](docs/CONTENT.md) for more information on how to write content.

## Committing work

`main` and `dev` are long-lived branches for production and staging. 

You can commit to `dev` directly, but prefer a short-lived `topic/*`
branch tied to a GitHub issue instead. Topic branches get its own Vercel
preview URL to check your work, and merging it back into `dev` gives 
the issue a clean reference to the commit that resolved it.

See [Branch overview](docs/WORKFLOW.md#branch-overview) and
[Topic branches](docs/WORKFLOW.md#topic-branches) for more details.

## Deploying

Vercel deploys `main`, `dev`, and every `topic/*` branch automatically.
Docs-only changes like fixing README typos don't trigger a deploy.

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for more information.

## Inspecting quality

Before you push, run:

```sh
npm run verify
```

See [QUALITY.md](docs/QUALITY.md) for what each check does and how to fix what it flags.

## Testing

See [TESTING.md](docs/TESTING.md) for what to test, how tests are organized, and how to run them.

## Cutting a release

Releases are cut from `dev` and promoted to `main` on a CalVer schedule.

See [Versioning](docs/WORKFLOW.md#versioning) and
[Releasing](docs/WORKFLOW.md#releasing) in WORKFLOW.md for the details.
