#!/usr/bin/env bash
# Rebuild web/vendor/strudel.js from pinned npm packages.
# Requires node/npm and network (one-time); the repo itself uses the bundle offline.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

cd "$TMP"
npm init -y >/dev/null
npm install --silent \
  @strudel/core@1.2.6 \
  @strudel/mini@1.2.6 \
  @strudel/tonal@1.2.6 \
  @strudel/webaudio@1.3.0 \
  @strudel/transpiler@1.2.6 \
  @strudel/draw@1.2.6 \
  @strudel/codemirror@1.3.0

cat > entry.js <<'JS'
export * as cm from '@strudel/codemirror';
export * as core from '@strudel/core';
export * as mini from '@strudel/mini';
export * as tonal from '@strudel/tonal';
export * as wa from '@strudel/webaudio';
export * as draw from '@strudel/draw';
export * as transpilerMod from '@strudel/transpiler';
JS

npx --yes esbuild@0.28.2 entry.js \
  --bundle --format=esm --platform=browser --target=es2022 --minify \
  --outfile="$ROOT/web/vendor/strudel.js"

echo "built $ROOT/web/vendor/strudel.js"
