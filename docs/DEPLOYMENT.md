# Deployment

## Environments

| Environment | Branch    | URL                           |
| ----------- | --------- | ----------------------------- |
| Production  | `main`    | `https://meowpow.dev`         |
| Staging     | `dev`     | `https://staging.meowpow.dev` |
| Preview     | `topic/*` | Vercel preview deployment     |

Staging is public and always reflects what's about to ship. Vercel deploys
all branches automatically; however, only production and preview get a
stable domain, topic branches just get a throwaway preview URL each.

## Conditions

Vercel deploys every push by default, even ones that don't touch the
built site. This means that any edit to documentation such as a README
typo, update to `CHANGELOG.md` triggers deployment. Configuration in
`vercel.json` skips those, only deploying when a push actually
changes something that affects the built site

See `vercel.json` for the exact list of paths that count.
It's deliberately different from the path filters in `ci.yml`, which
decide what to test. This decides what to deploy, so don't merge the two.
