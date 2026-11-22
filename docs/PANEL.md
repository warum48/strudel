# Local panel

```bash
npm install
npm run web            # http://127.0.0.1:8080/
npm run web -- 9000    # custom port
```

The server is required because the panel fetches track files over HTTP; a
`file://` page cannot do that.

Open any file under `tracks/` from the header menu. The URL stores the choice
(`#/tracks/techno/18-khmer-dub-v2.js`), so it can be shared. The tab title is
always `STRUDEL EXTENSION`.

## What the panel gives you

- the same CodeMirror editor as strudel.cc: syntax highlighting, widgets and
  Ctrl/Cmd+Enter;
- a mixer built from the track's `instruments` tree;
- a two-column sidebar: volumes on the left, per-instrument tone controls on
  the right;
- switches, scenes, mutes and pads when the track declares them;
- a horizontal timeline with sections, automation and LOOP / SONG / HOLD;
- a small spectrum analyzer.

HELP in the top bar opens `web/help.html`.

## How it reads a track

### Instruments and sliders

The panel scans the source (`scanSliders`) and maps each `slider(...)` to its
key path in `instruments`.

- `vol` → mixer column;
- every other slider → tone column, grouped by instrument;
- a slider outside `instruments` with `min 0` and `step 1` is treated as a
  switch;
- labels come from `name: '…'`; if there is no name, the key is humanized
  (`bodyLevel` → `body level`);
- collapse state survives eval (`openState` in `panel.js`);
- sliders declared and never read are reported by `verify`.

Do not bind another instrument to someone else's `vol`: it will be invisible
in the mixer and impossible to find.

### UI manifest

The current way to declare panel roles is a plain JS object:

```js
const UI = {
  transport: { name: 'play', labels: ['loop', 'song', 'hold'] },
  holdBar: 'holdBar',
  switches: {
    mode: ['jazz', 'break', 'half', 'roll'],
    harmony: ['quartal', 'ninth'],
  },
}
```

- `transport.name` is the slider that switches play state; `labels` are the
  button labels (0, 1, 2…).
- `holdBar` is the bar used as the HOLD snapshot.
- `switches` lists slider names and their variants. A switch is drawn only if
  it has two or more variants.

The legacy comment markers (`// @switches`, `// @scenes`, `// @mutes`,
`// @pads`, `// @timeline`) are still parsed as a fallback. New tracks should
use `UI` plus `const TIMELINE` / `const AUTOMATION`.

### Timeline and automation

`const TIMELINE` is a normal JS array of objects:

```js
{ at: 16, len: 16, name: 'DUB A', values: { kick: 1, pad: 1, mode: 0 } }
```

- `at` and `len` are bars; sections are contiguous.
- `values` are multipliers or switch values. Repeat every key in every section;
  the curve carries the last value forward.
- Click a section or the ruler to seek. The playhead follows the song.
- Section edits are applied on Ctrl/Cmd+Enter; there is no separate APPLY
  button in the current panel.
- In LOOP the timeline and automation are collapsed and disabled (the engine
  plays the loop values). SONG follows the sections. HOLD freezes the playhead
  and uses the section under `holdBar`.
- `const AUTOMATION` is a list of `{ path, points }`; the panel shows one lane
  per path and a live value while SONG/HOLD is running.

The panel only renders the data; the sound is produced by the track code
(`tlCurve` / `tlOr` / `gateOf` / `autoAt`).

### Scenes, mutes, pads

- `// @scenes {"intro":{…},"theme":{…}}` — Intro/Theme presets. Export/Import
  moves `{ track, values, scenes }` as JSON. Without `@scenes`, the buttons are
  disabled.
- `// @mutes muteSkor,muteSampho,muteChhing` — a row of 0/1 mute buttons.
- Instrument `mute: 'muteSkor'` links a channel to a mute group; G buttons are
  colored by group. If every mute is linked, the top `@mutes` row is hidden.
- `// @pads pad1,pad2` — momentary pads, keys 1–9.

### Mixer details

- `vol` is the left column; `cut` and the rest are the tone column.
- `Global` holds `verb`, `duck`, the panel master gain and the instrument
  volumes.
- Every mixer channel has M/S (panel-only mute/solo, code untouched) and G
  (group mute from `mute:`).
- The activity square next to the instrument name lights while that instrument
  has haps in the current bar.

### Slider widgets

The editor sliders are CodeMirror widgets. Moving a panel knob writes the same
number into the document and posts the same `cm-slider` message as the widget,
so the sound changes immediately and the code stays in sync. Moving the widget
also moves the panel knob.

There is a known strudel.cc widget desync on scroll; tracks that need it carry
the `__sliderSync` patch (see `slider-bug.en.md`). The panel has its own
knobs and is not affected.

## Visualizers

Visualizers live in the code, not on a full-screen canvas:

```js
._pianoroll()
._punchcard()
._pitchwheel()
._scope()
._spectrum()
```

The panel registers these methods on its own `Pattern.prototype`, because
esm.sh loads separate `@strudel/core` instances. In Node there is no
`@strudel/draw`; `tools/viz-stub.mjs` supplies no-op versions for the checkers.

`gain` is also the mixer volume, so the panel draws copies of haps with
`gain: 1` (`vizHaps()`); otherwise a track at zero volume would draw an empty
roll. On strudel.cc the same roll is empty until the track volume is raised —
that is engine behavior, not a broken track.

## Themes and master chain

- Themes use `@strudel/codemirror` themes; the panel itself stays lime.
- The master chain is low shelf 120 Hz → peak 900 Hz → high shelf 5 kHz →
  volume → analyzer. The EQ controls are currently hidden (commented out in
  `index.html`; `bindEq()` is present); the filters sit at 0 dB and do not
  affect the sound.

## Known panel gotchas

- `StrudelMirror` writes inline `background-color` and `font-size` on its root;
  the panel overrides them after construction.
- `getDrawContext()` without an argument creates a full-screen canvas; the panel
  creates `#scope` explicitly and styles only that canvas.
- The engine needs `defaultOutput` (`wa.webaudioOutput`), not only
  `onSchedule`.
- The sample bank must include `dirt-samples`, `uzu-drumkit`,
  `tidal-drum-machines` and `aliasBank`. Without `uzu-drumkit` there is no
  `sh` / `oh` / `rim`, and those layers fail with `sound not found`.
- Synthesizers need `registerSynthSounds()` in `prebake`.

## Keyboard

- `Ctrl+Enter` / `Ctrl+.` — eval / stop (from `@strudel/codemirror`).
- On macOS `Cmd+Enter` / `Cmd+.` also work via a capture listener on `#root`;
  Ctrl stays with the editor, so there is no double eval.
