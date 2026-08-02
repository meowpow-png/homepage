#!/bin/sh
set -eu

file=tests/output/coverage/combined/coverage-summary.json

if [ ! -f "$file" ]; then
  exit 0
fi

pct=$(jq -r '.total.lines.pct' "$file")
color=$(awk -v pct="$pct" 'BEGIN {
  if (pct >= 80) print "brightgreen"
  else if (pct >= 60) print "yellow"
  else print "red"
}')

echo "coverage=${pct}%"
echo "color=${color}"
