# 05 · Samples and breaks (EN)

---

## 1. Canonical breaks

| Break | Source | Role |
|---|---|---|
| **Amen** (The Winstons, 1969) | the most sampled break in history | primary; original ≈ 136 BPM `[29927#32]` |
| **Think** (Lyn Collins) | second most used | second layer / fills `[18985#51]` |
| **Hot Pants** (James Brown) | — | alternative groove `[175570]` |
| **Apache** (Incredible Bongo Band) | — | third layer, "wild" groove `[175570]` |
| **Funky Drummer** (James Brown) | — | the reference funk grid `[173927#8]` |
| **Impeach the President** | — | simple base for mutations `[173927#8]` |
| **Rusty Bryant "Fire Eater" (part 6)** | — | Aphex/Tuss source `[173927]` |
| **BW Souls "Marvin's Groove"** | — | rare, distinctive `[173927]` |
| **AJ Hall break** | — | mentioned in the DnB battle `[184524]` |

**Rule:** 3–4 different breaks per track maximum `[18985#66]`. One break re-pitched
±5 semitones beats stacking different breaks `[002-jungle]`.

---

## 2. Where to get them (sources verified in threads)

| Source | What | Link |
|---|---|---|
| **rhythm-lab.com/breakbeats** | ~1600 breaks (2023+), bulk download via `wget -r` / jdownloader | `[173927]` |
| **archive.org "amen-breaks-compilation"** | 200+ Amen variants, used by the norns `amenbreak` script | `[60185]` |
| **101 breaks pack** | historical pack from the rinse thread | `http://tinyurl.com/qfd4l` `[29927#1]` |
| **Declassified breaks pack** | same thread | `artmeetsscience.co.uk/downloads/declassified-breakspack.rar` `[29927#1]` (old link) |
| **"All Your Breaks Are Belong To Us" 1.1 / 2** | DOA origin, links expired | `[226901]` |
| **Dolly Zoom — Spasmodic EP** | every track ships a pack with all samples used | `[78570#1]` |
| **freesound.org** | field recordings, noises | `[29927#30]` |
| **Your own recordings** | "Sampling your own acoustic sounds can be awesome" | `[29927#30]` |
| **Game ROM rips** | Sonic 2, Vectorman 2 — as texture sources | `[29927#29]` |

**Licensing:** Amen comes from a released Winstons recording; royalties were never
paid `[002-jungle]`. For release, use royalty-free packs or your own recording.

---

## 3. What this repository already has

Two verified sample maps already wired in `tracks/dnb/*`:

```js
samples('github:yaxu/clean-breaks/main')
// amen  — the full Amen Brother break
// think — the Think break (Lyn Collins)
// apache — Apache (Incredible Bongo Band)

samples('github:tidalcycles/Dirt-Samples')
// amencutup — 32 pre-chopped Amen pieces
// jungle    — ready jungle kit (kick/snare/hat/ride/perc)
// jungbass  — deep jungle subs (mega_jungasubdown)
// hardcore  — kick/snare for the gabber layer
// industrial, glitch, noise2, dist — textures
// hoover    — rave hoover
```

That is exactly the set breakcore needs: one full break + a chopped version +
kick/snare + sub + textures.

---

## 4. Sample preparation

### Metadata in the filename
- `file_bpm160.wav` — BPM in the name, auto-sync `[60185]`.
- `file_beats4_bpm160.wav` — beat count in the name so slices land exactly `[60185]`.

### Break preparation
1. Bring it to the target tempo **without warping** if possible: re-pitch `[175570]`.
2. Check the break's tempo ceiling: "There is an upper bound of tempo that any given
   break 'wants' to be at" `[226901]`.
3. Trim silence at the start/end so slice 0 = the first hit.
4. Keep a "raw" version and a "processed" version (tape stop, flanger, stretched) —
   processed variants get appended to the same source as extra slice material
   `[175570]`.

### Batch slicing
- Reaper: import many files → batch export slices as WAV `[173927]`.
- Wavelab: batch processing `[173927]`.
- Koala / Blackbox: transient auto-chop, then edit `[175570]`.
- `makebreakbeat` (norns): onset detection with a minimum distance of 1/16, sox
  splicing with leeway + waveform-similarity comparison + crossfade `[53301]`.

---

## 5. Stem separation

**Not discussed** in the corpus — the only mention is terminology: "Clips is just the
Ableton term for stem" `[173927]`. Do not attribute techniques to threads that do not
contain them.

Common practice (outside the corpus): isolate drums from a finished track for
reference, but use original breaks for production.

---

## 6. Samples you also need

Besides breaks, for breakcore:
- **snares** — at least 3–5 different ones, different velocities `[26084#17]`;
- **hats/ride** — for the 1/8 anchor `[173927]`;
- **kick** — short, "snappy" `[44354#2]`;
- **gabber kick** — as an accent `[26084#3]`;
- **sub** — mono, deep;
- **textures** — noise, metal, field, vinyl crackle;
- **vocals/speech** — pitch-shifted, short reverb;
- **orchestral/cinematic hits** — for contrast.

---

## 7. Sample checklist

- [ ] At least 1 full break plus its chopped version.
- [ ] 3–5 different snares.
- [ ] A separate kick and a separate sub.
- [ ] 2–3 textures (noise/metal/grit).
- [ ] Filenames contain BPM/beat count if the tool uses them.
- [ ] Processed break variants saved as separate samples.
- [ ] Royalty-free licenses or your own recording.
