# Quality

Quality check passes when:

- the project builds
- code is formatted, linted, and type-checked
- there are no unused exports or dependencies

Run all quality checks:

```sh
npm run qualitycheck
```

That runs all quality checks sequentially. It keeps going
even if one of them fails, so you see everything that's
wrong in one pass instead of one at a time.

> [!NOTE]
> `npm run verify` runs `qualitycheck` plus the test suite. A `pre-push`
> hook runs `verify` automatically via lefthook, installed by `npm install`.
> No separate setup needed.

## Formatting

Formatting uses Prettier, catching spacing, quotes, that kind of thing.
Instead of fixing it by hand, just run:

```sh
npm run format
```

There's also an IDEA code style in `.idea/codeStyles/` that should
auto-load if you're using WebStorm. It's close to Prettier but not identical,
so saving in WebStorm gets you maybe 80% of the way there.

You should still run `npm run format` before pushing to catch what IDE style doesn't.

## Linting

Linting uses ESLint for JS/TS, catching real bugs Prettier won't touch.
ESLint doesn't understand CSS though, so Stylelint covers that instead.

Most of it can be fixed automatically too:

```sh
npm run lint:fix
```

## Type checking

Type checking uses plain `tsc -b`. There's no auto-fix here,
you actually have to fix the types:

```sh
npm run typecheck
```

## Exports and dependencies

Knip is used for flagging unused files, exports, and dependencies.
No auto-fix here, if it flags something you either delete it or it's a false positive:

```sh
npm run knip
```

## Image prefetch

Checks that every image imported in `src/content/` or `src/sections/`
is also registered in [prefetchImages.ts](../src/shared/routing/prefetchImages.ts):

```sh
npm run check:image-prefetch
```

This one's advisory, not a gate. A missing registration doesn't
break anything, it just means that image won't be warmed ahead of time.

See [Adding an image](CONTENT.md#adding-an-image) for how to register one.

## Lighthouse

Lighthouse audits SEO, performance, accessibility,
and best practices against a real production build.

Here is how to run the audit:

```sh
npm run lighthouse
```

That builds the site, runs Lighthouse against every page in the sitemap,
and writes reports to `.lighthouseci/`. Open `.lighthouseci/index.html`
for a page listing every audited URL with its scores.

No usable local Chrome? Run it in Docker instead:

```sh
just audit
```

## CI

CI runs the same checks on every push and PR, gated to when the relevant
files change. Running `verify` locally just means you find out before
CI does, instead of waiting on a check to fail.
