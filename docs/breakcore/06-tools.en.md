# 06 · Tools (EN)

What people in the threads actually use, and why. No "top 10 plugins".

---

## 1. Renoise (tracker) — the most cited tool

### FX map (what is actually named)

| Command | What it does | Use |
|---|---|---|
| `09xx` | sample offset / start position | replaces slicing, "live" hits `[29927#12]` |
| `900–9FF` | offset without pitch change | precise positions `[18985#50]` |
| `0Exy` | retrigger (y = repeat count) | rolls, snare rushes `[18985#65]` |
| `04xy` | sample gate/threshold | cuts, stutter `[26084#7]` |
| `040A` | restart after cut | gate patterns `[26084#7]` |
| `01xx` / `02xx` | pitch up/down | re-pitching slices `[26084#15]` |
| `07xx` | volume slide | imitates a fast decay `[29927#18]` |
| `08xx` | panning | spreading layers `[26084#15]` |
| `10xx` | volume | smoothing a bass envelope `[18985#4]` |
| `B00/B01` | pattern break | abrupt switches `[18985#4]` |
| `Fxx` | tempo change | swing and odd grooves `[2328#10]` |
| `maYbe` | event probability | generative phrases `[68093#3]` |

> ⚠️ **Pitch disagreement:** Kosta says "`0180` = octave up, `0280` = octave down"
> `[34022#22]`; Rex corrects: "`xx10` = semitone, `0180` = 8 semitones, `XXF0` =
> octave + 3 semitones" `[34022#23]`. Trust Rex, verify in the DAW.

### LPB / BPM / speed
- 8 LPB @ 400 BPM — visually convenient `[29927#14]`.
- 16 LPB @ 200 BPM sounds identical `[29927#21]`.
- 24 LPB — "24 LPB REPRESENT!" `[29927#23]`.
- BotB: 800 BPM / speed 3 to remove mud `[18985#46]`.
- Speed 3 at 240 BPM is sunjammer's practical ceiling `[18985#65]`.
- "Vache" settings (from a video): speed 3, tempo 447 `[18985#16]` — but the video
  reading was later retracted `[18985#15–17]`; not canon.

### LPB arithmetic (far_darrig)
- 96-line pattern @ LPB 24: every 24th line = 1/4, 12th = 1/8, 6th = 1/16.
- Triplets: 24/3 = 8.
- 20 lines @ LPB 4 = 5/4 `[2328#7]`.

### Workflow
- Render selection: `CTRL+SHIFT+ALT+R` → new sample `[34022#10]`.
- Uncheck "beatfit" when rendering loop points so you can do a "rising snare fill"
  `[18985#4]`.
- The sample-editor FX button is a destructive variation `[34022#5]`.
- Build heavy breaks in a separate project, then import the WAV `[18985#49]`.
- Renoise demo songs contain a beatslice example — "Open it up and look deep into it"
  `[20448#2]`.

### Practice files (.xrns) mentioned in threads
- `rinse technique.xrns` — the rinse technique `[29927#1]`.
- `Tutorial6 - Sample Offset.rns` — explains `900–9FF` `[18985#60]`.
- `breekjebeenbiet.rar` (BotB) `[18985#38]`.
- `Benefit_of_the_Xrns.rar` `[26084#8]`.
- `Dank.it` / `Dankedit.xrns` `[18985#20]`.
- `mod.zip`, `an-pathren.zip` (Abrexxes) `[18985#2]`.
- Lneheb — xrns in YouTube descriptions `[68093#3]`.
- `grep-fu.net/venetiantabs/` — "Vache" remake (dead by 2013) `[18985#18, #74]`.

---

## 2. Hardware

### Octatrack (most common)
- Slice plus manual correction of auto-slices, "Octatrack often gets it wrong"
  `[175570]`.
- Timestretch **off**, re-pitch to tempo `[175570]`.
- P-lock start/end, slices on the crossfader, freeze delay, retrig `[175570]`.
- LFO on slice selection = "random break chopping" `[212983]`.
- LoFi (SRR + bit depth + AM) and comb filter `[173811]`.
- 3-bar chop over 4/8 bars, 6/8 feel `[226901]`.

