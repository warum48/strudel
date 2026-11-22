# Khmer music — pinpeat, tuning, rhythm

Khmer music here is not "restaurant exotica" and not a travel-vlog
soundtrack. It is a way to build a track by the rules of the
**pinpeat** ensemble (ពិណពាទ្យ): cycle, colotomy, heterophony, a
seven-tone scale, and percussion in the foreground. There are no
Western chord progressions — pinpeat has none either.

Example tracks:
`tracks/khmer/01-sathukar.js` — 88 BPM, synthesis, 27 tracks, 83 sliders,
3 switches, 6 pads;
`tracks/khmer/02-skors.js` — 96 BPM, real samples, 16 tracks, 86 sliders,
rhythm scenes and mute buttons, no pads and no sralai;
`tracks/khmer/03-skors-ritual.js` — 76 BPM, percussion + low xylophone,
11 tracks, 58 sliders, no high lines and no sralai;
`tracks/khmer/04-confluence.js` — 108 BPM, mix of 01–03 + acid section,
12 rhythms, 16 tracks, 79 sliders, no melodic xylophones.

> **Honesty.** This is a modern composition *in the spirit of*, not a
> transcription. A real pinpeat does not play in 4/4 to a click and
> does not use synths. We take structure, instrument roles, scale and
> character — not field-recording authenticity.

---

## 1. Character

| Trait | How it sounds | What NOT to do |
|---|---|---|
| Heterophony | one melody at different densities: ek, thung, kong vong | do not build a chord grid |
| Cycle | 8 bars = a phrase; chhing keeps time | no 1–2–4–5, no "pretty" cadences |
| Percussion | skor thom, sampho, chhing — not a drum kit | no snare on 2 and 4 |
| Tuning | 7 tones, close to equal ~171 cents | do not flatten into major/minor |
| Sralai | quadruple-reed oboe, the only wind in pinpeat | do not imitate a saxophone |
| Density | complexity in the pattern, not layer count | do not fill every 16th |

Main principle: **melody is not a theme with chords, but a line over
a cycle**. Drums are not accompaniment; they are the load-bearing
structure.

---

## 2. Track map

```
atmos   — temple air (pink), dust (white)
drone   — C–G / C–Gb, an open support, not a chord
bass    — sub ≤80 Hz, build/main only
gong    — kong vong (ostinato), kong thom (big gong)
roneat  — ek (7-tone / 5-tone), thung (skeleton an octave down)
reed    — sralai: long tones + short phrases in BOXING
drums   — skor thom low/high, sampho low/high/ghost,
          chhing closed/open, krap, fills
fx      — short delay, rooms; little reverb
```

All synthesis, no samples: Khmer instruments do not map cleanly to
the first available sample bank, and their tuning is not 12-TET
anyway. It also keeps `live` independent of GitHub sample downloads.

### Switches

| Control | Values | What it does |
|---|---|---|
| `scene` | intro · build · main · break · outro | arrangement: layers enter and leave |
| `mode` | sathukar · pinpeat · boxing · percussion | density and pattern |
| `harmony` | fifth · axis | C–G or C–Gb support; latched every 8 bars |

`mode 0 SATHUKAR` — slow ceremonial: 5 tones, sparse.
`mode 1 PINPEAT` — full ensemble: 7 tones, sralai, sampho.
`mode 2 BOXING` — boxing piece: denser, meaner, with fills.
`mode 3 PERCUSSION` — drums, gongs and chhing only; no melody.

### Pads (momentary, keys 1–6)

| Pad | What it does |
|---|---|
| `padGong` | big gong hit with a tritone overtone |
| `padSampho` | roll on the small sampho head |
| `padSkor` | double hit on the big drum |
| `padChhing` | fast "ching-ching" cymbals |
| `padReed` | short sralai cry |
| `padSwell` | drone swell for entering a section |

A pad is a 0/1 slider that the panel writes while held. In the track
it must be a gate: `.gain(instrument.vol.mul(padX))` and
`.filter(audible)`.

### Scenes

