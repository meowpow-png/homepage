#!/bin/sh

npm ci --ignore-scripts && npm run lighthouse && npm run lighthouse:index
status=$?

chown -R "$(stat -c '%u:%g' /workspace)" dist .lighthouseci 2>/dev/null

exit "$status"
