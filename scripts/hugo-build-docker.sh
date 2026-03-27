#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)

docker run --rm \
  -v "${ROOT_DIR}/src:/src" \
  -w /src \
  hugomods/hugo:exts-0.125.7 \
  hugo "$@"
