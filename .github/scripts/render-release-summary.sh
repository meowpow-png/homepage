#!/bin/sh
set -eu

result() {
  if [ "$1" = "success" ]; then
    echo "✅ Passed"
  else
    echo "❌ Failed"
  fi
}

CI_RESULT=$(result "$CI_OUTCOME")
VERSION_RESULT=$(result "$VERSION_OUTCOME")
CHANGELOG_RESULT=$(result "$CHANGELOG_OUTCOME")
PUBLISH_RESULT=$(result "$PUBLISH_OUTCOME")

sed \
  -e "s|\${TAG}|$TAG|g" \
  -e "s|\${CI_RESULT}|$CI_RESULT|g" \
  -e "s|\${VERSION_RESULT}|$VERSION_RESULT|g" \
  -e "s|\${CHANGELOG_RESULT}|$CHANGELOG_RESULT|g" \
  -e "s|\${PUBLISH_RESULT}|$PUBLISH_RESULT|g" \
  .github/templates/release-summary.md
