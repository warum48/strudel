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

## 03-skors-ritual (same day)
- Serious/ethnic direction: remove high melodic lines entirely. Percussion-only
  with low drums + chhing + krap + one low kong thom; low xylophone only, no high xylo, no sralai.
- 76 BPM, skor/sam tuned −2, longer decays/rooms, darker chhing. Low xylophone: marimba VSCO, octave 0/1/2 = 0/−1/−2. Volume set from
  01: skor .33, samLow .34, samHigh .28, ghost .23, chhing .23, open .21, krap .19,
  fills .18; gong .22.
- Same control model as 02: rhythm-only scenes, `// @mutes`, no pads. Gong
  fifth/axis latched 8 bars keeps `latch` green and adds weight.

## 04-confluence (same day)
- Mix of 01–03 with 12 rhythms: 12-cell SKOR/SAM/CHHING arrays; high/open
  shifted, ghost/roll `ply`/`degrade`; no melodic xylophones.
- Acid is a separate switch, not a Khmer mode: acid bass `fast(pace/16)`,
  acid arp `arp(run(pace))`; both pace 4…32. The Khmer layers stay rhythmic.
- Strong reverb: `verb` 0…1.2, `verbSize` 1…16. CPU 16/bar with acid on.

## 18-khmer-dub (same day)
- Dub techno in Fm9→Abmaj9→Dbmaj9→Gbmaj9, 122 BPM; full dub set + Moog lead/arp + 18 Khmer percussion
  channels. The 18 channels are one stack through shared `percEcho`/`percVerb`
  and `verb`/`verbSize`; each has vol/cut/clip and a 6-group mute.
- Keep Khmer percussion rhythmic/ostinato; no melodic lines. Voicing gotcha:
  Gb pad `f` and skank `gb` are a minor second; use f4 or omit f from pad.

## 18 revision
- Pad was a 5-bar hum: shortened envelopes, lowered volume/verb send, so the
  texture (hiss/air/field) is audible.
- Harmony moved to Fm9→Abmaj9→Dbmaj9→Gbmaj9, 2 bars each; jazzier 9ths.
- Added Moog lead/arp in the spirit of 17 with c4/eb4/g4/bb4/f4/ab4/db5/bb4.
- Tension gotchas: Ab pad g3 vs ab3, Db pad c4 vs db4, Gb pad f4 vs gb4;
  fix by octave displacement.
- Timeline dropout fix: never call full `render()` from the timeline tick and
  never automate effect-bus params at section boundaries. Light apply updates
  only the changed slider inputs; reverb/delay remain continuous.
