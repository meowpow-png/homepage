#!/bin/sh
set -eu

[ -z "${VERCEL_GIT_PREVIOUS_SHA:-}" ] && exit 1

BUILD_PATHS="src package.json package-lock.json .npmrc tsconfig*.json vite.config.ts vite.plugins.ts index.html"

git diff --quiet "$VERCEL_GIT_PREVIOUS_SHA" HEAD -- "$BUILD_PATHS"