`// @scenes` gives two buttons: `INTRO` (air, drone, gongs, chhing)
and `THEME` (full pinpeat with drums, xylophones and sralai).
Export/import JSON lives in the panel.

---

## 3. How to play

1. `npm run web` → `tracks/khmer/01-sathukar.js`.
2. Start with `INTRO`: `scene 0`, `mode 0`, `verb 0.22`.
3. `THEME` or manually: `scene 2`, `mode 1` (pinpeat).
4. Ride the 8-bar phrase: change **one** thing at the boundary.
5. `mode 2` (boxing) — at the peak, not constantly.
6. `harmony 1` (axis) — for 8 bars to change the support colour.
7. Hold `2` (sampho roll) on the last bar of a phrase, release.
8. `padSkor` (3) — on entry to a new section.
9. `mode 3` (percussion) — remove melodies, keep drums.
10. `padSwell` (6) — only before a new section.

Rule: **less is more**. One pad per phrase, one switch between
sections. If it feels empty, remove a layer first.

For `02-skors`: `scene` 0–4 changes the rhythm, the mute buttons under
the scenes silence groups, `mode` is touch (fill/ghost/swing), `harmony`
is the gong colour. No pads; everything plays from regular sequencers.

---

## 4. 02–04: scenes, mutes, samples, acid

The second track changes the control rules:

- `scene` 0–4 (`sathukar/walk/pinpeat/boxing/break`) changes **rhythm
  only**. All instruments — skor, sampho, chhing, krap, gong, xylo,
  thung — are present in every scene; scene never gates volume.
- `mode` 0–3 (`straight/swing/roll/broken`) is "touch": it changes the
  fill, ghosts and swing, but does not remove instruments.
- `harmony` — fifth/axis, latched every 8 bars (gong colour).
- Under the scenes there is a row of **mute buttons** (`// @mutes`):
  skor, sampho, chhing, krap, gong, xylo, thung. They are ordinary 0/1
  buttons, not momentary: a click mutes the layer, but the pattern
  stays in the sequencer.
- **No pads.** No instrument is triggered only by a button press: every
  part is a regular `$:` sequencer.
- Sound is real samples: Dirt-Samples (taiko, hand drum, tabla, metal)
  + VSCO 2 CE (xylophone, marimba, gong, claves, CC0). It is not a
  Khmer bank; see `05-samples.en.md` for details and limits.

### 03-skors-ritual — percussion only, no high lines

The third track reacts to the "childish" aftertaste of 02: **no high
xylophones, no sralai, no high melodic lines**. Drums, a low kong thom
and a low xylophone (VSCO marimba, 1–2 octaves down).

- **Line-up.** Skor thom high 0.33, sampho low 0.34, sampho high 0.28,
  sampho ghost 0.23, chhing 0.23, chhing open 0.21, krap 0.19,
  drum fills 0.18, kong thom 0.22, roneat low 0.24.
- **Character.** 76 BPM, lower tuning (skor/sam −2), long tails, dark
  chhing, rare krap. A ceremony, not a cartoon.
- **Scenes.** 0 procession / 1 invocation / 2 trance / 3 lament.
  Rhythm only; all instruments exist in every scene.
- **Mutes.** skor / sampho / chhing / krap / gong / low; ordinary 0/1,
  no pads. `harmony` fifth/axis — gong latched every 8 bars.
- **Low xylophone.** `xylo.low.octave` 0/1/2 = 0/−1/−2 octaves; a real
  marimba, not synthesis.

### 04-confluence — mix of 01–03 + acid

The fourth track is a crossroads, not a version: percussion and gongs
from 01–03, **12 different rhythms** (`scene` 0…11) and a separate acid
section.

- **From 01:** skor high .33, sampho low .34 / high .28 / ghost .23,
  chhing .23 / open .21, krap .19, fills .18.
- **From 02:** all percussion and gongs, except melodic xylophones.
- **From 03:** everything except `Roneat low`.
- **12 rhythms:** `SKOR`, `SAM`, `CHHING` — 12 cells each; high/open
  play shifted, ghost/roll use `ply`/`degrade`.
