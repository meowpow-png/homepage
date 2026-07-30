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

BUILD_RESULT=$(result "$BUILD_OUTCOME")
TEST_RESULT=$(result "$TEST_OUTCOME")

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
  -e "s|\${UNIT_COVERAGE}|$UNIT_COVERAGE|g" \
  -e "s|\${E2E_COVERAGE}|$E2E_COVERAGE|g" \
  -e "s|\${COMBINED_COVERAGE}|$COMBINED_COVERAGE|g" \
  -e "s|\${FOOTER}|$FOOTER|g" \
  .github/templates/build-test-summary.md
