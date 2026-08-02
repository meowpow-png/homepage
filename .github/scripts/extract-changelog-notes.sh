#!/bin/sh
set -eu

version="$1"
file="CHANGELOG.md"
escaped_version=$(printf '%s' "$version" | sed 's/\./\\./g')

awk -v version="$escaped_version" '
  $0 ~ "^## \\[" version "\\]" { found=1; next }
  found && /^## / { exit }
  found { print }
' "$file"
