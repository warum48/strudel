# 02 · Sequencing and the grid (EN)

Breakcore breaks not through notes but through density, timing and role
distribution.

---

## 1. Functional 16-step grid

The most concrete "theory" in the whole corpus — from `nilsec` `[173927#8]`, derived
from funk (James Brown "Funky Drummer"):

| Element | Positions (1-based, 16 steps) |
|---|---|
| Kick | 1, 4, (7), (10 or 11), 15 |
| Snare | 5, 13 |
| Ghost snare | 7, 10 or 7, 11 |
| Hats | all odd steps, or an evolving Euclidean figure |
| Bass root | 1 |
| Harmony / arpeggio | 4, 7, 9, 11, 15 |
| Avoid | 5 and 13 (snare lives there) |

Rule: "Melody and bass should always enforce the syncopated feel of the drums"
`[173927#8]`. Bass does not "walk the chord"; it supports displacement.

For a simple base: "Impeach the President" as a skeleton to mutate later `[173927#8]`.

---

## 2. Density: a hard limit

- **2–3 simultaneous sounds maximum** `[173927]`.
- "only one thing is ever playing at a time" — sound-lock / single-track approach
  `[173927]`.
- Dense records = **few elements + strong sound design**, not many layers `[173927]`.
- One element per frequency floor: sub / low / low-mid / high-mid / high / air
  `[173927]`.
- "if u got one 16th sequence running prominent already, the last thing u need yet, is
  another 16th sequence on top of it" `[173927]`.
- Trade-off: **timbre complexity and sequencing complexity are inversely
  proportional** — IDM = complex sequencing + simple timbre; dubstep = simple rhythm +
  complex timbre `[173927]`.

Practice: if you want to add a layer, remove an existing one first.

---

## 3. Different speeds for different groups

- Pad: 4–8 bars.
- Bass: 2–4 bars.
- Drums: hyperspeed on top `[173927]`.
- Panorama: pan similar mid-heavy parts to the sides, keep bass centered `[173927]`.

This gives "polyrhythm without polyrhythm": layers do not share the same cycle length.

---

## 4. Polyrhythm and odd meters

| Technique | How | Source |
|---|---|---|
| 3 against 5 | kick every 3, snare every 5 → resolves after 15 beats | `[173927]` |
| 5/8 | the basis of Dolly Zoom's "Spasmodic" EP | `[78570#1]` |
| 13/8 | "resulting 13-8 break 90 bpm" | `[6643#24]` |
| 8/5 and 11/6 | over a melody in 4/4 | `[6643#33]` |
| Cross-rhythm 3/4 vs 4/4 | simpler than polyrhythm; "polyrhythms are really hard to compose digitally" | `[6643#47]` |
| Meter change inside a track | instead of straight 4/4 all the way | `[6643#23]` |
| Different pattern lengths | song mode: patterns of different lengths + mute positions + BPM variations | `[173927]` |

**An anchor is mandatory:** "keep an anchor — 1/8 hat or snare on 5 and 13 … The key
is controlled chaos" `[173927]`.

**Meter is not the goal:** "breakcore can be 4/4 if you want. The focus is on the
break, not the rhythm it's played at" `[6643#49]`.

**High tempo:** write the other elements "as if it was in half time" `[6643#47]`.

---

## 5. Groove and humanization

- **Staccato is the norm:** "Everything sounds super staccato in IDM except the pads
  and some of the leads" `[173927]`.
- "stiffness and staccato are key … Too much sustain and looseness will result in a
  mess quickly. Keep it tight" `[173927]`.
- Build your own swing: add a tiny silence at the sample start rather than nudging
  notes `[173927]`.
- Modulate **sample start** instead of pressing notes — same effect, more alive
  `[173927]`.
- At high tempo **reduce** swing rather than increasing it: that is what drummers do
  `[226901]`.
- If the break is rigidly quantized, add swing on a separate track `[226901]`.
- Heavy groove lives on the even 16ths; in a tracker that means manual micro-timing
  `[173927]`.

---

## 6. Probability and randomness: strictly dosed

Thread consensus:
- "stay way from randomizers !!!" `[173927]`.
- "Nothing should be random. That's the 'Intelligent' part of IDM" `[173927]`.
- Randomness is allowed only on **parameters**, not on pitch and not on triggers
  `[173927]`.
- S&H LFO on hat decay — useful; random pitch on a lead — chaos `[173927]`.

Working schemes:
| Scheme | Parameters | Source |
|---|---|---|
| "2 of 4" | trigger conditions instead of percentages | `[173927]` |
| Chance fills | chance 50–60 %, then ramp to 100 % | `[173927]` |
| Conditional ratchet | fires only if the previous trig did not | `[173927]` |
| LFO on sample slot | sine with odd timing = perpetual variation | `[173927]` |
| `maYbe` + phrases | sample overlap + phrases with `maYbe`, phrases triggered randomly | `[68093#3]` |
| "Render 5 times" | probability on everything, 5 different takes, pick one | `[2328#10]` |

---

## 7. Generativity as a tool, not an author

- Autechre: **their own Max patches with hard constraints**, not off-the-shelf
  randomizers; plus dense music on Machinedrum/R8/Logic `[173927]`.
- BBCut (SuperCollider, Nick Collins) — automated break cutting `[5102#10]`.
- Tidal Cycles: `every 4 (rev)`, `density 4`, `*2`, `rev`, `brak`,
  `[sn/2 sn/4 bd8 bd]8` `[5102#10]`.
- Conductive (Renick Bell) — Haskell libraries over an SC engine `[5102#12]`.
- Warning: "fractal/generative beats need fine control or they become abstruse"
  `[5102#19]`.

**Rule:** the generator invents **variations of what is already written**, not the
form.

---

## 8. Repetition and "legitimacy"

- "Repetition legitimizes" `[173927]` — a complex pattern only reads after repetition.
- Give a simple anchor first (kick/snare/hat), then break it `[173927]`.
- Contrast "simple → complex" matters more than absolute complexity `[6643#7, #48]`.
- Silence is a full compositional element `[173927]`.

---

## 9. Tracker vs x0x: what you pay

- x0x forces you to listen: "Only 2 or 3 sounds ever should be playing at the same
  time" `[173927]`.
- A tracker makes you look: it is easy to drift into "breakcore" if the groove is not
  in the chopped drums themselves `[173927]`.
- Putting all drum hits on one track with minimal overlap helps a tracker sound like an
  instrument rather than a piano roll `[173927]`.

**Conclusion:** write in the tracker, check with your ears and no screen.