- **Acid:** `acid` 0/1; acid bass and acid arp, both have `pace` 4…32.
  Deliberately incongruous: Khmer cycle + acid.
- **Reverb:** `verb` up to 1.2, `verbSize` up to 16 — enough to leave
  for a temple.
- **Melody:** Khmer layers are rhythm/ostinato only; melody lives only
  in the acid section. No pads.

## 5. Documents

- `01-instruments.en.md` — pinpeat instruments and their roles.
- `02-tuning-rhythm.en.md` — tuning, scale, colotomy, form.
- `03-strudel.en.md` — how it maps to Strudel, CPU budget, gotchas.
- `04-sources.en.md` — sources and exactly what was taken.
- `05-samples.en.md` — which real samples exist and how to swap local ones.

RU originals: the same names without `.en.md`.

## 6. Gates

A new Khmer track is done only when all pass:

`verify`, `tension`, `modes`, `latch`, `gains`, `doubles`, `cpu`, `live`.

For `01-sathukar`:

- `verify` — 27 tracks, 49 hits/bar, 83 sliders, 0 errors.
- `tension` — clean; 96 deliberate tritones in anchored phrases (`@dark`).
- `modes` — roneat ek 16/0/0/0 and 0/16/16/0; thung 6/6/6/0;
  sralai 0/4/0/0 and 0/0/17/0; skor low 8/16/28/16;
  skor high 8/16/32/8; sam low 8/16/32/16; sam high 8/20/44/20;
  ghosts 0/21/32/0; chhing 8/16/32/16; krap 0/0/16/8; fills 0/0/20/0.
- `latch` — harmony switches on bar 8, not bar 4.
- `gains` — silent at all zeros.
- `doubles` — no collisions.
- `cpu` — 0/1/4/0 worklets/bar (max 1/s).
- `live` — eval ok, pattern plays, slider sync ok.

For `02-skors`:

- `verify` — 16 tracks, 106 hits/bar, 86 sliders, 0 errors.
- `tension` — clean; 132 deliberate tritones (`@dark`).
- `modes` — skor fill 8/20/52/44; sampho high 44/44/44/44 (swing
  changes the signature); ghosts 17/12/6/25.
- `latch` — gong harmony switches on bar 8.
- `gains` — silent at all zeros.
- `doubles` — no collisions.
- `cpu` — 0 worklets/bar: samples only, no worklet effects.
- `live` — eval ok, pattern plays, slider sync ok.

For `03-skors-ritual`:

- `verify` — 11 tracks, 40 hits/bar, 58 sliders, 0 errors.
- `tension` — clean; 35 deliberate tritones (`@dark`).
- `modes` — fills 8/20/52/44; the rest keep their pattern.
- `latch` — gong fifth/axis on bar 8.
- `gains` — silent at all zeros.
- `doubles` — no collisions.
- `cpu` — 0 worklets/bar.
- `live` — eval ok, pattern plays, slider sync ok.

For `04-confluence`:

- `verify` — 16 tracks, 137 hits/bar, 79 sliders, 0 errors.
- `tension` — clean; 13 deliberate tritones (`@dark`).
- `modes` — fills/ghost/swing change; acid is a separate `acid` 0/1.
- `latch` — gong fifth/axis on bar 8.
- `gains` — silent at all zeros.
- `doubles` — no collisions.
- `cpu` — 0/bar without acid, 16/bar (7/s) with acid.
- `live` — eval ok, pattern plays, slider sync ok.

---

## 7. Limits

- 12-TET is an approximation. The real Khmer scale is closer to
  equal steps of ~171 cents, and its tuning drifts from ensemble to
  ensemble. We use the "dark" rounding `c db eb f gb ab bb`.
- 4/4 to a click is a modern grid. The tradition thinks in cycles
  and breathes with tempo; boxing music actually accelerates.
- Synths are not a replacement for bronze and bamboo. This is a
  timbral adaptation, not a museum reconstruction.
- There is no absolute pitch in the tradition: the ensemble tunes to
  the sralai. Our C is a convenient anchor for an electronic track.
