# Backlog

## Ideas


### I-001 — Floating windows — drag + resize for panel popups [MED, NEW, 2026-11-28]

**Why:** the phrase and section popups use auto placement and a computed size;
a dragged/resized window (especially the pattern grid) would let the user keep
one hand position and see more bars at once.

**Deferred scope (not scheduled):**

- [ ] `web/window.js` — `makeFloating(el, { handle, minW, minH, storeKey })`:
      pointer drag on the header, one corner grip for resize, viewport clamp,
      double-click reset, `localStorage` `{ x, y, w, h }`.
- [ ] Phrase popup pilot: after the first manual drag/resize, stop `phPlace()`
      / `phSize()` from overriding the geometry; auto layout stays the default
      until then. The grid body already scrolls, so resize works naturally.
- [ ] Section popup rollout with the same helper.
- [ ] Mobile (`max-width: 900px`): keep auto/full-width, hide the grip.

**DoD:** a custom size survives re-render (phrase/step change, Apply/evaluate)
and a page reload; the window is clamped to the viewport; double-click on the
header returns to auto layout.

**Notes:** ~80–120 JS lines + CSS. Drag itself is trivial; the real integration
risk is the existing auto-placement (`phPlace` / `phSize`), which must yield once
the user takes control.

## Architectural Decisions (ADR)

## Rejected Ideas
