#!/bin/sh
set -eu

sha="$1"
required_jobs="Build & Test
Quality Checks"

runs_json=$(gh api "repos/$GITHUB_REPOSITORY/commits/$sha/check-runs" --jq '.check_runs')

while IFS= read -r name; do
  status=$(printf '%s' "$runs_json" | jq -r --arg name "$name" '[.[] | select(.name == $name)] | .[0].status // "missing"')

  if [ "$status" = "missing" ]; then
    echo "$name has not started for $sha yet. Wait for it to finish, then re-run this job."
    exit 1
  fi
  if [ "$status" != "completed" ]; then
    echo "$name is still $status for $sha. Wait for it to finish, then re-run this job."
    exit 1
  fi

  conclusion=$(printf '%s' "$runs_json" | jq -r --arg name "$name" '[.[] | select(.name == $name)] | .[0].conclusion')
  if [ "$conclusion" != "success" ]; then
    echo "$name concluded $conclusion for $sha."
    exit 1
  fi
done <<EOF
$required_jobs
EOF

echo "CI passed for $sha"
