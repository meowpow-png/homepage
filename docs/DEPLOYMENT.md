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
built site. Configuration in `vercel.json` skips those, only deploying
when a push actually changes something that affects the built site

See `vercel.json` for the exact list of paths that count.

## Caching

| Path           | Cache-Control                         |
| -------------- | ------------------------------------- |
| `/assets/*`    | `public, max-age=31536000, immutable` |
| `/`            | revalidates every request             |
| `/sitemap.xml` | revalidates every request             |
| `/robots.txt`  | revalidates every request             |

`/assets/*` is set explicitly. Those filenames are content-hashed,
so caching them for a year is safe. A new build produces a
new filename, it never overwrites an old one.

Everything else is left at Vercel's default on purpose. HTML references
the _current_ asset hashes, so caching it long-term risks serving a page
that points at assets from a deployment that's since been replaced.

## Staging checks

These hit `https://staging.meowpow.dev` directly rather than anything
in `dist/`. Some things, such as response headers, what's actually
live ect. only exist once Vercel serves the response,
so there's no local or build-time equivalent.

To check `Cache-Control` and edge cache status per path:

```sh
npm run check:caching-headers
```

To verify that every URL in the sitemap renders
real content, not an unresolved suspended boundary run:

```sh
npm run check:prerendered-content
```

To run all staging checks:

```sh
npm run check:staging
```
