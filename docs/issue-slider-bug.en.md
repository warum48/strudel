# Ready issue text (Codeberg, uzu/strudel)

You cannot file it anonymously — an account is required. This file exists so you
do not have to write it again: copy the title and body, paste them, add the
browser version. If you don't want a new issue — the same body works as a comment
in **#2055** (the same stale widget there, just after deleting a line).

---

**Title**

`slider() thumb resets on scroll and the next drag corrupts the number in the code`

**Body**

```
## Summary

After a slider has been dragged once, its thumb jumps back to the value it had at
the last evaluation as soon as the widget's DOM node is re-created (scrolling it
out of the viewport and back is enough). Dragging that reset thumb then splices
the number in the editor at the wrong length and produces invalid code.

## Steps to reproduce

1. Open https://strudel.cc and paste:

   const v = slider(0, 0, 1.4, 0.01)
   $: s("bd*4").gain(v)

2. Ctrl+Enter.
3. Drag the slider to 0.55 — the code correctly becomes slider(0.55, 0, 1.4, 0.01).
4. Scroll the editor down and back up so the line leaves and re-enters the viewport.
5. The thumb now shows 0 again, while the code still says 0.55.
6. Drag it to 0.8. The code becomes slider(0.8.55, 0, 1.4, 0.01).
7. Ctrl+Enter -> SyntaxError, the pattern stops.

Recorded on 2026-11-12 against strudel.cc, in headless Chromium over CDP, with
@strudel/codemirror 1.3.0:

    drag 0 -> 0.55   code: slider(0.55, 0, 1.4, 0.01)      ok
    scroll down/up   thumb: 0   code: 0.55                 desync
    drag -> 0.8      code: slider(0.8.55, 0, 1.4, 0.01)    corrupted
    drag -> 0.2      code: slider(0.2.8.55, 0, 1.4, 0.01)
    Ctrl+Enter       SyntaxError at line 51, column 28

## Cause

`@strudel/codemirror/slider.mjs`:

- `toDOM()` sets `slider.originalValue = this.value`, and `this.value` is the
  value captured at evaluation time. A drag updates `originalValue` on the DOM
  node only; the widget object keeps the old string.
- `eq() { return false }` makes CodeMirror re-create the DOM node on every
  re-render, so the new node is initialised from that stale `this.value`.
- the input handler computes `const to = slider.from + slider.originalValue.length`,
  i.e. the length of the text to replace comes from the stale string. When the
  number in the document has a different length (0 -> 0.55), the change replaces
  the wrong number of characters, leaving a tail (0.8.55) or eating the following
  comma (slider(0.45 0, 0.5, 0.01)).

Note the audio is not affected: the live value is in `sliderValues[id]`, updated
via postMessage, so the sound follows the drag while the thumb and the code text
do not. That makes the bug look like "the slider stopped working".

## Suggested fix

Read the current value from the document instead of the widget field, in
`toDOM()`:

    const current = this.view.state.doc.sliceString(this.from, this.to);

and use `current` for `slider.value` / `slider.originalValue` (falling back to
`this.value` when empty). The `from`/`to` on the DOM node are already kept
up to date by the `docChanged` branch of `sliderPlugin.update()`, so only the
initial value is stale.

## Workaround

Ctrl+Enter re-syncs the widgets from the code text. So: press Ctrl+Enter before
dragging a slider, never drag a thumb that looks reset after scrolling, and do not
scroll while playing.

## Environment

- strudel.cc, @strudel/codemirror 1.3.0, @strudel/transpiler 1.2.6
- Chrome <version>, macOS <version>
```

---

## What to attach

- A screenshot/video of steps 5–7 (one video is enough; the text above is
  sufficient to reproduce).
- Browser and OS versions.

## Where

https://codeberg.org/uzu/strudel/issues/new — or as a comment in
https://codeberg.org/uzu/strudel/issues/2055
