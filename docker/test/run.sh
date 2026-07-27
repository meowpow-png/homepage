#!/bin/sh

git config --global --add safe.directory /workspace &&
npm ci &&
npm run coverage &&
npm run e2e
status=$?

chown -R "$(stat -c '%u:%g' /workspace)" coverage test-results playwright-report 2>/dev/null

exit "$status"
