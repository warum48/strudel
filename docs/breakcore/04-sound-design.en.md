# 04 · Sound and processing (EN)

Processing is not decoration — it is how chopping becomes readable. It is also what
most often kills the track.

---

## 1. Basic break chain

An order that recurs across posters:

```
chop → EQ (cut lows) → filter → distortion / bit-crush → compression → limiter
```

- "EQ, filtering, compression" as the core `[173927]`.
- Remove almost all low end from chopped breaks or it is "muddy garbage" `[173927]`.
- Panning for width `[173927]`.
- Put distortion **after** the filter if you want control over what gets distorted:
  EQ before the amp lets you choose which frequencies distort (the principle is
  confirmed by DNB Academy, `[002-jungle]`).

**Order in this repo:** `hpf → lpf → crush → shape → room` — that is how breaks are
built in `tracks/dnb/02-dark-techstep-v2.js` (see `08-strudel.en.md`).

---

## 2. Distortion

- Baseline: the DAW's internal distortion + compressor + limiter + EQ `[17702#3]`.
- "Low-fi" filters provide an 8-bit-sounding distortion `[17702#3]`.
- Plugins actually named:
  - **Cyanide / Cyanide 2** — "crunchy", "demented evil things to vocal samples"
    `[17702#4, #8]`;
  - **MDA Overdrive** `[17702#6]`;
  - **Lost Technology** — splits the input into amplitude/frequency/waveform
    sub-signals, modulators recombine them `[17702#2]`;
  - **Camel Audio**, **H2O** (limiter/compressor) `[17702#5, #7]`;
  - **dblue Glitch** + bitcrusher on the master `[18985#51]`.
- Placement: per element or on a shared bus is left open `[17702#1]`; the practice is
  "distortion for everything, filtering, compressing, mastering" `[44354]`.
- **Counter-claim:** "breakcore is more about how you chop and mangle your beats than
  anything? There's alot of heavy breakcore that uses clean beats" `[17702#3]`.

> A warning-joke from the thread that became a meme: "remember: distortion is a
> substitute for talent" `[18985]`.

**Rule:** distortion must reinforce the attack, not replace it. If a hit stops
reading after distortion, there is too much of it.

---

## 3. Bit-crush and sample-rate reduction

- Octatrack **LoFi**: sample-rate reduction, bit-depth reduction, distortion and
  amplitude modulation (fade → tremolo → ring-mod) `[173811]`.
- `amenbreak` (norns): "punch" = overdrive / decimate / degrade `[60185]`.
- In Strudel: `.crush()` and `.shape()` — see `08-strudel.en.md`.

**Where to apply:** on individual hits, not the whole break — "Use them on single
hits, not all over the place" `[173927]` (about short delays, comb and bit reducer).

---

## 4. Filters as a rhythm instrument

- "you can pick up a whole different groove with some good timed filtering and build
  something new from there" `[18985#46]`.
- Bass can be made by "going apeshit with filtering and pitchshifting to get that
  wobble, which sounds nothing like a melody, but does" `[18985#46]`.
- A comb filter adds a metallic overtone and harmonics `[173811]`.
- A resonant filter can ping/ring — use it deliberately `[173811]`.
- Comb/ring-mod/distortion — "after I've exhausted everything else" `[34022#13]`.
- A one-word answer to "how to make it glitch": "-ringmodulator-" `[34022#12]`.

---

## 5. Chorus glitch (a cheap trick with no plugins)

> "Set up a Chorus effect and turn it on and off and play with the delay … quickly
> setting … a semi long delay with a high feedback and then shrinking the delay —
> get's a very glitchy sound without hardly any work" `[18985#37]`.

Same family: a short delay with high feedback, changing rapidly over time. In Strudel
— `.delay()` + `.delaytime()` + `.delayfeedback()` with a pattern on `delaytime`.

---

## 6. Compression and sidechain

- Autechre: heavy **inter-track** sidechain compression, possibly baked into sequence
  generation before mixing `[173927]`.
- Sidechain the break to the kick so the kick reads instead of fighting `[173927]`.
- `[8682#1]` — "slight sidechain to the ghost drum" as an example of a working scheme.
- A limiter is part of the classic chopped-break sound `[237663]`.

**Careful:** at high tempo compression eats attack faster than at 120. Note-off first,
compressor second.

---

## 7. Resampling (the main workflow)

1. Render one hit with commands → a new sample `[34022#10]`.
2. Add a second layer → render again. "You can do this for ever" `[34022#10]`.
3. Cut lows/EQ before rendering so the sample stays clean `[34022#10]`.
4. FX in the sample editor are destructive, writing a new variation `[34022#5]`.
5. Build heavy breaks in a separate project and import the WAV `[18985#49]`.
6. After rendering, `09xx` gives new unpredictable positions `[29927#13]`.

---

## 8. Mix and master

- EQ and limit sources, use a spectrum analyzer, remove over-represented bands
  `[173927]`.
- Early Warp/DnB records often ran on 8 channels — density is not quality `[173927]`.
- Four Tet as an example: "deliberately carves each sound's frequency space"; that
  album was not mixed or mastered externally `[173927]`.
- Cut the low end of chopped breaks; leave it to the kick and sub `[173927]`.
- Check for "emptiness": if everything is dense at low volume, remove a layer.

---

## 9. Ready-made chains

### C1 · Rinse-clean (mono, readability)
`note-off → HPF 100–200 → LPF to taste → light crush → compressor 2:1 → limiter`

### C2 · Stems-dirty (aggression)
`kick: LPF 80–120 + shape` · `snare: HPF 200 + crush + short room` ·
`hat: HPF 4–6k + pan` · `sum: distortion + limiter`

### C3 · Offset-jungle (liveliness)
`09xx hits → shared EQ → light sidechain to kick → short delay on snare (1/16,
feedback 20–30 %) → room 8–12 %`

### C4 · Gabber accent
`gabber kick (hardcore:4) → LPF 80 → shape 0.5–0.8 → duck under the main kick`

---

## 10. Frequency hygiene (minimum)

| Element | HPF | LPF | Note |
|---|---|---|---|
| Chopped break | 100–200 | 8–12k | remove almost all low end `[173927]` |
| Kick | — | 80–120 | "deaf" by default (repo rules) |
| Snare | 150–300 | 10k | short room, not long |
| Hat | 4–6k | 16k | pan to taste |
| Sub | — | 80–100 | mono, sidechained to kick |
| Noise/texture | 2k | 12–16k | must not compete with the kick |

---

## 11. What not to do

- Do not put a long reverb on the whole break — attack disappears.
- Do not distort the master until transients are gone.
- Do not bit-crush everything at once: "on single hits, not all over the place"
  `[173927]`.
- Do not "fix" weak chopping with distortion.
- Do not boost the low end of a chopped break to make it "fat" — fat comes from the
  kick and sub.
