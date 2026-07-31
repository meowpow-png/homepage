#!/bin/sh
set -eu

node -p "require('./package-lock.json').packages['node_modules/@playwright/test'].version"
