#!/bin/sh
set -eu

[ -z "${VERCEL_GIT_PREVIOUS_SHA:-}" ] && exit 1

# requires VERCEL_DEEP_CLONE=true configured as vercel project env var
# so this clone has full history; otherwise $VERCEL_GIT_PREVIOUS_SHA can
# fall outside default shallow depth after several skipped builds in a row
BUILD_PATHS="src package.json package-lock.json .npmrc tsconfig*.json vite.config.ts vite.plugins.ts index.html scripts/prerender.js"

# shellcheck disable=SC2086
# keep $BUILD_PATHS unquoted; quoting turns this
# into one non-matching pathspec, hiding real changes
git diff --quiet "$VERCEL_GIT_PREVIOUS_SHA" HEAD -- $BUILD_PATHS
