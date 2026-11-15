# 03 · IDM в Strudel 1.2.6

Здесь — как приёмы из `01-techniques` ложатся на реальные функции
Strudel, что уже проверено в `tracks/idm/01-splinter.js`, и где грабли.

---

## 1. Грануляр: `chop`, `striate`, `slice`, `splice`

| Функция | Что делает | Когда использовать |
|---|---|---|
| `chop(n)` | режет событие на n кусков и играет подряд | облако из одного длинного сэмпла |
| `striate(n)` | раскладывает n кусков по n событиям | «расчески» и ритмические зёрна |
| `slice(n, idx)` | выбирает куски по индексам | микро-монтаж, рвань |
| `splice(n, idx)` | вставляет кусок в шаг, подгоняя скорость | ритмичные вставки |

Пример из трека:

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

Порядок важен: `begin/end` задают окно, `chop` режет именно это окно,
`fast` задаёт плотность, `pan(rand)` разбрасывает зёрна.

### Ручки грануляра

| Ручка | Что делает |
|---|---|
| `chop` | число зёрен (4–64) |
| `scan` | позиция окна в сэмпле |
| `window` | длина окна |
| `speed` | скорость/питч зёрен |
| `pitch` | транспозиция в полутонах, −24…+12 (до двух октав вниз) |
| `grainSrc` | источник: auto меняет банк `padlong/space/wind/noise2` раз в 4 такта |
| `density` | сколько раз повторить облако за такт |
| `spread` | ширина панорамы |
| `prob` | вероятность оставить зерно |

---

## 2. Глитч: `slice` + `degradeBy`

```js
$: s("glitch").n("0 1 0 2 1 0 3 0")
  .slice(grain.edit.slice, "0 3 7 1 15 2 8 4")
  .speed(grain.edit.speed.mul(rand.range(0.7, 1.3)))
  .gain(grain.edit.vol.mul(gEdit).mul(grainOn))
  .degradeBy(grain.edit.prob.fmap((p) => 1 - p))
  .filter(audible)
```

`slice(16, "0 3 7 …")` даёт 8 событий в такте; каждый — свой кусок.
`degradeBy` убирает часть, но помни: первый удар в t=0 он выбрасывает
всегда.

---

## 3. 8 бит: `pulse`, `square`, `crush`, `arp`

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
- `square` — жёстче, без ширины.
- `arp(run(n))` — n нот на такт из аккорда; 8/16/32.
- `crush(16)` — почти чисто, `crush(2)` — злой; это worklet на событие.

---

## 4. Эйсид: `glide` + `lpenv`

`glide` — регистр из `09-dark-acid-v2.js`, не `.slide()`. Он считает,
от какой ноты едем, и ставит питч-огибающую.

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

Гейт glide — **без угловых скобок**. `<0 0 1 …>` — альтернация, один
элемент на цикл; гейт станет константой.

---

## 5. Бас: `shape` до `gain`

В superdough порядок фиксирован: `shape/distort` → … → `gain`. Поэтому
«драйв вверх, громкость вниз» делается буквально:

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

`shape` здесь — worklet. Держи его на слоях с малым числом событий.

---

## 6. Защёлки гармонии: `seg`

```js
const harmony = slider(0, 0, 1, 1)
const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))
```

Слайдер двигается на 4-м такте, звук меняется на 8-м. `latch` это
проверяет.

---

## 7. Аранжировка: сцены и гейты

```js
const scene = slider(2, 0, 4, 1)
const drumsOn = scene.fmap((v) => (v === 1 || v === 2 || v === 4 ? 1 : 0))
const bassOn = scene.fmap((v) => (v === 1 || v === 2 || v === 4 ? 1 : 0))
const acidOn = scene.fmap((v) => (v === 2 ? 1 : 0))
const leadOn = scene.fmap((v) => (v === 2 || v === 3 ? 1 : 0))
```

Каждая дорожка умножает `gain` на свой гейт. Это дешевле и надёжнее,
чем `mask`.

---

## 8. Пэды: momentary-контракт

```js
// @pads padRoll,padCut,padFreeze,padBurst,padAcid,padDrop
const padRoll = slider(0, 0, 1, 1)

$: s("glitch").n("0 1 2 0 1 3")
  .fast(32)
  .gain(drums.roll.vol.mul(padRoll))
  .filter(audible)
```

Панель пишет 1 на `pointerdown`/клавишу и 0 на отпускание. В треке пэд
обязан быть гейтом; иначе он «залипнет» или будет играть всегда.
Клавиши 1–9; в треке 6 пэдов.

---

## 9. Мутация ритма

`mutate` не заменяет грув, а решает, какие призраки останутся.
`degradeBy(1 - mutate)` на 16-й сетке — самый дешёвый способ:

```js
$: s("sd").struct("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~")
  .degradeBy(mutate.fmap((p) => 1 - p))
  .gain(drums.ghost.vol.mul(drumsOn))
  .filter(audible)
```

`fill` — детерминированный 32-й ролл на последнюю долю:

```js
$: s("sd*32")
  .struct("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x x x x x x x x")
  .gain(drums.fill.vol.mul(fill).mul(drumsOn))
  .filter(audible)
```

Оба слоя умножены на `vol`-слайдер, поэтому `gains` глушит их в ноль.

## 10. Бюджет CPU

Worklet — это `shape`, `crush`, `coarse`, `distort`, `ftype("ladder")`.
В `01-splinter`:

- `drums.kick.shape` — 1–4 события/такт;
- `bass.growl.shape` — 2–3;
- `acid.line.ftype("ladder")` — 1–2;
- `bits.lead/arp/noise.crush` — 2+12+1;
- `drums.burst.crush` — только на пэде.

Итог: 25–28 worklet/такт = 14–16/с. Ориентир: до 150/с живёт спокойно.

**Правило.** Не вешай worklet на хэты, роллы и облако. Облако — это
`chop`/`slice`, а не `crush`.

---

## 10. Грабли проекта

- `degradeBy`/`sometimesBy` выбрасывают событие в t=0.
- `every(n, f)` срабатывает на нулевом такте; для «на последнем» —
  `lastOf(n, f)`.
- `stut`/`echo` затирают `gain`; используй `echoWith` со своим `withValue`.
- `slider()` принимает только числовой литерал.
- Строка мини-нотации в переменной требует явного `m()`.
- `vowel` — только mini-строкой, не `m(...)`.
- `phrase([...])`: каждый такт — в скобках `[...]`.
- `penv`: `panchor(1)` + `penv(4)` = старт ниже и подъём; `panchor(0)` +
  `penv(12)` = прыжок вверх и спуск.
- `transpose` в 1.2.6 нет; транспонируй `.add(note(12))`.
- `samples()` в node нет — вызывай под `typeof samples === 'function'`.

---

## 11. Проверки

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

`verify` и `gains` — без аргументов проверяют все треки.
