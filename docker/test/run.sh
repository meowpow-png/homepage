#!/bin/sh

git config --global --add safe.directory /workspace

npm ci && npm run coverage && npm run e2e && npm run coverage:merge
status=$?

chown -R "$(stat -c '%u:%g' /workspace)" tests/output 2>/dev/null

exit "$status"
