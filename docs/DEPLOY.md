# Deploy — the panel on the VPS

The panel runs on the Contabo box next to `e2e-agent`, as a Docker container.

| | |
|---|---|
| URL (temporary) | `http://169.58.39.20:8093/` |
| Host path | `/opt/strudel` (git clone is *not* used — the tree is rsynced) |
| Container | `strudel-app`, `restart: unless-stopped`, `node:22-alpine` |
| Compose | `/opt/strudel/deploy/docker-compose.yml` |
| Port | `8093` published on all interfaces |

The VPS has **no node on the host** — everything is Docker. Port `8093` is free
(`8090/8091/8092` are taken by loopback-only dashboards, `8080/8047` are
deliberately firewalled on `eth0` by `/root/lock-public-ports.sh`).

## Deploy / update

```bash
tools/deploy-vps.sh              # rsync + rebuild + restart + health check
tools/deploy-vps.sh --sync-only  # rsync only (content edits, no rebuild)
```

It ships the **working tree**, not a commit, so uncommitted tracks and panel
edits go up as they are. `backup/`, `refs/`, `dumps/`, `node_modules/` and
`.workbuddy-ai/` never leave the Mac.

`tracks/_selected/` **is** shipped — it is the curated public set. For any host
other than localhost/`.local` (the public IP or domain), `GET /api/tracks`
lists **only** `tracks/_selected/` and every other `/tracks/...` file answers
404. Localhost still sees the full library.

`web/`, `tracks/`, `docs/` and `samples/` are bind-mounted read-only, so a track
or a panel edit needs only `--sync-only`. Only `tools/serve.mjs` lives in the
image and needs a rebuild.

## Adding a real URL later

`runyourbiz-caddy` serves 80/443 and proxies subdomains to
`host.docker.internal:<port>`. One block in `/root/runyourbiz/Caddyfile`:

```caddyfile
strudel.runyourbiz.dpdns.org {
    reverse_proxy host.docker.internal:8093
}
```

then `docker exec runyourbiz-caddy caddy reload --config /etc/caddy/Caddyfile`.
No change to the app is needed — it already listens on `0.0.0.0`.

## Gotchas

- **Absolute-form request lines.** Behind a proxy a browser may send
  `GET http://host/web/x.js HTTP/1.1`. `serve.mjs` parses `req.url` through
  `new URL(...)`, not `split('?')`: the naive version turned those into
  `path.join(root, 'http://…')` → `ENOENT` → 404 on files that exist (it made
  `vendor/strudel.js` 404 and silently killed the whole editor).
- **404s are `no-store`.** Without it Chrome caches the 404 and the file stays
  "missing" after a redeploy.
- **Debug logging.** `LOG_REQ=1 docker compose up -d` in `/opt/strudel/deploy`
  logs every request line plus `404 <path> <errno>`; unset by default.
- **No auth.** The port is open to the internet and the panel is public
  content — anyone with the IP can open it.
- **Not in git yet.** `deploy/` and `.dockerignore` are new local files; the
  VPS copy exists only because of rsync.
