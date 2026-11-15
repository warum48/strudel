# 02 · Form, tempo and dark harmony

## 1. Tempo

IDM is not tied to one BPM, but there are working zones:

- 110–120 — slow head-nod, more room for grains and clicks.
- 120–140 — middle: micro-events still read, but it moves.
- 140–170 — fast IDM/breakcore edge, more rolls and stutter.

`01-splinter` is 136 BPM. Middle: 32nds read as events, not as noise;
the kick is not yet drum & bass.

**Rule.** Change density, not only tempo. At 136 BPM 32nd micro-events
read as a roll; at 170 they become a wall. If you want faster, thin the
pattern first.

---

## 2. Form

IDM works through **density and focus changes**, not "drops":

```
intro  → build → main → break → outro
```

- **intro** — atmosphere, cloud, clicks. No kick or bass.
- **build** — drums and bass enter; micro-events are still sparse.
- **main** — everything; acid and 8-bit lead are present.
- **break** — kick and bass leave; cloud, glitch and pad remain.
- **outro** — kick and bass return, lead leaves.

In `01-splinter` this is `scene` 0–4. Scenes are gates, not a fixed
arrangement; play them in any order.

**Rule.** One scene = one focus. If the break still has kick, bass,
acid and lead, it is a main with another name.

---

## 3. Dark and atonal harmony

IDM does not have to be atonal, but this track deliberately avoids
"happy hardcore" and major triads.

### Axis

```
C — Gb — Db — Bb
```

- C–Gb is a tritone, the main axis.
- Db is a chromatic mediant (bII).
- Bb is bVII.
- No 1–2–4–5, no dominant resolutions.

### Pad

- PAD A — tritone dyads: `[c3,gb3]`, `[db3,g3]`, `[gb3,c4]`, `[bb3,e4]`.
- PAD B — open fifths with a 9th: `[c3,g3,d4]`, `[db3,ab3,eb4]`, …
- No thirds. Major/minor is undecided; the field just hangs.

### Melody

- Use root, b5, b7, 9, b9.
- The tritone is an axis, not an error. `tension` allows it in anchored
  phrases (length divisible by root count) via `@dark`.
- Minor seconds are not forgiven: that is mud, not darkness. Separate
  registers: bass c1–db2, pad c3–e4, lead c5–f6.

**Rule.** Dark harmony is not "more wrong notes"; it is choosing an axis
and refusing familiar resolutions.

---

## 4. Anti-pop

From `docs/rules.md` and project practice:

- no funny melodic lines;
- 303 is an atonal riff, not a way to arpeggiate chords;
- kick is muted by default;
- do not sit in the overused centre;
- no 1–2–4–5 and dominant resolutions;
- counterpoint beats "walking through chord tones".

In IDM this means:

- melody can be a timbre, not a theme;
- a chord can be an interval, not a triad;
- silence is an event;
- repetition is a friend, but repetition with micro-variation.

---

## 5. Rhythm as melody

Forum thesis (Elektronauts, IDMForums): in IDM "melody works as rhythm,
and rhythm works as melody". This is literal:

- different timbres on adjacent steps create a phrase;
- micro-event pitch makes a contour;
- the same pattern with different samples reads as different music.

In `01-splinter` this is `drums.glitch` (n variants), `bits.arp`
(pitch moves through the chord) and `grain.edit` (different pieces at
different speeds).

---

## 6. Controlled randomness

Rule from the threads: **randomness is spice, not structure**.

- Explicit `struct` patterns for rhythm.
- `degradeBy`/`sometimesBy` on textures only, not on the kick.
- `rand` on pan, speed, cutoff; not on notes.
- If randomness removes the t=0 event, that is normal; do not build the
  first bar on it.

In `01-splinter`, probability lives on `glitch`, `squeak`, `bits`,
`grain`; kick, snare and bass are deterministic.

---

## 7. Mix

- Sub ≤80, growl 150–400, pad 300–2000, lead 1–6 kHz.
- Kick is muted but has body; `shape` only on kick and bass growl.
- Reverb is short; delay is the main spatial effect.
- Pan: micro-events wide, bass and kick centred.
- `duckorbit(2)` — light bass sidechain from the kick; in IDM it should
  not pump, only free the low end.

---

## 8. Performance

The track is not only a file; it is a control surface:

- 8 switches: `scene`, `mode`, `grainMode`, `grainSrc`, `bitMode`,
  `acidMode`, `voxMode`, `harmony`.
- `mode` — 8 grids: glitch, grain, acid, strip, skitter, shuffle, poly,
  fracture. 4–7 use every drum layer.
- Mutation: `mutate` (ghosts) and `fill` (32nd fill) sit on top of the
  current grid; they are not modes.
- 6 pads: roll, cut, freeze, burst, acid, drop.
- 2 scenes: Intro / Theme.

Play in **8-bar phrases**: one switch or pad on a boundary. Do not
change everything at once; the listener must hear what changed.

**Rule.** If a knob only changes volume, it is a mixer, not a
performance. Pads and switches must change pattern or timbre.
