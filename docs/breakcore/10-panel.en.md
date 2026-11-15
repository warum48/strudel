# 10 · How to play the track in the panel (EN)

`npm run web` → http://127.0.0.1:8080/ → pick `breakcore/01-rinse.js`.
The panel is built from the track itself; nothing is hard-coded in the UI.

---

## 1. What is where

| Block | Contents |
|---|---|
| **Mixer** (left column) | only `vol` of each instrument |
| **Tone** (middle) | every other parameter: group → instrument, both collapsible |
| **Global** | `verb` + the panel's master gain |
| **Switches** | `mode`, `breakSel`, `slice`, `grit` |
| **Pads** | `padFill`, `padRoll`, `padChop`, `padCut` — "hold to play" |
| **Editor** (right) | the same code; `Ctrl+Enter` run, `Ctrl+.` stop |

---

## 2. Switches

| Knob | Values | What you hear |
|---|---|---|
| `mode` | 0 intro · 1 groove · 2 solo · 3 return · 4 outro | 0 = kick/break/hats, no backbeat snare; 2 = drums and break only, drone/noise drop out; 4 = layers peel off |
| `breakSel` | 0 amen · 1 think · 2 apache · 3 amencutup | changes the break source; `amencutup` is already chopped into 32 pieces |
| `slice` | 0 sparse · 1 straight · 2 broken · 3 stutter · 4 micro | a pattern of short 16th fragments; break pitch stays natural |
| `grit` | 0 clean · 1 crush · 2 shape · 3 both | `crush` = bit-crush, `shape` = waveshaper on the kick |

Rule from the threads: **less is more**. Start at `slice=2` (×8) and `grit=1`.

### `02-stems-hardcore.js` has a different set

| Knob | Values | What it does |
|---|---|---|
| `scene` | intro · build · main · break · outro | arrangement: layers enter/leave by section |
| `mode` | ritual · stomp · roll · half · collapse | kick/snare figure |
| `kick` | clean · dist · hard | **kick recipe**, not volume: `clean` turns the wet layer off; `dist`/`hard` add the saturated band |
| `char` | kick1 · kick2 | pick a ready hardcore kick (`hardcore:4/5`) |
| `perc` | dry · metal | metallic ring on the offbeat |

In Tone the kick has `pitch` (semitones, default −4) and `drive` (light glue on the wet layer):
drive first, normal loudness after. `Kick extra` is the third, synthesized kick;
default 0 — raise the fader if you want one more character.

Pads are the same (keys 1–4): `fill`, `roll`, `stab`, `cut`.

In Tone, `Bass line` and `Acid 303` each have a `pace` knob (`.slow(n)`):
1 = 8ths, 2 = quarters, 4 = halves. The acid glide gate is slowed by the same n.

---

## 3. Pads (momentary)

A pad is a 0/1 slider that the panel writes while you hold it:

- **pointerdown / key 1–4** → value 1, the button lights up;
- **pointerup / keyup / pointer leave** → 0.

In the track a pad gates a one-bar layer, so:

- **hold** — the fill/roll/chop plays and repeats;
- **release** — the layer is gone, nothing sticks.

| Pad | Key | What it does |
|---|---|---|
| `padFill` | 1 | snare rush in 16ths across the bar, rising |
| `padRoll` | 2 | snare in 32nds (8 eighths × ply 4) |
| `padChop` | 3 | break in 32 pieces |
| `padCut` | 4 | gate stutter: 8 pieces, half cut by structure |

Keys do not fire while the editor has focus — digits type normally there.

---

## 4. Playing a set

1. `mode=0` (intro), `slice=2`, `grit=1` — let the break and kick settle.
2. `mode=1` (groove). On the last bar of a 4-bar phrase — **1** (fill).
3. Hold **2** (roll) for one bar, release; four bars later — **3** (chop).
4. `mode=2` (solo) — drone and noise drop out, drums remain. Only pads here.
5. `mode=3` (return) — bring the bed and the alternate break back.
6. `mode=4` (outro) — peel layers off, leave kick and break for mixing.
7. Change `breakSel` between sections, not inside a phrase: the break must read.

---

## 5. Panel contract (if you add your own controls)

- The `instruments` tree → mixer/Tone. `vol` goes to the left column.
- A top-level `slider(x, 0, max, 1)` → switch buttons.
  Captions come from `// @switches mode=a,b,c`.
- `// @pads padFill,padRoll` marks top-level sliders as momentary: the panel
  excludes them from switches and renders pads instead.
- The pad name is the variable name (`const padFill = slider(0,0,1,1)`).
- In the track a pad must be a gate: `.gain(instrument.vol.mul(padX))`
  and `.filter(audible)` at the end of the track.
- There is no MIDI: mouse and keys 1–4 only.
