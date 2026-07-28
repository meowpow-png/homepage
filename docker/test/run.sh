#!/bin/sh

run_tests() {
  npm run coverage &&
  npm run e2e &&
  npm run coverage:merge
}

git config --global --add safe.directory /workspace

if [ "$1" = "--skip-install" ]; then
  run_tests
else
  npm ci && run_tests
fi
status=$?

chown -R "$(stat -c '%u:%g' /workspace)" tests/output 2>/dev/null

exit "$status"
