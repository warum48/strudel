# The strudel.cc slider bug: the thumb resets and corrupts the code

Verified on 2026-11-12 against the live https://strudel.cc (headless Chromium +
CDP), on `tracks/techno/03-dub-v2.js`. The bug is **not in our tracks** — it is
in the editor's own slider widget. Our files are clean: `npm run verify` and
`npm run doubles` pass, there is no ID conflict (IDs are unique; these are
offsets in the text).

## Symptoms (what it looks like by hand)

- You raise a slider, scroll down/up — the thumb is back at the old value
  (often zero), even though the sound is playing at the raised volume.
- Then you drag it again — the value turns into garbage (`0.8.55`), and the
  track stops launching with a `SyntaxError`.
- "The slider does not respond" — same thing: the widget shows the old value
  while `sliderValues` already holds a different one.

## Reproduction (verbatim test output)

Slider `kickVol = slider(0, 0, 1.4, 0.01)`, position in the text `from = 2450`:

```
start:        " slider(0, 0, 1.4, 0.01) // ki"
drag 0 → 0.55 " slider(0.55, 0, 1.4, 0.01) //"     ← code correct
scroll ↓↑     slider DOM: value = "0"              ← but the code says 0.55
drag → 0.8    " slider(0.8.55, 0, 1.4, 0.01) "     ← code corrupted
drag → 0.2    " slider(0.2.8.55, 0, 1.4, 0.01"
Ctrl+Enter    SyntaxError, line 51, column 28      ← track dead
```

## Cause: three lines in `@strudel/codemirror/slider.mjs`

```js
eq() { return false }                          // 21: the DOM is re-created on every render

toDOM() {
  slider.originalValue = this.value;           // 34: this.value is the value AT EVAL TIME
  slider.value = slider.originalValue;         // 37: the thumb is set to the same value
}

slider.addEventListener('input', (e) => {
  const to = slider.from + slider.originalValue.length;   // 47: the length comes from originalValue
  this.view.dispatch({ changes: { from: slider.from, to, insert: next } });
  ...
  window.postMessage({ type: 'cm-slider', value: Number(next), id: getSliderID(slider.originalFrom) });
});
```

The chain:

1. A drag rewrites the number in the text and updates `originalValue` **on the
   DOM node**. The widget object (`this.value`) does not change — it is frozen
   at the value from the last `Ctrl+Enter`.
2. `eq() { return false }` → CodeMirror re-creates the DOM node on every
   re-render: scrolling, returning to the viewport, rebuilding decorations after
   eval. The new node takes `this.value`, i.e. the **old** value. The thumb
   visually rolls back.
3. The next drag computes the length of the replaced chunk from the **old**
   `originalValue`. If the number in the text now has a different length
   (`0` → `0.55`), the replacement eats the wrong number of characters: a tail
   remains (`0.8.55`) or the comma is eaten (`slider(0.45 0, 0.5, …)`). That is
   already a syntax error.

The audio does not lie: the live value sits in `sliderValues[id]`, where the
drag writes through `postMessage`. That is why "the thumb is at zero while the
bass is screaming" is the normal picture of this bug.

Why `Ctrl+Enter` heals it: on eval, `afterEval` rebuilds the widgets from the
transpiler configs, `value` is taken from the code text, and `sliderValues` is
re-synchronized. Everything matches — until the next scroll.

## Working rules (what to do by hand)

- **Before dragging a slider — `Ctrl+Enter`.** This is the only way to guarantee
  that `originalValue` matches the text. It costs one keypress.
- **If the thumb looks "reset" — do not drag it.** Press `Ctrl+Enter` first.
  Dragging a desynchronized widget is exactly what corrupts the code.
- **Do not scroll while playing.** Keep the slider block on one screen: as long
  as the nodes are not re-created, drags are safe. The mixer in `03-dub-v2` is
  moved to the top for this reason.
- **Code corrupted (`0.8.55`)?** Do not run it — fix the number by hand first.
  `Ctrl+Enter` on corrupted text will give a `SyntaxError` and stop the track.

## Slider width: 64px can be overridden

The widget sets the width inline (`slider.style = 'width:64px; …'` in `toDOM()`),
but that is a plain inline style without `!important`, so any rule with
`!important` overrides it. Measured on the live strudel.cc:

| width | what happens |
|--------|--------------|
| 64px (default) | ~0.6 px per 0.01 step — hitting an exact value with the mouse is almost impossible |
| 160px | works, the layout does not shift |
| 180px | works, `scrollWidth` did not grow (832 → 832) — the longest line is already wider than the window |
| 320px | works, but `scrollWidth` 832 → 950: lines with sliders start spilling to the right |

