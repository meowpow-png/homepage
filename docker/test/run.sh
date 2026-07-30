#!/bin/sh

git config --global --add safe.directory /workspace

npm ci && npm run test:coverage && npm run test:e2e && npm run test:coverage:merge
status=$?

chown -R "$(stat -c '%u:%g' /workspace)" tests/output 2>/dev/null

exit "$status"
