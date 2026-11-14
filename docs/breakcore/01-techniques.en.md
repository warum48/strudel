# 01 · Drum techniques (EN)

Everything that makes the sound "breakcore" happens here. Ordered from foundation
to decoration.

---

## 1. Note-off / rinse — the foundation

**Rule:** before every next sample, place a note-off (or equivalent); a tail must
not overlap the next hit. In a tracker:

```
C-4 80 ----   ← hit
--- -- ----   ← note-off on the next line
C-4 80 ----   ← next hit
--- -- ----
```

Primary source: "for fast breaks to sound intelligible … you've gotta use note
offs … always put a note-off before the next sample and usually keep a break rinse
limited to one column" `[29927#1]`.

Why it works:
- the gaps are "milliseconds or less", but they land on the BPM grid, so the track
  is "perfectly divisible by these bits of silence" `[29927#1]`;
- removing note-offs makes the sound "muddy and muffled", and the difference is
  critical at high tempo `[18985#46]`;
- one identical DSP chain on the whole column preserves the break's "relative
  character" `[29927#1]`.

**Scale:** 8 LPB @ 400 BPM — visually convenient and detailed enough `[29927#14]`.
It is equivalent to 16 LPB @ 200 BPM `[29927#21]`. 24 LPB is fine too `[29927#23]`.
BotB went to 800 BPM / speed 3 to remove "mud" `[18985#46]`.

> Practical conclusion: don't chase resolution. "pushing your speed to a point
> where it doesn't really matter anymore … it's just going to be like an ocd kind
> of thing" `[18985#65]`.

---

## 2. Cut variants when there is no note-off

| Method | How | Source |
|---|---|---|
| Volume gate | `C-4 80` → `--- 00` on the next line | `[34022#17]` |
| Smooth gate | `0403` (quiet) → `0407` → `04FF` (open) → `0407` | `[34022#24]` |
| Volume slide | `07xx` downward — imitates a fast decay | `[29927#18]` |
| Cut + reopen | `04XX` cuts the sample to a threshold, `040A` reopens it | `[26084#7]` |
| Amp envelope | short decay, 0 sustain (sampler/DAW) | `[175570]` |

The `04XX` gate is effectively "how much of the sample leaks through": values up to
`09`, then restart with `040A` `[26084#7]`.

---

## 3. The `09xx` school (sample offset) — the alternative to slicing

Instead of slicing into separate hits, trigger a *position* inside one sample.

**Map (Amen example):**
- `0922` — hard snare
- `0948` — soft kick
- `0972` — ride `[29927#12]`

**Techniques:**
- Split a long break into 2+ even parts and reference them **in one column** to keep
  the mono character `[29927#18]`.
- `900–9FF` — change position **without changing pitch** `[18985#50]`.
- Random values produce "surprising outcomes that sound much better" than
  calculated ones `[29927#13]`.
- In Renoise, the number under the cursor in the sample editor is the `09xx` value
  (snare ≈ `0940`) `[26084#7]`.

**Pros:** keeps the dynamics of the played break, less manual work.
**Cons:** needs a map; at 180 BPM you still have to retrigger every hit `[29927#32]`.

---

## 4. Chopping: how much and how

### Coarseness — the main decision
- Cut on **1/4 and 1/8, not 16ths**: "I'll only ever cut to 1/4 or 8th notes, never
  16ths. You loose all the groove if you chop too tight" `[226901]`.
- Advanced minimum: **3–5 markers** — kick, snare, shuffle, 1–2 variations; "the
  intricacy happens all within the sequencing" `[175570]`.
- 8–16 equal chops on a tight 1–2 bar break is a working point `[175570]`.
- 16 slices → a "best of" compilation: keep the best kick/snare/hat and transplant
  them into weak slots `[226901]`.

### Grid vs transients
- More slices = your own feel; fewer = the original feel `[175570]`.
- To change the break a lot while keeping the groove → **many slices placed evenly on
  the grid, not on transients** `[175570]`.
- Warp only kick/snare; leave ghost notes and shakers unwarped `[175570]`.
- Cut **after** 1/8 or 3/16 so flams and extra hats fall inside the slice; cut
  hats/bongos on an off-beat so the slice opens with a quiet hit `[173927]`.

### Micro-slicing (a separate style)
- Keep only the peak plus a little around it, play at ~160 BPM interleaved with other
  sounds `[173927]`.
- Or the opposite: keep only multi-hit clusters (32nds), exclude single hits, and
  sequence at 8th resolution `[173927]`.

### Slice count as composition
- A non-multiple count (13 slices over a 4-bar loop) deliberately breaks phrasing
  `[209309]`.
- Same generative pattern: grid 16 = staccato, grid 8 = normal; the rule is that the
  slice count must match the loop length in beats `[256454]`.
- A 3-bar loop chopped into quarters and laid over 4/8 bars creates "displacement"
  without polyrhythm `[226901]`.

### Re-pitching
- Copies of the same break at −5 and +5 semitones instead of stacking different
  breaks: the low copy gives body, the high one gives attack; the original stays
  dominant `[002-jungle]` (see `.memory-bank/research.md`, DNB Academy).
- Re-pitching a single slice keeps the mono logic: `01xx/02xx` `[26084#15]`.

---

## 5. Retrigger, rolls, stutter

- **`0Exy` + `04xy`** — "sick control with very little rez" `[18985#65]`.
- **Lower TPB** so every roll hit can be edited: "retrigger won't sound right" at high
  TPB `[18985#11–13]`.
