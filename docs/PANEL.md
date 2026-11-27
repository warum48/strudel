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
- switches and scenes in a collapsible panel above the mixer, plus mutes and
  pads when the track declares them;
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
- groups/instruments `keys`, `moog`, `arp` and `arp2` open in Tone by
  default; a group that contains one of them opens too, but its other
  instruments stay collapsed;
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
- Click the ruler (or empty timeline) to seek; clicking a section block
  selects it and opens its details popup (in HOLD it also seeks there). The
  playhead follows the song. A seek is immediate (no bar quantization: the
  main-thread scheduler has already queued the next bar, so delaying the jump
  would overlap or shift it). Long looping-sample lanes carry `cut` so the old
  tail stops on retrigger.
- Clicking a section block opens its **details popup** right under that block
  (`web/section.js`). The read-only summary answers "which phrase line plays
  here": it lists only lanes with a resolved phrase, as
  `Group  Instrument PHRASE` (e.g. `Synths Riff lead ACID_C`);
  drum lanes and other phrase-less lanes are omitted, as are multipliers —
  those live only in the editable target list below. Phrase resolution reads
  `const X = note(PHRASE)`, `pickVar.pick([PHRASE_A, …])` (with `pickVar` from
  `tlOr('key', …)` / `tlCurve('key')`) and derived lines such as
  `const SUB = BASS.ctranspose(-12)`.
  The popup also edits `name`, `length`, `order`, per-target `values`
  (change / delete / add) and can remove the section; zero-valued instrument
  targets are hidden until re-added. `at` is read-only because sections stay
  contiguous. Closing: `×`, Escape, a click outside the timeline, or collapsing
  TIMELINE.
- The AUTOMATION body keeps its current 160px max height. Lanes stay 22px
  tall; when there are more of them, the body scrolls instead of squeezing
  the rows.
- Section edits write the `const TIMELINE` literal immediately; press
  Ctrl/Cmd+Enter to hear them. There is no separate APPLY button.
- In LOOP the timeline and automation are collapsed and disabled (the engine
  plays the loop values). SONG follows the sections. HOLD freezes the playhead
  and uses the section under `holdBar`.
- `const AUTOMATION` is a list of `{ path, points }`; the panel shows one lane
  per path and a live value while SONG/HOLD is running.
- Point editor: click empty space on a lane to add a point (bar is derived from
  the click, value defaults to the previous point), click an existing dot to
  edit it. The popup saves back into the `const AUTOMATION` literal, Delete
  removes that point (an empty lane is dropped), and both re-evaluate the track
  immediately (same as Ctrl/Cmd+Enter).

The panel only renders the data; the sound is produced by the track code
(`tlCurve` / `tlOr` / `gateOf` / `autoAt`).

### Phrase editor (piano roll)

The small piano button in the code toolbar opens a piano-roll popup to its
left. It lives in `web/phrase.js`; `initPhraseEditor({ getMirror, status })`
wires it. It edits the plain note phrases a track already declares:

```js
const ACID_C = phrase([ 'c3 c3 c3 db3 …', … ])
const SOLO_A = solos([ 'c4 ~ ~ c4 …', … ])
```

- **Phrase select** — one `<select>` with an `<optgroup>` per instrument
  (Riff lead / Pulse echo / Bass / Stabs / Pad / Solo). One grouped select was
  chosen over "instrument first, then phrase": a single action, no half-filled
  state, and the instrument stays visible in the list. The choice is remembered
  in `localStorage` (`strudex:phraseSel`).
- **Whole phrase, not one bar** — the grid shows every bar of the phrase side
  by side, with a `bar N` ruler above the step numbers and a heavier separator
  at each bar start. Four 16-step bars fit on a wide screen; when the screen is
  narrower than the grid, the body scrolls horizontally instead of squeezing
  the cells. Longer phrases use the same rule: full width if it fits, otherwise
  the widest the screen allows plus scroll.
- **steps** — 8 or 16 per bar, applied to every bar. Downsampling keeps the
  first hit of each span; upsampling puts the original notes on the even steps
  and leaves the rest empty.
- **Grid** — always two octaves (24 semitones), so the popup height does not
  jump when the phrase changes. White and black keys are shaded, C rows get a
  heavier bottom line, every 4th column and every bar start a heavier left line.
  **oct − / +**, in the bottom bar under the keyboard, moves the visible window;
  it auto-centres on the phrase when a new phrase is picked, and the range label
  turns yellow if some notes sit outside the window.
  A step holds one note: clicking a cell places that row's pitch (replacing
  whatever was there), clicking the filled cell clears it.
- **Apply** rewrites only the bars whose text changed (each as its own string
  literal) and then evaluates the code, exactly like Ctrl/Cmd+Enter, so a
  playing track picks the new riff up immediately. The editor works on plain
  whitespace-separated bars; a phrase that uses mini-notation accents
  (`* / , <…>`) or non-note tokens is listed as `(unsupported)` and stays
  read-only.

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
  (group mute from `mute:`). M/S stay panel state: the document keeps the base
  `vol`, and the effective value is pushed before the next eval starts, so
  PLAY / Ctrl+Enter does not begin with one unmuted burst.
- Switches and scenes live in a collapsible **Switches** panel above the mixer
  (collapsed by default, the open state is remembered). They used to sit in the
  middle of the mixer and eat several rows.
- The activity square next to the instrument name lights while that instrument
  has haps in the current bar. The engine only reports the hap
  (sample/`n`/`gain`/`orbit`), not the `$:` block it came from, so the panel
  matches lanes heuristically: sample, then orbit, then gain closeness. Shared
  samples or scaled gains can make the guess ambiguous — the classic case is
  several melodic lanes on `sawtooth`: the section multiplier scales `gain`, and
  the lamp can land on the wrong instrument. For an exact lamp add
  `.label('group.inst')` to every lane that shares a sample; the label travels
  with the hap and wins over the heuristics. Do not label a combined stack
  (snare + clap) — the label would light both instruments at once.

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

## Agent API and NEW TRACK

- `window.strudex` exposes a stable browser API: `ready`, `closeIntro`,
  `listTracks`, `loadTrack`, `newTrack`, `getCode`, `setCode` (set + play),
  `play`, `stop`, `getTrack`, `getStatus`. The intro's **AI** tab shows a
  copyable prompt; `/llms.txt` is the machine-readable entry point.
- `NEW TRACK` loads `/tracks/_selected/new-track.js`: a two-section starter
  (kick + hat, D-minor eighths arp, pad from section 2, cutoff automation ×2).

## Mobile (`max-width: 900px`)

- The header keeps only the track title; the picker, theme, JSON/Track exchange,
  preload and help move under a hamburger menu.
- Timeline and automation cells get horizontal scroll (min 900px) instead of
  shrinking.
- Mixer, tone and code editor stack vertically; `main` is the page scroller.
  The sound visualizer (`#scope`) becomes a full-width block at the very bottom.
  The Master EQ stays hidden.
- The copy button at the editor bar's right end copies the track code.

