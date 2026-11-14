# BREAKCORE — working reference (EN)

> English copy of the reference. Russian original: `README.md`.
> Raw forum transcripts stay in `threads/` (they are English already).
> Every claim carries a source tag like `[29927#1]` — legend in `09-sources.en.md`.

---

## 0. What breakcore is (working definition)

- **Drums are the main element, everything else is a backdrop.** "Electronically
  composed drum solos with the drum solos being the main element of a track with
  other sounds being a backdrop" — bfk `[6643#1]`.
- **The genre is defined by the breakbeat, not the tempo.** Threads cite
  150–360 BPM `[26084#3]`; there are 90 BPM tracks whose "breakcoreness" comes
  from micro-timing, not speed `[5102#18]`.
- **It is not "lots of notes".** The point is chopping, gating and groove; "there's
  a lot of heavy breakcore that uses clean beats" `[17702#3]`.
- **Lineage:** jungle/DnB (Amen, Think), hardcore/gabber (kick, aggression),
  IDM (micro-editing, generativity), noise/industrial (texture) `[26084#3]`.

Working formula: **one break → coarse chopping → hard micro-timing → 2–3 layers →
one distortion bus → sub → mutate every 4 bars**.

---

## 1. Three schools of chopping (pick one as your base)

### A. Rinse / note-off (mono column) — "the canon"
One track for the whole break, every tail cut by a **note-off before the next
sample**, one DSP chain for the entire column.

- "always put a note-off before the next sample and usually keep a break rinse
  limited to one column" `[29927#1]`.
- The resulting silence is "milliseconds or less" and divides the bar perfectly
  `[29927#1]`.
- Removing note-offs makes the sound "muddy and muffled" `[18985#46]`.
- Scale: 8 LPB @ 400 BPM — "precisely for detail" `[29927#14]`.
- Plus: the break keeps its character. Minus: no per-hit control.

### B. 09xx / offset-mashing — "live groove"
Don't slice; trigger *positions inside the sample* (`09xx`) to preserve the
dynamics of a played break.

- "0922 = hard snare, 0948 = soft kick, 0972 = ride cymbal" `[29927#12]`.
- Random values often sound better than calculated ones: "wild rafting" vs
  "controlled paddling" `[29927#13]`.
- Split a long break into 2+ even parts and reference them **in one column** to
  keep the mono feel `[29927#18]`.
- `900–9FF` changes position while keeping the original pitch `[18985#50]`.
- Requires a sample map (or a paper cheat-sheet).

### C. Per-hit stems — "mixer" approach
Each element on its own track: `bd=Track01, sn=Track02, chh=Track03`, summed into
one send for compression/EQ/filter `[29927#19]`.

- Maximum control: "pitch slide this kick while I 0Exx that snare" `[29927#28]`.
- Risk: "this is the reason most of the self-called breakcore music sound noisy
  with unambitious acoustic patterns" `[29927#10]` — spreading loops across tracks
  without chopping produces mush.
- Counterweight: atomly argues you should "almost never layer your breaks" and only
  add effects when you specifically want that sound `[34022#32]`.

**Practice:** A for the foundation (character), B for liveliness/fills, C
selectively for kick/snare.

---

## 2. Canonical recipe (MVP in one evening)

1. **Tempo.** 170–180 BPM as the working point; 5/8 or meter changes are optional,
   not mandatory `[6643#49]`. Remember every break has a tempo ceiling — "there is
   an upper bound of tempo that any given break 'wants' to be at" `[226901]`.
2. **Break.** Amen / Think / Hot Pants / Apache / Funky Drummer `[175570, 173927]`.
   Original Amen ≈ 136 BPM `[29927#32]`.
3. **Chop.** 8–16 slices; cut on 1/4 and 1/8, **not 16ths** — "You loose all the
   groove if you chop too tight" `[226901]`. A typical advanced minimum is 3–5
   markers `[175570]`.
4. **Re-sequence.** New order; re-pitch copies ±1–2 semitones; rolls at phrase ends.
5. **Note-off / gate.** Cut every hit before the next `[29927#1]`; alternatives are
   a `0403→0407→04FF` gate `[34022#24]` or a volume slide `07xx` `[29927#18]`.
6. **Snare variation.** 3–5 different snares, different velocities; a ghost snare is
   a quiet hit in an "empty" slot `[18985#66]`.
7. **Layers.** Kick/snare/hat separate, summed into one distortion bus `[29927#19]`.
   Snare: 3–5 samples `[26084#17]`.
8. **Grit.** Distortion / bit-crush on the summed break bus, LoFi (SRR + bit depth)
   `[173811]`, short delays / comb filter on individual hits `[173927]`.
9. **Low end.** Sub separate, mono, sidechained to the kick; cut the low end of the
   chopped break or it turns into "muddy garbage" `[173927]`.
