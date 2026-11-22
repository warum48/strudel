# Samples: what actually exists

Short answer: **we do not have a ready-made Khmer one-shot sample bank.**
Strudel has no "Khmer" sample map, and Dirt-Samples has no Khmer
instruments either. So 02-skors is built from real, but non-Khmer
recordings — and the track says so.

## 1. What is available

| Source | What it contains | Good for |
|---|---|---|
| **Dirt-Samples** (`github:tidalcycles/Dirt-Samples`) | real hits: `east` (taiko, shime, woodblock), `hand`, `tabla`, `metal`, `tok`, `tink`, `chin` | drums, gong substitutes, chhing |
| **VSCO 2 CE** (`sgossner/VSCO-2-CE`, CC0) | real orchestral marimba, xylo, glock, gong, claves | xylophones, gongs, wood |
| **Freesound** | field recordings and one-shots, licence per file | if you check licences |
| **Internet Archive** | concerts, radio, interviews | phrases/loops, not one-shots |
| **Roneat Studio Pro** (GitHub) | a roneat ek app; the repo contains **mock/dummy** samples, not studio recordings | as software/idea, not a bank |
| **Sounds of Angkor** | instrument videos and photos | reference, not samples |

Also: Strudel has `samples('shabda:roneat:4')` — a Freesound query.
It may find Khmer recordings, but results are not guaranteed, licences
vary, and the live check depends on the network. We do not rely on it.

## 2. What 02-skors uses

| Part | Sample | Why |
|---|---|---|
| skor low/high/fill | `east:6–8` (taiko), `east:3–5` (shime), `east:0–2` (woodblock) | real stick hits, not synth |
| sampho low | `hand:0–3` | real hand drum |
| sampho high/ghost | `tabla:9–14`, `tabla:19–25` | real closed/high strokes |
| chhing closed/open/roll | `metal:0–9` | real metal, not FM |
| krap | VSCO `Claves1_Hit_*` | real wood |
| kong vong/thom | VSCO `gongHit_mf`, `gongHit_f` | real gong |
| roneat ek/oct | VSCO `Xylo_Medium_*` | real xylophone |
| roneat thung | VSCO `Marimba_hit_Outrigger_*` | real marimba, lower |

VSCO pitched samples are 12-TET. The Khmer scale is approximated as in
01; that is a compromise, not "authentic tuning".

## 3. Why not Khmer recordings

- We found no public one-shot bank of `roneat`/`sampho`/`skor thom`/
  `chhing` with a clear licence.
- Field recordings on Archive/Freesound are usually whole phrases, not
  isolated hits; they need slicing and cleaning.
- `Roneat Studio Pro` explicitly says the repository contains dummy
  files; the studio recordings must be supplied by the user.
- The best source is **recording the instruments locally**. You live in
  Cambodia; that beats any GitHub bank.

## 4. How to swap in local recordings

1. Record one-shots: each roneat bar (or at least C/G across octaves),
   2–3 dynamics; sampho `ting/tip/theung/tup`; skor thom tight/loose;
   chhing closed/open; several gongs.
2. Trim attack/tail, normalize, remove noise. Use Latin filenames
   without spaces.
3. Put them in a public repo (GitHub raw) or a local
   `@strudel/sampler` server.
4. Replace the map in the track:

```js
samples({
  roneat: {
    c4: 'roneat/c4.wav',
    g4: 'roneat/g4.wav',
    c5: 'roneat/c5.wav',
    g5: 'roneat/g5.wav',
  },
  samphoLow: ['sampho/theung1.wav', 'sampho/theung2.wav'],
}, 'http://localhost:5432/')
```

5. Keep `note("c5")` / `n("0 1")`: Strudel picks the nearest sample and
   pitch-shifts it.

## 5. Limits of the current solution

- 02-skors sounds "more real" than 01, but it is **not a Khmer
  ensemble**: taiko instead of skor thom, tabla instead of sampho,
  orchestral gong instead of kong vong.
- The VSCO xylophone is a Western instrument; it is closer to roneat ek
  than a synth, but the timbre differs.
- The PRELOAD SAMPLES button in the panel downloads only `github:` maps (Dirt).
  The VSCO map loads lazily from direct URLs; for offline use, download
  it separately.
- VSCO 2 CE is CC0. Dirt-Samples has long been used in this project;
  check the licence of specific files before publishing a track.
