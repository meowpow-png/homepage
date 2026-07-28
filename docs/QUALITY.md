# Quality

Before you push, run:

```sh
npm run verify
```

That runs formatting, linting, type checking, knip, a full build,
and the test suite with coverage, one after another. It keeps going
even if one of them fails, so you see everything that's wrong in
one pass instead of one at a time.

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

## CI

CI runs the same checks on every push and PR, gated to when the relevant
files change. Running `verify` locally just means you find out before
CI does, instead of waiting on a check to fail.
