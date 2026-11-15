# Tuning and rhythm

## 1. Tuning: seven nearly equal tones

Cambodian classical music uses **seven tones per octave**. The
classic theory (Alexander J. Ellis, 1885, based on Thai and Khmer
fixed-pitch instruments) describes it as **nearly equal**: a step of
≈ 1200 / 7 ≈ **171.4 cents**, not the Western 100/200.

Take that literally:

- the octave is divided into seven comparable steps;
- a "fifth" in that grid is not 700 cents but ≈ 857;
- a "third" is not 300/400 but ≈ 343/514;
- so a Khmer line does not sit exactly in major, minor or Dorian.

**Caveat.** The equal-step theory is disputed: measured ensembles
give different intervals, and Garzoli (2015) calls rigid 7-TET a
"myth". Practice matters more than the formula: tuning drifts, the
ensemble tunes to itself, and there is no absolute pitch.

### Approximating it in 12-TET

The ideal grid (0, 171, 343, 514, 686, 857, 1029 cents) is closest
to:

```
c d eb f g a bb      — "bright" rounding
```

But this project takes the **dark** rounding:

```
c db eb f gb ab bb   — 7 tones, the track
c eb f g bb          — 5 tones, the skeleton
```

Why:

1. `db` and `gb` give the tritone/phrygian colour that makes a Khmer
   line sound unlike Dorian or smooth jazz.
2. The five-tone skeleton `c eb f g bb` is not "pentatonic in
   general": it is the basis for the lower voices (thung, kong vong)
   and for SATHUKAR mode.
3. The seven-tone line (roneat ek, sralai) adds `db` and `gb` as
   colour, not as a chord.

### Registers

- `roneat ek` — 21 bars = three octaves of seven tones; high register.
- `roneat thung` — same tuning an octave lower.
- `kong vong` — gong circle; octave 3 in the track.
- `sralai` — mid-high register; the ensemble is built from it.

The track separates registers: drone/gongs 2–3, thung 4, ek and
sralai 5. This is not "frequency balance" but a rule of heterophony:
voices must not collapse into one timbre.

### Harmony

Pinpeat has no functional harmony: no tonic-dominant, no chord grid,
no 1–2–4–5. It has a **cycle** and a **support**. So in the track:

- `PAD_A` — open fifth C–G;
- `PAD_B` — the same support with a tritone C–Gb;
- `harmony` switches the colour every 8 bars (latched);
- the melody does not "play over chords"; it lives over the support.

The tritone is the axis of the scale, not an error. `@dark` allows it
in anchored phrases; there are no minor seconds in the same register.

---

## 2. Rhythm: cycle, colotomy, heterophony

### Colotomy

A Khmer ensemble thinks in **cycles**, not in bars with a downbeat.
Instruments divide the cycle on different levels:

| Instrument | What it does |
|---|---|
| chhing | marks the cycle and beats; closed accent + open "ching" |
| sampho | leads the ensemble, sets tempo, plays variations |
| skor thom | pair of big drums, tight/loose, the "floor" |
| kong vong | ostinato support, skeleton melody |
| roneat ek | ornamented melody |
| roneat thung | skeleton melody an octave down |
| sralai | long line; the ensemble tunes to it |

These are not "beat layers" but **different densities of one line**.
That is why roneat ek and thung do not play the same melody note for
note: they play two versions, ornament and skeleton.

### The track's grid

- 88 BPM, one cycle = one 4/4 bar (≈ 2.73 s).
- Eight bars = a phrase; switches and pads change on the boundary.
- `chhing` — quarters; `sampho` — syncopations; `skor thom` — floor.
- `mode 2 BOXING` densifies the pattern without changing tempo: a
  modern adaptation of the boxing acceleration.

### Form

| Scene | What plays |
|---|---|
| 0 INTRO | air, drone, kong vong, chhing |
| 1 BUILD | + skor thom, sampho, roneat thung, sub |
| 2 MAIN | + roneat ek, sralai, sampho ghosts |
| 3 BREAK | drums, gongs, chhing only; melodies removed |
| 4 OUTRO | kong vong, chhing, thung, drone |

### Modes

| mode | What changes |
|---|---|
| 0 SATHUKAR | 5 tones, sparse, no sralai; ceremonial |
| 1 PINPEAT | 7 tones, full ensemble, sralai |
| 2 BOXING | denser, fills, short sralai phrases |
| 3 PERCUSSION | no xylophones or sralai; drums and gongs |

### Sathukar and the repertoire

`Sathukar` is not a "genre" but an **opening piece** of pinpeat: it
sounds at festivals and rituals, in the royal ballet, masked theatre
and shadow theatre, and pays homage to the teacher. The pinpeat
repertoire has more than 250 pieces; for the Reamker (Khmer Ramayana)
there are separate `bot` pieces for episodes.

The track is named `01-sathukar` as a homage to the opening piece,
but it is **not a transcription**: it is an original composition using
the Khmer scale and Khmer instrument roles.

### Boxing music

Khmer boxing music (`vung phleng`) uses sralai, sampho and chhing.
The first part is slow and free (rubato), the second is fast and
metred and accelerates as the round goes on. This is the direct model
for `mode 2 BOXING`: the same three instruments, a different density.

---

## 3. Anti-pop

The project rules apply literally:

- no major triads and no "pretty" cadences;
- no 1–2–4–5 and no risers;
- no snare on 2 and 4 — pinpeat has no snare at all;
- melody is heterophony, not a theme with chords;
- bass (the modern sub) ≤80 Hz and only in build/main.

The complexity is in the drum pattern and in what the xylophone
**does not play**. Emptiness is part of the composition.
