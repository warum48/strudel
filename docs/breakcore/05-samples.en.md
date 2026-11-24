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

## 3a. Verified break shortlist (DnB / big beat)

These are the breaks wired into `tracks/bigbeat/01-acid-breaks.js` through the
`breakSel` switch, so they can be auditioned live. Lengths are measured from the
WAV headers; `loopAt` is the value that keeps the original pitch at 125 BPM.
Picks were checked by duration, loop fit and transient shape (spectrogram),
not by ear — except `think`, which is approved as a main hook.

| Key | Break | Length | `loopAt` @125 | Character | Audition |
|---|---|---|---|---|---|
| `think` | Lyn Collins — Think | 2.10 s | 1 | funk, **vocal shout** — approved main hook | [raw wav](https://raw.githubusercontent.com/yaxu/clean-breaks/main/sounds/Lyn_Collins_-_Think_%284%29%20%5B2019-03-04%20124551%5D.wav) |
| `amen` | The Winstons — Amen Brother | 6.96 s | 4 | dry classic, instrumental | [raw wav](https://raw.githubusercontent.com/yaxu/clean-breaks/main/sounds/The_Winstons_-_Amen_Brother%20%5B2019-03-04%20124550%5D.wav) |
| `apache` | Incredible Bongo Band — Apache | 4.16 s | 2 | bongo funk, instrumental | [raw wav](https://raw.githubusercontent.com/yaxu/clean-breaks/main/sounds/Michael_Viner%27s_Incredible_Bongo_Band_-_Apache_%281%29%28Fixed-End%29%20%5B2019-03-04%20124550%5D.wav) |
| `movement` | SL Troopers — Movement | 3.90 s | 2 | dense hats, instrumental | [raw wav](https://raw.githubusercontent.com/yaxu/clean-breaks/main/sounds/SL_Troopers_-_Movement_%282%29%20%5B2019-03-04%20124549%5D.wav) |
| `eeloil` | The Bamboos — Eel Oil | 4.11 s | 2 | mid-tempo funk, instrumental | [raw wav](https://raw.githubusercontent.com/yaxu/clean-breaks/main/sounds/The_Bamboos_-_Eel_Oil%20%5B2019-03-04%20124549%5D.wav) |
| `neworleans` | Nat Adderley — New Orleans | 4.12 s | 2 | busy hats, instrumental | [raw wav](https://raw.githubusercontent.com/yaxu/clean-breaks/main/sounds/Nat_Adderley_-_New_Orleans%20%5B2019-03-04%20124550%5D.wav) |
| `squib` | Tower Of Power — Squib Cakes | 4.30 s | 2 | tight funk, instrumental | [raw wav](https://raw.githubusercontent.com/yaxu/clean-breaks/main/sounds/Tower_Of_Power_-_Squib_Cakes%20%5B2019-03-04%20124552%5D.wav) |
| `breaks125:0` | Dirt-Samples — 015_sdstckbr | 1.87 s | 1 | clean 125 loop | [raw wav](https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/breaks125/015_sdstckbr.wav) |
| `breaks125:1` | Dirt-Samples — 016_bllstmp | 1.94 s | 1 | clean 125 loop | [raw wav](https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/breaks125/016_bllstmp.wav) |

Local copies (same files, no network): `backup/samples/clean-breaks/sounds/` and
`backup/samples/Dirt-Samples/breaks125/` — open the WAV in any player.

Source folders:

- clean-breaks: <https://github.com/yaxu/clean-breaks/tree/main/sounds>
- Dirt-Samples breaks: <https://github.com/tidalcycles/Dirt-Samples/tree/master/breaks125>
- map index: <https://raw.githubusercontent.com/yaxu/clean-breaks/main/strudel.json>

More packs: <https://rhythm-lab.com/breakbeats>, archive.org
`amen-breaks-compilation`, and the packs in §2.

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
