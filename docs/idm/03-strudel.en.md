# 03 · IDM in Strudel 1.2.6

How the techniques map to real Strudel functions, verified in
`tracks/idm/01-splinter.js`, plus the pitfalls.

---

## 1. Granular: `chop`, `striate`, `slice`, `splice`

| Function | What it does | When to use |
|---|---|---|
| `chop(n)` | cuts one event into n pieces, plays in order | cloud from one long sample |
| `striate(n)` | spreads n pieces across n events | rhythmic grains |
| `slice(n, idx)` | selects pieces by index | micro-montage, splinters |
| `splice(n, idx)` | inserts a piece into a step, fitting speed | rhythmic insertions |

Example from the track:

```js
$: s("padlong")
  .begin(grain.cloud.scan)
  .end(grain.cloud.scan.add(grain.cloud.window))
  .chop(grain.cloud.chop)
  .speed(grain.cloud.speed.mul(semis(grain.cloud.pitch)))
  .fast(grain.cloud.density)
  .gain(grain.cloud.vol.mul(gCloud).mul(grainOn))
  .lpf(grain.cloud.cut).hpf(grain.cloud.hpf).lpq(1)
  .pan(rand.mul(grain.cloud.spread).sub(grain.cloud.spread.mul(0.5)))
  .delay(grain.cloud.delay.mul(fx.delay.send))
  .delaytime(fx.delay.time)
  .delayfeedback(fx.delay.feedback)
  .degradeBy(grain.cloud.prob.fmap((p) => 1 - p))
  .filter(audible)
```

Order matters: `begin/end` set the window, `chop` cuts that window,
`fast` sets density, `pan(rand)` scatters grains.

### Granular knobs

| Knob | What it does |
|---|---|
| `chop` | number of grains (4–64) |
| `scan` | window position in the sample |
| `window` | window length |
| `speed` | grain speed/pitch |
| `pitch` | transposition in semitones, −24…+12 (up to two octaves down) |
| `grainSrc` | source: auto moves the `padlong/space/wind/noise2` bank every 4 bars |
| `density` | how many times the cloud repeats per bar |
| `spread` | pan width |
| `prob` | grain survival probability |

---

## 2. Glitch: `slice` + `degradeBy`

```js
$: s("glitch").n("0 1 0 2 1 0 3 0")
  .slice(grain.edit.slice, "0 3 7 1 15 2 8 4")
  .speed(grain.edit.speed.mul(rand.range(0.7, 1.3)))
  .gain(grain.edit.vol.mul(gEdit).mul(grainOn))
  .degradeBy(grain.edit.prob.fmap((p) => 1 - p))
  .filter(audible)
```

`slice(16, "0 3 7 …")` yields 8 events per bar; each is a different
piece. `degradeBy` removes some, but remember: it always drops the first
hit at t=0.

---

## 3. 8-bit: `pulse`, `square`, `crush`, `arp`

```js
$: note(ARP_CHORDS)
  .arp(run(bits.arp.rate))
  .s("square").pw(bits.arp.pw)
  .crush(crushAmt)
  .gain(bits.arp.vol.mul(leadOn))
  .lpf(bits.arp.cut).hpf(500)
  .decay(bits.arp.decay).sustain(0)
  .filter(audible)
```

- `pulse` + `pw` — duty cycle (0.1–0.9).
- `square` — harder, no width.
- `arp(run(n))` — n notes per bar from a chord; 8/16/32.
- `crush(16)` — almost clean, `crush(2)` — nasty; a worklet per event.

---

## 4. Acid: `glide` + `lpenv`

`glide` is the register from `09-dark-acid-v2.js`, not `.slide()`. It
computes which note we are coming from and writes a pitch envelope.

```js
$: note(ACID)
  .slow(acid.line.pace)
  .s("sawtooth")
  .lpf(acid.line.cut).lpq(acid.line.res).ftype("ladder").drive(acid.line.drive)
  .lpenv(acid.line.env)
  .lpa(0.002).lpd(acid.line.decay).lpsustain(0.12)
  .glide(acid.line.glide.mul("0 0 1 0 0 1 0 0 0 0 1 0 0 0 0 0"))
  .decay(acid.line.decay).sustain(0.2).release(0.03)
  .filter(audible)
```

The glide gate is **without angle brackets**. `<0 0 1 …>` is
alternation, one element per cycle; the gate becomes a constant.

---

## 5. Bass: `shape` before `gain`

In superdough the order is fixed: `shape/distort` → … → `gain`. So
"drive up, volume down" is literal:

