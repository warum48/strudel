#!/usr/bin/env bash
# Ship the current working tree to the VPS and (re)start the panel container.
#
#   tools/deploy-vps.sh              # sync + rebuild + restart
#   tools/deploy-vps.sh --sync-only  # only rsync (no docker compose)
#
# Deploys the WORKING TREE, not a commit — uncommitted tracks and panel edits go
# up as they are. Local-only stuff (backup/, refs/, dumps/, node_modules/) and
# the agent workspace (.workbuddy-ai/) never leave the Mac. `tracks/_selected/`
# IS shipped: it is the curated public set the server exposes on non-local hosts.
set -euo pipefail

REMOTE="${REMOTE:-kontabo}"      # ssh alias from ~/.ssh/config
DEST="${DEST:-/opt/strudel}"     # on the VPS, next to /opt/e2e-agent
PORT="${PORT:-8093}"

ROOT=$(cd "$(dirname "$0")/.." && pwd)

rsync -az --delete \
  --exclude 'node_modules' \
  --exclude 'backup' \
  --exclude 'refs' \
  --exclude 'dumps' \
  --exclude '.git' \
  --exclude '.workbuddy-ai' \
  --exclude '.DS_Store' \
  "$ROOT/" "$REMOTE:$DEST/"

if [ "${1:-}" = "--sync-only" ]; then
  echo "synced to $REMOTE:$DEST (no restart)"
  exit 0
fi

ssh "$REMOTE" "cd $DEST/deploy && docker compose up -d --build"

echo "waiting for the container to answer on :$PORT"
for i in $(seq 1 20); do
  if ssh "$REMOTE" "curl -fsS -o /dev/null http://127.0.0.1:$PORT/"; then
    echo "ok: http://$(ssh "$REMOTE" 'hostname -I | awk "{print \$1}"'):$PORT/"
    exit 0
  fi
  sleep 1
done

echo "FAILED: no answer on :$PORT — check 'docker logs strudel-app'" >&2
exit 1
