## Build and test

- Build Result: ${BUILD_RESULT}
- Tests Result: ${TEST_RESULT}

| Suite    | Files          | Tests          | Coverage             |
| -------- | -------------- | -------------- | -------------------- |
| Build    | ${BUILD_FILES} | ${BUILD_TESTS} | —                    |
| Unit     | ${UNIT_FILES}  | ${UNIT_TESTS}  | ${UNIT_COVERAGE}     |
| E2E      | ${E2E_FILES}   | ${E2E_TESTS}   | ${E2E_COVERAGE}      |
| Combined | —              | —              | ${COMBINED_COVERAGE} |

## Bundle size

| Check      | Size                | Limit                | Result                |
| ---------- | ------------------- | -------------------- | --------------------- |
| Main       | ${MAIN_BUNDLE_SIZE} | ${MAIN_BUNDLE_LIMIT} | ${MAIN_BUNDLE_RESULT} |
| Stylesheet | ${STYLESHEET_SIZE}  | ${STYLESHEET_LIMIT}  | ${STYLESHEET_RESULT}  |

${FOOTER}
