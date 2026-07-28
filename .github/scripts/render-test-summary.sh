#!/bin/sh
set -eu

result() {
  if [ "$1" = "success" ]; then
    echo "✅ Passed"
  else
    echo "❌ Failed"
  fi
}

BUILD_RESULT=$(result "$BUILD_OUTCOME")
TEST_RESULT=$(result "$TEST_OUTCOME")

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
  -e "s|\${FOOTER}|$FOOTER|g" \
  .github/templates/test-summary.md