**Option 1 — a line in the track file.** `document` is available in eval
(verified: the width really became 180px). The line is idempotent; a second
`Ctrl+Enter` will not add a second `<style>`:

```js
// slider width: the widget draws 64px inline, override with !important
if (typeof document !== 'undefined' && !document.getElementById('slider-w')) {
  const st = document.createElement('style')
  st.id = 'slider-w'
  st.textContent = '.cm-slider input { width: 180px !important; }'
  document.head.appendChild(st)
}
```

Minus: this is a side effect in a musical file — not for "clean" versions of the
track. Working example — `tracks/techno/04-dub-v3.js` (the note about quotes is
there too: the transpiler wraps double quotes and backticks in `m()`, so the CSS
rule is assembled with single quotes via concatenation).

**Option 2 — outside, once per page.** Stylus / Stylebot / any CSS injector:

```css
.cm-slider input { width: 180px !important; }
```

Tracks stay clean, but on a new browser/profile the rule has to be set again.

**Exact values — not with the mouse.** Clicking the slider and using `←` / `→`
gives exactly one step: the same `input` event fires, but the DOM node is not
re-created, so this is also the safest way (it does not hit the number-length
bug).


## What you can fix on your side

With syntax — nothing: the length of the value string changes for any fractional
slider (`0` → `0.55`), and `slider()` cannot fix the number of written digits.

**But from inside the track — you can, and it works.** The widget keeps state
not only in itself: `from`, `originalFrom` and `originalValue` live right on the
`<input>`, and writing to the document is computed as
`to = slider.from + slider.originalValue.length`. So it is enough for
`originalValue` to always match what is actually written in the code — and there
is nothing left to corrupt.

```js
if (typeof document !== 'undefined' && !window.__sliderSync) {
  const syncSliders = () => {
    const m = window.strudelMirror
    if (!m || !m.editor) return
    const doc = m.editor.state.doc
    for (const el of document.querySelectorAll('.cm-slider input')) {
      if (typeof el.from !== 'number') continue
      const t = doc.sliceString(el.from, el.from + 24).match(/^-?\d+(?:\.\d+)?/)
      if (!t) continue
      if (el.originalValue !== t[0]) el.originalValue = t[0]  // length for the replacement
      if (Number(el.value) !== Number(t[0])) el.value = t[0]  // the thumb itself
    }
  }
  window.__sliderSync = setInterval(syncSliders, 200)
  document.addEventListener('scroll', () => requestAnimationFrame(syncSliders), true)
  document.addEventListener('pointerdown', syncSliders, true)
}
```

Three trigger points, each for a reason:

- `pointerdown` — a moment before the drag, so the replacement length is correct;
- `scroll` + `rAF` — CodeMirror re-creates the DOM outside the viewport, and the
  new node arrives with the old value; we fix it on the next frame;
- `setInterval` — a safety net in case a re-render happened without scrolling.

The patch does NOT write to the document: audio already goes through
`postMessage`, and the slider id is computed from `originalFrom`, which we do not
touch. So it only fixes the thumb reading and the replacement length — exactly
the two things that lie.

Verified live (`npm run live`) on the same scenario "drag → leave the viewport →
come back → drag again":

| file | in the code | thumb | result |
|---|---|---|---|
| `05-deep-dub.js` (no sync patch) | `2` | `0` | DESYNC |
| `06-deep-dub-v2.js` (with the sync patch) | `3` | `3` | ok |

A separate test on a long file: without the patch the second drag gives `0.62`
instead of `0.6` (3 characters out of 4 were replaced); with the patch — `0.6`.

Limitation: the patch lives until the page is reloaded, and it works only in the
strudel.cc editor (`window.strudelMirror`). It does not exist in `@strudel/web` —
and there are no such sliders there anyway.

## Upstream report

As of 2026-11-12 there is no such issue in the tracker. The closest by class
(the same stale widget / formatting):

- **#2055** "Slider persists after deletion causing formatting issues" — the
  widget stays after deletion, the code stops parsing;
- **#1541** "Slider expression values, nested sliders and formatting issue" —
  expressions in arguments, the widget "stops rendering correctly".

Both are open, both unfixed. You cannot file an issue anonymously on Codeberg —
an account is required (Forgejo does not support guest issues). The report text
is ready so you do not have to write it again: `docs/issue-slider-bug.en.md`.

The strudel.cc-side fix is one line: in `toDOM()`, take the value from the
document (`view.state.doc.sliceString(this.from, this.to)`) instead of
`this.value`.
