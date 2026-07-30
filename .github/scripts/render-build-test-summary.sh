#!/bin/sh
set -eu

result() {
  if [ "$1" = "success" ]; then
    echo "✅ Passed"
  else
    echo "❌ Failed"
  fi
}

coverage_pct() {
  if [ -f "$1" ]; then
    printf '%s%%\n' "$(jq -r '.total.lines.pct' "$1")"
  else
    echo "N/A"
  fi
}

fmt_count() {
  if [ "$1" = "$2" ]; then
    echo "✅ $1 / $2"
  else
    echo "❌ $1 / $2"
  fi
}

# vitest's json reporter: one entry in testResults per test file
vitest_files() {
  if [ -f "$1" ]; then
    fmt_count \
      "$(jq '[.testResults[] | select(.status == "passed")] | length' "$1")" \
      "$(jq '.testResults | length' "$1")"
  else
    echo "—"
  fi
}

vitest_tests() {
  if [ -f "$1" ]; then
    fmt_count "$(jq '.numPassedTests' "$1")" "$(jq '.numTotalTests' "$1")"
  else
    echo "—"
  fi
}

# playwright's json reporter has no simple pass/fail count per suite,
# so this is just the suite (file) count, not a pass/fail split
playwright_files() {
  if [ -f "$1" ]; then
    jq '.suites | length' "$1"
  else
    echo "—"
  fi
}

playwright_tests() {
  if [ -f "$1" ]; then
    fmt_count \
      "$(jq '.stats.expected' "$1")" \
      "$(jq '.stats.expected + .stats.unexpected + .stats.skipped + .stats.flaky' "$1")"
  else
    echo "—"
  fi
}

BUILD_RESULT=$(result "$BUILD_OUTCOME")
TEST_RESULT=$(result "$TEST_OUTCOME")

BUILD_FILES=$(vitest_files tests/output/reports/build.json)
BUILD_TESTS=$(vitest_tests tests/output/reports/build.json)

UNIT_FILES=$(vitest_files tests/output/reports/unit.json)
UNIT_TESTS=$(vitest_tests tests/output/reports/unit.json)

E2E_FILES=$(playwright_files tests/output/reports/e2e.json)
E2E_TESTS=$(playwright_tests tests/output/reports/e2e.json)

UNIT_COVERAGE=$(coverage_pct tests/output/coverage/unit/coverage-summary.json)
E2E_COVERAGE=$(coverage_pct tests/output/coverage/e2e/coverage-summary.json)
COMBINED_COVERAGE=$(coverage_pct tests/output/coverage/combined/coverage-summary.json)

FOOTER=""
for outcome in "$BUILD_OUTCOME" "$TEST_OUTCOME"; do
  if [ "$outcome" != "success" ]; then
    FOOTER="See [TESTING.md](docs/TESTING.md) for how tests are organized and how to run them locally."
    break
  fi
done

sed \
  -e "s|\${BUILD_RESULT}|$BUILD_RESULT|g" \
  -e "s|\${TEST_RESULT}|$TEST_RESULT|g" \
  -e "s|\${BUILD_FILES}|$BUILD_FILES|g" \
  -e "s|\${BUILD_TESTS}|$BUILD_TESTS|g" \
  -e "s|\${UNIT_FILES}|$UNIT_FILES|g" \
  -e "s|\${UNIT_TESTS}|$UNIT_TESTS|g" \
  -e "s|\${E2E_FILES}|$E2E_FILES|g" \
  -e "s|\${E2E_TESTS}|$E2E_TESTS|g" \
  -e "s|\${UNIT_COVERAGE}|$UNIT_COVERAGE|g" \
  -e "s|\${E2E_COVERAGE}|$E2E_COVERAGE|g" \
  -e "s|\${COMBINED_COVERAGE}|$COMBINED_COVERAGE|g" \
  -e "s|\${FOOTER}|$FOOTER|g" \
  .github/templates/build-test-summary.md
