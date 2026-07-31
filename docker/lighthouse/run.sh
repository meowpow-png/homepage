#!/bin/sh

npm ci --ignore-scripts && npm run lighthouse
status=$?

chown -R "$(stat -c '%u:%g' /workspace)" .lighthouseci 2>/dev/null

exit "$status"
