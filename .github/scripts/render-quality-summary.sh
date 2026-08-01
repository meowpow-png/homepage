#!/bin/sh
set -eu

result() {
  if [ "$1" = "success" ]; then
    echo "✅ Passed"
  else
    echo "❌ Failed"
  fi
}

image_prefetch_result() {
  file=image-prefetch-report.txt
  if [ -s "$file" ]; then
    printf '⚠️ %s not registered\n' "$(grep -c '^  - ' "$file")"
  else
    echo "✅ All registered"
  fi
}

FORMAT_RESULT=$(result "$FORMAT_OUTCOME")
LINT_RESULT=$(result "$LINT_OUTCOME")
TYPECHECK_RESULT=$(result "$TYPECHECK_OUTCOME")
KNIP_RESULT=$(result "$KNIP_OUTCOME")
IMAGE_PREFETCH_RESULT=$(image_prefetch_result)

FOOTER=""
for outcome in "$FORMAT_OUTCOME" "$LINT_OUTCOME" "$TYPECHECK_OUTCOME" "$KNIP_OUTCOME"; do
  if [ "$outcome" != "success" ]; then
    FOOTER="See [QUALITY.md](docs/QUALITY.md) for what each check does and how to fix it locally."
    break
  fi
done

sed \
  -e "s|\${FORMAT_RESULT}|$FORMAT_RESULT|g" \
  -e "s|\${LINT_RESULT}|$LINT_RESULT|g" \
  -e "s|\${TYPECHECK_RESULT}|$TYPECHECK_RESULT|g" \
  -e "s|\${KNIP_RESULT}|$KNIP_RESULT|g" \
  -e "s|\${IMAGE_PREFETCH_RESULT}|$IMAGE_PREFETCH_RESULT|g" \
  -e "s|\${FOOTER}|$FOOTER|g" \
  .github/templates/quality-summary.md
