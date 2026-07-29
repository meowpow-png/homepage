#!/bin/sh
set -eu

version=$(node -p "require('./package-lock.json').packages['node_modules/@playwright/test'].version")

echo "version=$version"
