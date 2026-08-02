#!/bin/sh
set -eu

result() {
  if [ "$1" = "success" ]; then
    echo "✅ Passed"
  else
    echo "❌ Failed"
  fi
}

VERSION_RESULT=$(result "$VERSION_OUTCOME")
CHANGELOG_RESULT=$(result "$CHANGELOG_OUTCOME")

sed \
  -e "s|\${TAG}|$TAG|g" \
  -e "s|\${VERSION_RESULT}|$VERSION_RESULT|g" \
  -e "s|\${CHANGELOG_RESULT}|$CHANGELOG_RESULT|g" \
  .github/templates/rc-summary.md