```js
$: note(GROWL)
  .s("sawtooth").unison(2).detune(bass.growl.det)
  .slide(bass.growl.slide)
  .gain(bass.growl.vol)
  .lpf(bass.growl.cut).lpq(bass.growl.q).ftype("24db")
  .lpdepth(bass.growl.lfo).lpsync(bass.growl.sync)
  .shape(bass.growl.grit)
  .filter(audible)
```

`shape` is a worklet. Keep it on sparse layers.

---

## 6. Harmony latch: `seg`

```js
const harmony = slider(0, 0, 1, 1)
const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))
```

Move the slider on bar 4; the sound changes on bar 8. `latch` checks it.

---

## 7. Arrangement: scenes and gates

```js
const scene = slider(2, 0, 4, 1)
const drumsOn = scene.fmap((v) => (v === 1 || v === 2 || v === 4 ? 1 : 0))
const bassOn = scene.fmap((v) => (v === 1 || v === 2 || v === 4 ? 1 : 0))
const acidOn = scene.fmap((v) => (v === 2 ? 1 : 0))
const leadOn = scene.fmap((v) => (v === 2 || v === 3 ? 1 : 0))
```

Every track multiplies `gain` by its gate. Cheaper and more reliable
than `mask`.

---

## 8. Pads: momentary contract

```js
// @pads padRoll,padCut,padFreeze,padBurst,padAcid,padDrop
const padRoll = slider(0, 0, 1, 1)

$: s("glitch").n("0 1 2 0 1 3")
  .fast(32)
  .gain(drums.roll.vol.mul(padRoll))
  .filter(audible)
```

The panel writes 1 on `pointerdown`/key and 0 on release. In the track
the pad must be a gate; otherwise it sticks or plays forever. Keys 1–9;
this track uses 6.

---

## 9. Rhythm mutation

`mutate` does not replace the groove; it decides which ghosts survive.
`degradeBy(1 - mutate)` on a 16-step grid is the cheapest way:

```js
$: s("sd").struct("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~")
  .degradeBy(mutate.fmap((p) => 1 - p))
  .gain(drums.ghost.vol.mul(drumsOn))
  .filter(audible)
```

`fill` is a deterministic 32nd roll on the last beat:

```js
$: s("sd*32")
  .struct("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x x x x x x x x")
  .gain(drums.fill.vol.mul(fill).mul(drumsOn))
  .filter(audible)
```

Both layers multiply a `vol` slider, so `gains` silences them at zero.

## 10. CPU budget

A worklet is `shape`, `crush`, `coarse`, `distort`, `ftype("ladder")`.
In `01-splinter`:

- `drums.kick.shape` — 1–4 events/bar;
- `bass.growl.shape` — 2–3;
- `acid.line.ftype("ladder")` — 1–2;
- `bits.lead/arp/noise.crush` — 2+12+1;
- `drums.burst.crush` — pad only.

Total: 25–28 worklets/bar = 14–16/s. Reference: up to 150/s is safe.

**Rule.** Do not put a worklet on hats, rolls or the cloud. The cloud is
`chop`/`slice`, not `crush`.

---

## 10. Project pitfalls

- `degradeBy`/`sometimesBy` drop the t=0 event.
- `every(n, f)` fires on bar zero; use `lastOf(n, f)` for "on the last".
- `stut`/`echo` overwrite `gain`; use `echoWith` with your own `withValue`.
- `slider()` accepts a numeric literal only.
- A mini-notation string in a variable needs an explicit `m()`.
- `vowel` only works as a mini-string, not `m(...)`.
- `phrase([...])`: each bar in brackets `[...]`.
- `penv`: `panchor(1)` + `penv(4)` = start low and rise; `panchor(0)` +
  `penv(12)` = jump up and fall.
- `transpose` is absent in 1.2.6; use `.add(note(12))`.
- `samples()` is absent in node — call it under
  `typeof samples === 'function'`.

---

## 11. Checks

```bash
npm run verify   -- tracks/idm/01-splinter.js
npm run tension  -- tracks/idm/01-splinter.js
npm run modes    -- tracks/idm/01-splinter.js
npm run latch    -- tracks/idm/01-splinter.js
npm run gains    -- tracks/idm/01-splinter.js
npm run doubles  -- tracks/idm/01-splinter.js
npm run cpu      -- tracks/idm/01-splinter.js
npm run live     -- tracks/idm/01-splinter.js
```

`verify` and `gains` without an argument check all tracks.
