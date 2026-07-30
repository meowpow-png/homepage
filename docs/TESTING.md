# Testing

Focus on testing custom behavior rather than framework functionality.

The goal is to keep the test suite small and valuable by verifying
deterministic logic instead of maximizing code coverage.

## Unit Tests

Unit tests should cover pure functions, extracted utilities, and custom build
infrastructure such as Vite plugins. This includes routing logic, URL generation,
metadata processing, content transformation, validation, and other deterministic
behavior that can be verified independently of the application.

Components should only be tested when they contain meaningful application logic;
purely presentational components and simple render assertions generally provide little value.

## End-to-End Tests

End-to-end tests should validate the primary user journeys by
exercising the application in a browser, ensuring navigation,
routing, and page rendering work together as expected.

## Build Tests

Build tests check what `npm run build` actually produces: the static
HTML pages the prerender step writes out. That output is what a search 
crawler or link-preview bot sees, and no browser is involved in producing
it, so neither unit nor e2e tests can catch a regression there.

They cover:

- every route gets its own prerendered page
- each page has real rendered content, not an empty shell
- title, description, and canonical tags match the page's actual metadata
- no dev-only asset paths leak into the output
- no build cruft gets left behind

They only make sense after a real build, so they never run before it,
and never mix into the unit suite. They also read metadata from the
same place the build does, instead of repeating the wording, so they
don't break every time someone edits a title or description.

## Test Structure

Store all tests in a dedicated tests directory. Unit and build
tests should generally mirror `src` directory structure, while 
end-to-end tests should be organized by user journey.

For example:

```text
tests/
├── unit/
│   ├── shared/
│   ├── routing/
│   ├── sections/
│   └── vite/
├── build/
│   ├── routeFiles.test.ts
│   ├── metadata.test.ts
│   └── ...
└── e2e/
    ├── navigation.test.ts
    ├── blog.test.ts
    └── ...
```

## Running Tests

```sh
npm test                # unit tests
npm run coverage        # unit tests, with coverage
npm run build           # required once before test:build, writes dist/
npm run test:build      # build tests, against dist/
npm run e2e             # e2e tests
npm run coverage:merge  # merge unit + e2e coverage into one report
```

`npm run e2e` needs a Chromium install. If you'd rather not
put a browser on your machine, run the whole suite in Docker instead:

```sh
just e2e-test
```

This runs coverage, e2e, and the merge step together and writes
everything to `tests/output/`, so it works the same whether
you ran it locally or in the container.

`just test` and `just coverage` are shortcuts for the first two npm scripts above.

## Reading Coverage

`coverage:merge` writes reports to `tests/output/coverage/`:

```text
coverage/
├── unit/      # unit tests only
├── e2e/       # e2e tests only
└── combined/  # both merged
```

All reports are measured against the whole codebase, not just the files each
run happens to touch, so they're directly comparable. Combined report will
always be the highest of the three, since it's the union of the other two.

See [004-e2e-coverage-baseline.md](notes/004-e2e-coverage-baseline.md)
for why that took some fixing.

Each folder's `coverage-summary.json` has the raw numbers; `index.html`
is the browsable report. CI posts the same three numbers in the job summary
on every run, so you don't need to open either to get a quick read.
