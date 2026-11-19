# Complex Bass в Strudel

## 1. Вейвтейблы

```js
samples('bubo:waveforms')
$: note('d1').s('wt_dbass')
  .wt(sine.range(0,1).fast(0.3).mul(0.3).add(0.3))
  .warp(0.45)
```

- `wt_` = wavetable; `wt` сканирует позицию 0…1.
- `warp` / `warpdepth` / `warpenv` — folding-подобное искажение.
- Тёмные таблицы: `wt_dbass`, `wt_distorted`, `wt_ebass`, `wt_raw`,
  `wt_bitreduced`. Без flute/birds/vgame.

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

- `fm` — индекс, `fmh` — ratio; `fmN`/`fmhN` — до 8 операторов.
- `fm13` роутит FM1 в FM3 (матрица).
- Модулятор может быть сигналом: `.fm3(saw.mul(8).slow(8))`.

## 3. Парная модуляция

```js
const lfo = sine.range(0,1).fast(0.5)
$: note('d1').s('wt_raw')
  .wt(lfo.mul(0.3).add(0.35))
  .duckorbit(5).duckdepth(0.5).duckattack(0.01)
$: note('d1').s('triangle')
  .fm(4 + lfo * 3).orbit(5)
```

`duckorbit(n)` — амплитудный дакинг указанной орбиты источником сигнала.
В треке бочка дакает орбиту 7, где живут все 10 басов: это честный
сайдчейн, а не LFO. Источник должен быть на другой орбите.

## 4. Ползунки и режимы

```js
const mode = slider(1, 0, 3, 1)
const grit = mode.pick([0.1,0.3,0.55,0.8])
const fmMode = mode.pick([0.6,1,1.4,1.8])
```

`mode` не выключает осцилляторы — меняет глубину shaping/FM и air.

## 5. Грабли

- **Двойные кавычки** в JS-коде: транспайлер strudel.cc падает
  (`Unexpected string`). В треке всё в одинарных.
- **Вейвтейбл — сэмпл**, не WebAudio-осциллятор: аудио-рейт FM между
  слоями невозможен. FM — внутри synth-голоса.
- `fx` в дереве должен быть `fx.dub.*` (3 уровня), иначе панель не
  покажет параметры.
- `shape` — worklet на событие; 10 слоёв дают 112 worklet/такт (75/с).
  Это нормально, но не добавляй `shape` ещё на 20 слоёв.
- `samples('bubo:waveforms')` грузит таблицы лениво; первый удар может
  ждать загрузку.
- Ширина слайдеров и sync-блок обязательны, иначе live-баг strudel.cc
  показывает рассинхрон ползунка.
