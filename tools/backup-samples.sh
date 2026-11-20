#!/usr/bin/env bash
# Refresh the local (git-ignored) backup of upstream Strudel sample packs.
# Large: ~0.5 GB. Nothing here is used by the web app at runtime.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/backup/samples"
mkdir -p "$DEST/maps"

clone() {
  name="$1"; url="$2"
  if [ -d "$DEST/$name" ]; then echo "skip $name"; return; fi
  git clone --depth 1 --quiet "$url" "$DEST/$name"
  rm -rf "$DEST/$name/.git"
  echo "ok $name"
}
clone Dirt-Samples https://github.com/tidalcycles/Dirt-Samples.git
clone uzu-drumkit https://github.com/tidalcycles/uzu-drumkit.git
clone clean-breaks https://github.com/yaxu/clean-breaks.git
clone Dough-Waveforms https://github.com/Bubobubobubobubo/Dough-Waveforms.git

curl -s https://strudel.b-cdn.net/tidal-drum-machines.json -o "$DEST/maps/tidal-drum-machines.json"
curl -s https://strudel.b-cdn.net/tidal-drum-machines-alias.json -o "$DEST/maps/tidal-drum-machines-alias.json"
curl -s https://strudel.b-cdn.net/uzu-drumkit.json -o "$DEST/maps/uzu-drumkit.json"

python3 - "$DEST" <<'PY'
import json, os, ssl, sys, urllib.parse, urllib.request, concurrent.futures
dest = sys.argv[1]
base = 'https://strudel.b-cdn.net/tidal-drum-machines/machines/'
m = json.load(open(os.path.join(dest, 'maps/tidal-drum-machines.json')))
paths = sorted({x for v in m.values() for x in (v if isinstance(v, list) else [v]) if isinstance(x, str) and not x.startswith('http')})
ctx = ssl._create_unverified_context()
def get(p):
    out = os.path.join(dest, 'tidal-drum-machines/machines', p)
    if os.path.exists(out) and os.path.getsize(out) > 100: return
    os.makedirs(os.path.dirname(out), exist_ok=True)
    req = urllib.request.Request(base + urllib.parse.quote(p, safe='/'), headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=60, context=ctx) as r, open(out, 'wb') as f: f.write(r.read())
    except Exception: pass
with concurrent.futures.ThreadPoolExecutor(max_workers=16) as ex: list(ex.map(get, paths))
print('tidal files:', len(paths))
PY
du -sh "$DEST"
