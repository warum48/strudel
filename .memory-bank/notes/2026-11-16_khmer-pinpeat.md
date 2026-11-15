# Khmer pinpeat: notes

- Pinpeat is cycle + colotomy + heterophony, not chord harmony. Chhing keeps
  time, sampho leads, skor thom is the floor; roneat ek ornaments, roneat thung
  plays the skeleton, kong vong holds the ostinato, sralai is the only wind.
- Tuning: 7 tones per octave, near-equal ~171.4 cents (Ellis 1885; disputed by
  Garzoli 2015). No absolute pitch: the ensemble tunes to the sralai. Roneat
  has 21 bars = 3 octaves. 5- and 7-note scales are both used.
- 12-TET adaptation: `c db eb f gb ab bb` (dark) + `c eb f g bb` (5-tone
  skeleton). Tritone C–Gb is the axis, not an error; `@dark` + anchored
  phrases keeps tension clean.
- Drums: sampho has four strokes (ting/tip/theung/tup, up to 8 pitches);
  skor thom is a tight/loose pair played with sticks; chhing is closed accent +
  open “ching”; krap is rare.
- Form: `Sathukar` is an opening piece, not a genre; `bot` pieces serve the
  Reamker. Boxing music = sralai + sampho + chhing, slow rubato then fast
  metred and accelerating — the model for `mode 2 BOXING`.
- Track recipe: 88 BPM 4/4, 8-bar phrase, 4 modes, 6 momentary pads, no
  samples. `shape` only on sralai; drums use `penv` + `lpf` + `decay`.
- Gotcha: `.add(slider)` on a note pattern warns and does nothing; use
  `.add(note(slider))`.

## 02-skors (same day)
- No Khmer one-shot bank exists in Dirt-Samples; VSCO 2 CE (CC0) has real
  xylo/marimba/gong/claves, Dirt has real taiko/hand/tabla/metal. Use note-mapped
  sample maps; Strudel picks the nearest sample and pitch-shifts.
- Performance rule: scenes change rhythm only (all instruments stay); move old
  scene gating into `// @mutes` 0/1 buttons under the scenes. No pad-only
  instruments: every part is a `$:` sequencer.
- Keep `mode` for fill/ghost/swing; `harmony` (fifth/axis) latched 8 bars keeps
  `latch` green. Custom VSCO map is not downloaded by the panel SAMPLES button.
- `khmer/02` instrument settings live in the `instruments` tree:
  every layer has `vol/cut/hpf/clip/room`; panel MIXER = vol, TONE = the rest.
  E2E: 15 mixer rows, 60 tone rows, 7 mute buttons, 0 pads.
