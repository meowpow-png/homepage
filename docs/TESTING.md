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

## Test Structure

Store all tests in a dedicated tests directory. Unit tests should generally mirror 
`src` directory structure, while end-to-end tests should be organized by user journey. 

For example:

```text
tests/
├── unit/
│   ├── shared/
│   ├── routing/
│   ├── sections/
│   └── vite/
└── e2e/
    ├── navigation.test.ts
    ├── blog.test.ts
    └── projects.test.ts
```

## Running Tests

```sh
npm test                # unit tests
npm run coverage        # unit tests, with coverage
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
