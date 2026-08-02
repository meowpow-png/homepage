#!/bin/sh

git config --global --add safe.directory /workspace

npm ci && npm run generate:diagram-svgs
status=$?

chown -R "$(stat -c '%u:%g' /workspace)" src/shared/assets/images 2>/dev/null

exit "$status"