- **Ratchet chain:** copy the sample with very short loop points; tuning the loop
  gives pitch; sequence it as a ratchet `[173927]`.
- **Hyperspeed = a single-cycle waveform:** "When you retrigger stuff in hyperspeed,
  you're basically turning a drum sample into a single cycle waveform" `[34022#13]`.
- **Stutter Edit / BreakTweaker** — canned micro-edits, use "sparingly to humanize"
  `[5102#2]`.
- **Probability rolls on hardware:** long retrigs + chance 50–60 %, then ramp to 100 %
  `[173927]`; ratchet only under a condition so it never repeats in the same place
  `[173927]`.
- **A roll ≠ a snare rush:** a snare rush is made by changing samples/pitch, not by
  one retrigger (`[6643#14]` — "needs more snare rushes and fills").

---

## 6. Per-hit separation and layering

**School C (stems):**
- `bd=Track01, sn=Track02, chh=Track03`, summed into one send → compressor/EQ/filter
  `[29927#19]`.
- Allows an independent pitch slide on the kick and `0Exx` on the snare at the same
  time `[29927#28]`.
- Mandatory condition: chop first, then spread. Otherwise "noisy with unambitious
  acoustic patterns" `[29927#10]`.

**Layering:**
- "Layering beats is your CLOSEST friend" `[26084#15]`.
- Gate one of the percussion layers — "salt to taste" `[26084#15]`.
- Up to 5 snares per snare `[26084#17]`.
- Counter-argument: "you should almost never layer your breaks" — an effect on a
  break is only valid if you want that effect there `[34022#32]`.
- Layering breaks when you swap the break: hits "move slightly" and conflict
  `[34022#29]`.

**Decision rule:** layer only what will not change; everything else goes into the
mono rinse column.

---

## 7. The snare is its own discipline

- 3–5 different snares, each with its own velocity `[26084#17]`.
- A ghost snare is a quiet hit in an empty slot; "velocity is very important … it will
  sound like a ghost snare at high speeds" `[18985#66]`.
- Pitch variation between snares — **no more than half a step** `[18985#11]`.
- A "fake" snare is often fixed not by a second snare but by finding a clean hit
  elsewhere in a multi-bar break `[18985#56]`.
- Snare rush: a set of snares + pitch slide up/down (the junglist trick) `[29927#18]`.

---

## 8. Break switching and tempo sync

**Sync without warping (junglist trick):**
1. Enable tempo-sync on the instrument and read the exact transpose/fine-tune from the
   tooltip.
2. **Disable sync** and type those values in manually.
3. The break is tempo-locked but still pitchable → you can do "gradually pitched
   up/down snare rolls" like on *Detrimentalist* `[29927#18]`.

**Arithmetic:**
- `×1.5` tempo = `+7` semitones `[226901]`.
- Too high and it "cuts the sound" `[226901]`.

**Switching rules:**
- Sync the loop to 4/8/16 bars `[29927#33]`.
- When swapping the break, rebuild the layering or the groove conflicts `[34022#29]`.
- One track = 3–4 different breaks maximum `[18985#66]`.

---

## 9. Kick, sub, gabber layer

- Gabber kick as an accent: "moderate to heavy use of gabber kicks" `[26084#3]`;
  "drop a GABBA KICKS!" as a cure for a limp track `[44354#2]`.
- Kick and sub are separate elements; low-cut the break or it turns into "muddy
  garbage" `[173927]`.
- At high tempo the kick is short: "use short drum hits, make them snappy AF and put
  distortion on break" `[44354#2]`.

---

## 10. Resampling as the main workflow

1. Select a note + commands → `CTRL+SHIFT+ALT+R` → new sample `[34022#10]`.
2. Add a second layer (vocal, ride), render again. "You can do this for ever"
   `[34022#10]`.
3. Cut lows and EQ **before** rendering so the sample stays clean `[34022#10]`.
4. The sample-editor FX is destructive and writes a new variation `[34022#5]`.
5. Build heavy breaks in a separate project (10–20 % CPU), then import the finished
   WAV `[18985#49]`.
6. After resampling, `09xx` over the new sample gives unpredictable but usable
   positions `[29927#13]`.

---

## 11. Three ready-made recipes

### R1 · "Rinse-classic" (mono, 170–180 BPM)
`note-off` on every hit → one track → summed distortion → 3–5 slices → snare velocity
variation → 4-bar mutation. No layering. `[29927#1, 18985#46]`

### R2 · "Offset-jungle" (live groove, 160–174 BPM)
`09xx` map (kick/snare/ride) → pitch-slide rolls → sync without warping → one clean
break layer on top for attack. `[29927#12, #18]`

### R3 · "Stems-hardcore" (aggression, 180–220 BPM)
Kick/snare/hat on separate tracks → gabber kick on accents → distortion per element +
a shared limiter → short hits → snare rush every 8 bars. `[29927#19, 26084#3, 44354#2]`

---

## 12. Quick "what to use for what" table

| Goal | Technique | Source |
|---|---|---|
| Remove a tail | note-off / 00 vol / 07xx | `[29927#1, #18]` |
| Add grit | LoFi SRR + bit depth, shape/crush | `[173811, 17702#3]` |
| Make a roll | `0Exy` + low TPB | `[18985#65]` |
| Break the phrasing | slice count not divisible by 4 | `[209309]` |
| Make a hit "live" | `09xx` instead of a slice | `[29927#12]` |
| Remove mush | ≤3 elements, one 16th figure | `[173927]` |
| Make the snare "real" | 3–5 samples + velocity | `[26084#17, 18985#66]` |
