# Complex Bass in Strudel

## 1. Wavetables

```js
samples('bubo:waveforms')
$: note('d1').s('wt_dbass')
  .wt(sine.range(0,1).fast(0.3).mul(0.3).add(0.3))
  .warp(0.45)
```

- `wt_` = wavetable; `wt` scans position 0…1.
- `warp` / `warpdepth` / `warpenv` — folding-like distortion.
- Dark tables: `wt_dbass`, `wt_distorted`, `wt_ebass`, `wt_raw`,
  `wt_bitreduced`. No flute/birds/vgame.

## 2. FM / complex oscillator

```js
$: note('d1').s('sawtooth')
  .fm(fm.fm2.index.add(lfo2.mul(fm.fm2.indexMod)))
  .fmh(fm.fm2.ratio)
  .lpf(900).lpq(8).ftype('24db')
  .shape(0.5)
  .slide(0.12)
  .orbit(3)
```

- `fm` is index, `fmh` is ratio; `fmN`/`fmhN` support up to 8 operators.
- `fm13` routes FM1 into FM3 (matrix).
- A modulator can be a signal: `.fm3(saw.mul(8).slow(8))`.

## 3. Paired modulation

```js
const lfo = sine.range(0,1).fast(0.5)
$: note('d1').s('wt_raw')
  .wt(lfo.mul(0.3).add(0.35))
  .duckorbit(5).duckdepth(0.5).duckattack(0.01)
$: note('d1').s('triangle')
  .fm(4 + lfo * 3).orbit(5)
```

`duckorbit(n)` amplitude-ducks the given orbit from the source signal.
In the track the kick ducks orbit 7 where all 10 basses live: real sidechain,
not an LFO. The source must sit on a different orbit.

## 4. Sliders and modes

```js
const mode = slider(1, 0, 3, 1)
const grit = mode.pick([0.1,0.3,0.55,0.8])
const fmMode = mode.pick([0.6,1,1.4,1.8])
```

`mode` never removes oscillators — it changes shaping/FM depth and air.

## 5. Gotchas

- **Double quotes** in JS code crash the strudel.cc transpiler
  (`Unexpected string`). The track uses single quotes only.
- **A wavetable is a sample**, not a WebAudio oscillator: cross-layer
  audio-rate FM is not possible. FM lives inside the synth voice.
- `fx` must be `fx.dub.*` (3 levels) or the panel will not show the params.
- `shape` is a worklet per event; 10 layers give 112 worklets/bar (75/s).
  That is fine, but do not add `shape` to 20 more layers.
- `samples('bubo:waveforms')` loads lazily; the first hit may wait.
- Slider width + sync block is required, otherwise the known strudel.cc
  live bug shows a desynced thumb.
