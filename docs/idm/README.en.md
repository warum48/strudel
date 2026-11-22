# IDM — technique library

IDM here is not "intelligent electronics" as a museum piece. It is a way
of building rhythm from micro-events: clicks, splinters, grains, 8-bit
squeaks and short acid notes. Melody is another timbre, not a theme;
groove is a sequence of decisions, not a grid.

Reference track: `tracks/idm/01-splinter.js` (136 BPM, 33 layers,
193 sliders, 8 switches, 6 pads). Also `tracks/idm/02-splinter-v2.js` — the
same palette in a 96-bar form (SONG/LOOP/HOLD, 2 switches, no pads or panel
hacks) and `tracks/idm/03-splinter-v3.js` — 144 bars, 4 switches, a VOICE LAB
with voice/granular automation, more glitch and acid; `run` there is a
syncopated 16th riff with an octave slider.

---

## 1. Character

| Trait | How it sounds | What not to do |
|---|---|---|
| Glitch | splinters, stutter, gaps between beats | do not turn it into straight breakcore |
| Granular | cloud of short pieces, moving position/window | do not make a reverb pad out of grains |
| Micro-events | clicks, ticks, squeaks, short 8-bit notes | do not fill every 16th |
| 8-bit | pulse/square, crush, fast arpeggios | do not play a "happy" melody |
| Acid | 303 with selective glide, wide intervals | do not arpeggiate chords with 16ths |
| Bass | sub ≤80 + rough mid + FM rubber | do not confuse growl with sub |
| Space | little reverb, short rooms, delay and pan | do not drown everything in a hall |

Core rule: **complexity lives in the sequence, not in the number of
layers**. Forum consensus (Elektronauts, IDMForums, Renoise) says the
same thing: it sounds like ten instruments, but three are playing and
every hit is deliberate. Randomness is spice, not structure.

---

## 2. Track map

```
atmos   — vinyl, air, wind
drums   — kick, snare, hats, open, clicks, glitch, squeaks, roll/cut/burst/drop
bass    — sub ≤80, growl (mid), FM rubber
acid    — line (sparse), run (octave up), scream (shape+crush)
grain   — cloud, scan, freeze, edit; source padlong/space/wind/noise2
bits    — lead (pulse), arp (square), blips (noise)
vox     — numbers (spoken digits), dry/chop/pitch
chords  — dark pad (tritone dyads), ghost pad (fifths+9), stab
fx      — delay, small reverb
```

The granular source changes: with `grainSrc=auto` the bank
`padlong → space → wind → noise2` moves every 4 bars. `pitch` on cloud/
scan/freeze/edit runs from −24 to +12 semitones (up to two octaves down).

Rhythm mutates through two macros: `mutate` (0…1) keeps random ghost
snare/hat/glitch hits, `fill` (0…1) adds a 32nd snare fill on the last
beat. Modes 4–7 (`skitter`, `shuffle`, `poly`, `fracture`) use every
drum layer, not just the kick.

### Switches

| Knob | Values | What it does |
|---|---|---|
| `scene` | intro · build · main · break · outro | arrangement: layers enter/leave |
| `mode` | glitch · grain · acid · strip · skitter · shuffle · poly · fracture | drum pattern; modes 4–7 use every layer |
| `grainMode` | off · cloud · scan · edit | which granular layer plays |
| `grainSrc` | auto · padlong · space · wind · noise2 | granular source: auto moves the bank every 4 bars |
| `bitMode` | clean · crush · coarse · both | bit-crush depth on 8-bit layers |
| `acidMode` | off · sparse · run · scream | 303: off / sparse / octave up / scream |
| `voxMode` | off · dry · chop · pitch | `numbers` voice: off / dry / chop / pitch |
| `harmony` | dark · ghost | tritone dyads or fifths+9; latched every 8 bars |

### Pads (momentary, keys 1–6)

| Pad | What it does |
|---|---|
| `padRoll` | 32nd glitch roll while held |
| `padCut` | broken stutter with gaps |
| `padFreeze` | freezes the granular cloud at its current position |
| `padBurst` | industrial noise burst |
| `padAcid` | adds a 303 scream over the line |
| `padDrop` | short sub drop |

A pad is a 0/1 slider the panel writes while the button is held. In the
track it must gate a layer: `.gain(instrument.vol.mul(padX))` and
`.filter(audible)`.

### Scenes

`// @scenes` gives two buttons: `INTRO` (atmosphere, cloud, clicks) and
`THEME` (full groove with kick, bass, acid and 8-bit lead; preset from
`dumps/idm-01-splinter-2026-11-15-20-13-18.json`, 193 keys). JSON
export/import lives in the panel.

---

## 3. How to play

1. `npm run web` → `tracks/idm/01-splinter.js`.
2. Start with `INTRO`: `scene 0`, `grainMode 1`, `verb 0.18`.
3. `THEME` or manually: `scene 2`, `mode 1` (grain), `grainSrc 2` (space),
   `bitMode 2` (coarse), `acidMode 1`, `voxMode 2` (chop).
4. Hold `1` (roll) on the last bar of a phrase, release.
5. `padFreeze` (3) for one or two bars to hang the cloud.
6. `padCut` (2) at a break, not constantly.
7. `grainMode 2` (scan) when the cloud should move.
8. `acidMode 3` (scream) briefly at the peak.
9. `mode 3` (strip) removes drums, leaves bass and micro-events.
10. `padDrop` (6) only when entering a new section.

Rule: **less is more**. One pad per phrase, one switch between sections.
If it feels thin, remove a layer first.

---

## 4. Documents

- `01-techniques.en.md` — glitch, granular, micro-events, 8-bit, acid, bass.
- `02-arrangement.en.md` — tempo, form, dark/atonal harmony, anti-pop.
- `03-strudel.en.md` — Strudel mapping, CPU budgets, pitfalls.
- `04-sources.en.md` — sources and what was taken from each.

RU: the same files without the `.en` suffix.

---

## 5. Gates

A new IDM track is done when these pass:

`verify`, `tension`, `modes`, `latch`, `gains`, `doubles`, `cpu`, `live`.

For `01-splinter`:

- `verify` — 33 tracks, 130 hits per bar, 193 sliders, 0 errors.
- `tension` — no friction; 140 deliberate tritones in anchored phrases (`@dark`).
- `modes` — 8 grids: kick 16/8/16/4/28/20/24/40,
  snare 12/4/8/0/20/8/16/32.
- `latch` — harmony switches on bar 8, not bar 4.
- `gains` — silent at all zeros.
- `doubles` — no collisions.
- `cpu` — 25–28 worklets/bar = 14–16/s.
- `live` — eval ok, pattern plays, slider stays in sync.
