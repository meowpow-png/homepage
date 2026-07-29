#!/bin/sh
set -eu

[ -z "${VERCEL_GIT_PREVIOUS_SHA:-}" ] && exit 1

# Vercel's shallow clone may not contain $VERCEL_GIT_PREVIOUS_SHA
# once a few deploys in a row get skipped; unshallow so diff below can resolve it
git fetch --quiet --unshallow 2>/dev/null || true

BUILD_PATHS="src package.json package-lock.json .npmrc tsconfig*.json vite.config.ts vite.plugins.ts index.html"

# shellcheck disable=SC2086
# keep $BUILD_PATHS unquoted; quoting turns this
# into one non-matching pathspec, hiding real changes
git diff --quiet "$VERCEL_GIT_PREVIOUS_SHA" HEAD -- $BUILD_PATHS
