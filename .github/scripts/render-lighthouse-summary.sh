#!/bin/sh
set -eu

MANIFEST=.lighthouseci/manifest.json

if [ ! -f "$MANIFEST" ]; then
  exit 0
fi

score_cell() {
  awk -v score="$1" 'BEGIN {
    pct = int(score * 100 + 0.5)
    if (score >= 0.9) icon = "✅"
    else if (score >= 0.5) icon = "⚠️"
    else icon = "❌"
    printf "%s %d", icon, pct
  }'
}

cat .github/templates/lighthouse-summary.md

jq -r '.[] | [.url, .summary.performance, .summary.accessibility, .summary["best-practices"], .summary.seo] | @tsv' "$MANIFEST" \
  | sort \
  | while IFS="$(printf '\t')" read -r url perf a11y bp seo; do
      path=$(echo "$url" | sed -E 's#^[a-z]+://[^/]+##')
      [ -z "$path" ] && path="/"
      printf '| %s | %s | %s | %s | %s |\n' \
        "$path" "$(score_cell "$perf")" "$(score_cell "$a11y")" "$(score_cell "$bp")" "$(score_cell "$seo")"
    done

echo
echo "Full reports: download \`lighthouse-report\` and open \`index.html\`."
