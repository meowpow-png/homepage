#!/bin/sh
set -eu

version="$1"
file="CHANGELOG.md"
escaped_version=$(printf '%s' "$version" | sed 's/\./\\./g')

if ! grep -qE "^## \[$escaped_version\] - [0-9]{4}-[0-9]{2}-[0-9]{2}\$" "$file"; then
  echo "CHANGELOG.md has no dated entry for [$version]"
  exit 1
fi

echo "CHANGELOG.md has a dated entry for [$version]"