### Digitakt / Digitakt II
- No proper manual slicing (at thread time) → p-lock start/end `[175570]`.
- Trick: LFO time-stretch, **LFO phase** as a "janky auto slice" `[175570]`.
- DT2 OS 1.10: transient-aware slicing, Slice Machine + random locks `[230650]`.
- LFO targeting the sample slot, sine with odd timing = evolution `[173927]`.

### Model:Samples / M8 / Polyend Tracker
- Model:Samples: p-lock start/end + retrigger + conditions `[175570]`.
- M8: slicing 2–128, non-multiple counts break phrasing `[209309]`.
- Polyend Tracker: beat slice, 8/16 chops on a tight loop `[175570]`.

### Tonverk (recent)
- 16 slices × velocity layers: velocity ramp = normal playback, velocity random =
  generative variation `[253094]`.
- BONK kit: 128 velocity layers, 8 round robins, transient/BPM slicing `[253094]`.

---

## 3. norns (Monome) — two ready scripts

### `makebreakbeat`
Pipeline: tempo detection → onset detection (min distance 1/16) → slice → probabilistic
per-slice FX → quantized reassembly `[53301]`.

Example flags from the docs:
```
--trunc 0 --stutter 30 --kick 10 --deviation 10 --snare 10 --reverse 10
--pitch 10 --kick-mix -6 --snare-mix -6 --reverb 5 --stretch 1 --half 1
--trunc 10 --tempo 174
```
Stutter includes random volume/pitch ramps; a reverb tail on kick/snare is appended
as a separate quantized slice `[53301]`.

### `amenbreak`
200+ Amen samples, 2 knobs (amen / break), automatic stutter/stretch/delay, "punch" =
overdrive/decimate/degrade, per-slice editor, probability-driven FX `[60185]`.

**FX order in the script (a ready recipe):** stretch → volume → pitch → delay →
reverse → gate → tape stop → filter → mute `[60185]`.

---

## 4. Livecoding / generative

| Tool | What it gives | Source |
|---|---|---|
| **SuperCollider + BBCut** | `SQPusher1` fast cuts; half-speed = double slice count (`SF3(file,16)` vs `8`); `SQPushFXPitch(pbchance:0.8)`; `CombN` after | `[5102#10]` |
| **Tidal Cycles** | `every 4 (rev)`, `density 4`, `*2`, `rev`, `brak`, `|+| pan sine1`, `[sn/2 sn/4 bd8 bd]8` | `[5102#10]` |
| **Conductive** (Renick Bell) | Haskell libraries over an SC engine | `[5102#12]` |
| **Sonic Pi** | livecoding + Voltage Modular, DAWless | `[6446]` |

**Limitation:** the generative approach requires fine control, otherwise it becomes
"abstruse" `[5102#19]`.

---

## 5. DAWs and plugins (what is named)

- **Ableton**: slice-to-MIDI, Simpler (transient sensitivity + timestretch), Drum Rack
  for per-slice pitch `[175570]`.
- **FL Studio**: Slicex (up to 150 slices), Gross Beat, dBlue Glitch, Love Philter,
  Peak Controller `[6643#30]`.
- **Reaper**: batch stretch, batch export of rx2 slices `[173927]`.
- **iZotope**: Stutter Edit, BreakTweaker `[5102#2]`.
- **Propellerheads ReCycle** — Aphex's historical tool `[244253]`.
- **Koala Sampler** — equal auto-chop 8/16 `[175570]`.
- **Serum 2** — break chopping/slicing walkthroughs `[193593]`.

---

## 6. What to pick for the job

| Job | Choice | Rationale |
|---|---|---|
| Maximum control | Renoise | `09xx`/`0Exy`/`04xx` + LPB `[78569]` |
| One-track speedrun | Ableton + Drum Rack | slice-to-MIDI + Simpler `[175570]` |
| Live performance | Octatrack | slices on the crossfader, freeze delay `[175570]` |
| Fast ideas in code | Strudel | `slice/chop/degradeBy` — `08-strudel.en.md` |
| Generative variations | SC/BBCut or Tidal | ready primitives `[5102#10]` |
| Hybrid | Renoise + render to samples | "render to sample is your friend" `[29927#32]` |
