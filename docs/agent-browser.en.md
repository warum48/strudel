# AI agent in the same browser tab

Goal: an AI agent edits the track while the human watches and hears **the same
tab**. The panel is a client-side app; there is no account or server session.
The open tab is the session.

## What the agent needs

1. **Access to the browser**: a browser connector/extension relay, or Chrome
   started with a CDP debugging port.
2. **The target tab**: the tab where the panel is open. A new/headless tab has
   its own AudioContext — the human will not hear it.
3. **The in-page API** (or DOM control): see `window.strudex` below.

## Option A — extension / relay (recommended)

Use the browser connector (the same kind this agent uses) in the Chrome profile
where the panel is open:

1. Install and pair the connector/extension.
2. Let the agent list tabs and choose the panel tab (by URL/title).
3. The agent evaluates JavaScript in that tab or clicks its DOM.

This survives a normal Chrome start and does not expose a debugging port.

## Option B — Chrome remote debugging (CDP)

Quit Chrome completely first, then start it with a **separate profile**:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9222 \
  --user-data-dir="$HOME/.strudex-agent-profile"
```

Open the panel in that window. Then an agent can attach to the **existing** page:

```js
import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const context = browser.contexts()[0];
const page = context.pages().find((p) => p.url().includes('strudex'))
  ?? context.pages()[0];

console.log(await page.evaluate(() => window.strudex.getTrack()));
```

Do **not** launch a new headless browser: the panel must run in the tab the
human is listening to.

## In-page API

```js
await window.strudex.closeIntro();
await window.strudex.setCode(code);   // replaces the code and starts playback
window.strudex.play();
window.strudex.stop();
window.strudex.getCode();             // current editor text
window.strudex.getTrack();            // "/tracks/..."
window.strudex.getStatus();
await window.strudex.loadTrack('/tracks/_selected/00-jazzy-breaks.js');
```

Sliders are written into the code (setKnob edits the document), so `setCode`
with changed `slider(...)` values is enough for a mix. After `setCode` the
header is rebuilt from the new code.

## Session / handoff

- The tab is the session: URL + `window.strudex` + AudioContext.
- Autosave keeps **one** slot in `localStorage` (`strudex:autosave`) per browser.
  Switching tracks with unsaved changes asks before discarding.
- No authentication, no multi-agent merge: last write wins. Do not run two agents
  in one tab at the same time.
- If a local WebSocket bridge is added later, pair it with a one-time token bound
  to `127.0.0.1`; do not expose the bridge on the network.

## Security

- `--remote-debugging-port` gives full control of that Chrome profile. Keep it
  on `127.0.0.1`, close Chrome when done, and never expose the port publicly.
- An extension with page-injection access can read the page and localStorage;
  grant it only for the profile where you run the panel.

## Limits

- The agent can read code/DOM and control playback, but it does not “hear”.
  Analyzer levels or a rendered snippet are the closest substitute (export is
  currently WIP).
- `setCode` restarts playback and may reset the playhead.