10. **Structure.** Every 4 bars a new rhythmic/melodic seed `[44354#6]`; split drums
    into "rhythm guitar" and "lead guitar" `[6643#47]`.
11. **Thin out.** 2–3 simultaneous elements; one 16th-note sequence at a time `[173927]`.
12. **Finish.** Mix, then listen for "emptiness": if it is dense all the time, remove
    a layer.

---

## 3. Seven non-negotiables

1. **Note-off / gate on every tail** — otherwise the break is "muddy and muffled"
   `[18985#46]`.
2. **Never warp chops to the grid** — "Warp is the groove killer" `[175570]`.
3. **Do not chop every note** — "over-chopping" produces noise, not music
   `[44354#1, 226901]`.
4. **Thin out:** "only one thing is ever playing at a time" / 2–3 sounds `[173927]`.
5. **One 16th-note figure at a time**; a second 16th layer turns to mush `[173927]`.
6. **The snare must breathe:** 3–5 different samples + velocity, not one clone
   `[18985#66, 26084#17]`.
7. **Structure beats density:** 4-bar mutations and contrast (simple → complex)
   `[44354#6]`.

---

## 4. What almost always ruins a track

- **Over-chopping** into "spastic noise" `[44354#1]`.
- **18 patterns built from 3 variations** `[6643#15]` — the appearance of work instead
  of development.
- **Randomizers as the author** — "stay away from randomizers!!!" `[173927]`,
  "Nothing should be random. That's the 'Intelligent' part of IDM" `[173927]`.
- **Warping / time-stretching chops** → the groove dies `[175570]`.
- **Copying Venetian Snares / Aphex** — "don't try to be like Venetian Snares. Find
  your own thing" `[21030#10]`.
- **Over-compressing the top while distorting** → melody stops sitting `[17702#5]`.
- **Micro-editing perfectionism** — "micro editing spiral without getting anything
  done" `[2328#20]`.

Details in `07-pitfalls.en.md`.

---

## 5. Quick tool choice

| Situation | Tool | Why |
|---|---|---|
| Need micro-timing control | Renoise / tracker | `09xx`, `0Exy`, `04xx`, LPB/BPM automation `[78569]` |
| Need live performance | Octatrack | slice + p-lock + crossfader fills + freeze delay `[175570]` |
| Need speed | Digitakt / M8 / Polyend Tracker | transient slicing, slice-count 2–128 `[209309]` |
| Need generativity | SuperCollider (BBCut), Tidal, Conductive | `SQPusher`, `every 4 (rev)`, `brak` `[5102#10]` |
| Need code in this repo | Strudel | `slice/chop/ply/degradeBy/sometimesBy/crush` — `08-strudel.en.md` |

---

## 6. Folder layout

```
docs/breakcore/
  README.md / README.en.md
  01-techniques.md / .en.md
  02-sequencing.md / .en.md
  03-arrangement.md / .en.md
  04-sound-design.md / .en.md
  05-samples.md / .en.md
  06-tools.md / .en.md
  07-pitfalls.md / .en.md
  08-strudel.md / .en.md
  09-sources.md / .en.md
  10-panel.md / .en.md
  threads/               34 raw forum transcripts (English)
  _tools/                re-scrape script
```

**Reading order for an agent:** `README` → `01` → `02` → `03` → `08-strudel`
→ `10-panel` → `07-pitfalls`. The rest as needed.

---

## 7. Acceptance checklist (before saying "done")

- [ ] Break chopped coarsely (1/4–1/8), not per note.
- [ ] Every hit is cut (note-off / short amp-env / gate).
- [ ] No chop is warped to the grid.
- [ ] Snare uses ≥3 different samples or 3 velocity levels.
- [ ] ≤3 simultaneous elements; no two competing 16th figures.
- [ ] One summed distortion / bit-crush bus on the break.
- [ ] Sub is mono; chopped breaks are low-cut.
- [ ] Change every 4 bars (new hit, roll, layer switch).
- [ ] There is a "plain" section (clean kick/snare) so complexity reads.
- [ ] No direct imitation of a specific artist.

---

## 8. Open disagreements (do not invent consensus)

- **Renoise pitch-command semantics:** `xx10` = semitone (Rex) vs `0180` = octave
  (Kosta) — trust Rex `[34022#22–23]`.
- **Vsnares settings:** speed 3 / TPB 1 vs TPB 3 — the video reading was later
  retracted `[18985#15–17]`.
- **Layering breaks:** "closest friend" `[26084#15]` vs "almost never layer"
  `[34022#32]`.
- **Generativity:** a variation tool `[173927]` vs the basis of the track `[2328#10]`.
- **LPB/BPM:** 8 LPB/400 vs 16 LPB/200 — identical sound, visual difference only
  `[29927#21, #24]`.
