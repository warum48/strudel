# Psytrance — Strudel recipes

Рабочие куски для full-on psytrance. Всё — нативные Strudel-функции:
`m(...)`, `struct`, `lpf/lpq/lpenv`, `duckorbit`, `delay`, `room`.
Слайдеры — только неотрицательные литералы.

## 0. Значения, которые работают в Strudel

- `lpf` — Гц (0–20000), `lpq` — Q (0–50), `lpenv` — октавы.
- Q 12–15 — это крик; для музыкального фильтра 0–4.
- Acid = **низкий base** (80–200 Гц) + **глубокий envelope** (3–5 октав),
  а не высокий base + мелкий envelope.
- `roomsize` — 0–10 (не 16). `room` — 0–1. `delaytime` — секунды.

## 1. Бочка + роллинг-бас + саб

```js
const bassPat = m('~ x x x ~ x x x ~ x x x ~ x x x')

// бочка: короткая, с кликом, дакает orbit 2
$: s('bd').struct(m('x*4'))
  .gain(kickVol.mul(tlOr('kick')))
  .lpf(180).lpq(1).shape(0.4)
  .decay(0.10).sustain(0).release(0.01)
  .duckorbit(2).duckdepth(duck).duckattack(0.01)
  .mask(gateOf('kick')).filter(audible)

// top-бас: пила, LP + filter-envelope, нота умирает до следующей
$: note(m('f#1')).struct(bassPat)
  .s('sawtooth').unison(1)
  .gain(bassVol.mul(tlOr('bass')))
  .lpf(bassCut).lpq(2).ftype('24db')
  .lpenv(3).lpa(0.002).lpd(0.05).lpsustain(0)
  .decay(0.05).sustain(0).release(0.02)
  .distort(1.2).clip(0.9)
  .orbit(2)
  .mask(gateOf('bass')).filter(audible)

// sub: тот же рисунок, sine, только корень
$: note(m('f#1')).struct(bassPat)
  .s('sine')
  .gain(subVol.mul(tlOr('sub')))
  .lpf(42)
  .decay(0.08).sustain(0).release(0.02)
  .orbit(2)
  .mask(gateOf('sub')).filter(audible)
```

Правила: 12 нот на такт, все одинаковые; `sustain 0`; top и sub — разные
дорожки; кик дакает orbit 2.

## 2. Открытый хэт на оффбит

```js
$: s('oh').struct(m('~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~'))
  .gain(ohVol.mul(tlOr('oh')))
  .lpf(7000).hpf(400)
  .decay(0.18).sustain(0)
  .room(verb.mul(0.35)).roomsize(fx.reverb.size)
  .mask(gateOf('oh')).filter(audible)
```

Позиция `~ ~ x ~` — третья 16-я каждой четверти, то есть «и». Это и есть
оффбит-драйв.

## 3. 303-линия

```js
$: note(m('f#2 ~ f#2 ~ g2 ~ f#2 a#2 ~ f#2 ~ g2 f#2 ~ a#2 ~'))
  .s('sawtooth').unison(1)
  .gain(acidVol.mul(tlOr('acid')))
  .lpf(acidCut.mul(autoAt('keys.acid.cut'))).lpq(4).ftype('ladder')
  .lpenv(4.5).lpa(0.002).lpd(0.055).lpsustain(0.05)
  .decay(0.055).sustain(0.1).release(0.03)
  .delay(0.17).delaytime(0.375).delayfeedback(0.45)
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .mask(gateOf('acid')).filter(audible)
```

Одна-две ноты из лада, повтор, фильтр ползёт. Это не «обыгрывание
аккордов» — это ритмический рифф. Низкий base + глубокий ladder-envelope —
это и есть ход 303; высокий base с Q 15 превращает его в крик.

## Повторяющийся dark-trance acid-остинато

Не прыгай по разным нотам. Ритмично повторяй одну и ту же ноту, а краску давай
**интервалами**: малая секунда (m2) и малая терция (m3).

```js
$: note(m('f#3 f#3 f#3 g3 f#3 f#3 f#3 f#3 f#3 f#3 f#3 a3 f#3 f#3 f#3 f#3'))
  // 16-й пульс: 14 × F#, одна m2 (G), одна m3 (A), без прыжков
  .distort('2.2:.3').s('sawtooth')
  .lpf(cut.mul(sine.range(0.7, 1.8).slow(16)))
  .lpenv(2.256).lpq(12)
```

F# — пульс; G — m2, A — m3; ритм повторяется каждый такт. Больше нот — ок,
если это одна и та же нота; вариацию даёт фильтр/LFO. Myloops: повторяй хук и
меняй одну ноту; Theory Helper: паттерн на 1–2 ноты с ритмичной огибающей
фильтра; Attack: acid-остинато из корня + интервала. Рифф делает движение
фильтра.

### Второй рифф: синкопированный gallop

Более ритмичный, менее арпеджированный ответ для лифта/дропа:

```js
$: note(m('f#3 f#3 ~ f#3 g3 ~ f#3 f#3 ~ f#3 a3 ~ f#3 f#3 ~ f#3'))
  // та же цепочка switchangel_acid; используй в LIFT/дропах
```

Ритм — главное: две 16-е, пауза, повтор; m2/m3 — только акценты. В лифте
выключи широкий арп-слой, чтобы вела эта линия.

### m6 вместо m3 (редкая краска)

```js
const pulseA = note(m('f#3 f#3 f#3 g3 f#3 f#3 f#3 f#3 f#3 f#3 f#3 a3 f#3 f#3 f#3 f#3'))
const pulseD = note(m('f#3 f#3 f#3 g3 f#3 f#3 f#3 f#3 f#3 f#3 f#3 d4 f#3 f#3 f#3 f#3'))
m('<0 0 0 1>').pick([pulseA, pulseD])  // m3 три такта, m6 на четвёртый
```

### Мелодия BREAK: в 4 раза длиннее, четыре 4-тактовых куска

Начни с 1-тактового мотива; кусок — это мотив ×4. В 16-тактовом брейке
четыре куска: база / вариация / база / низкая вариация.

```js
const baseBar = note(m('f#5 ~ a5 ~ c#6 ~ a5 ~ f#5 ~ g#5 ~ a5 ~ g#5 ~'))
const var2Bar = note(m('g5 ~ a5 ~ d#6 ~ a5 ~ f#5 ~ g#5 ~ a5 ~ g#5 ~'))
const var4Bar = note(m('e5 ~ a5 ~ b5 ~ a5 ~ f#5 ~ g#5 ~ a5 ~ g#5 ~'))
const pluckBreak = arrange(
  [4, baseBar],
  [1, var2Bar], [3, baseBar],  // кусок 2: первая +1, третья +2
  [4, baseBar],                // кусок 3: повтор первого
  [1, var4Bar], [3, baseBar],  // кусок 4: первая/третья -2
)
```

### Разреженная мелодия LIFT (в духе Faithless)

Те же ноты, но группы из 1 и 3 с паузами; дилей/реверб заполняют дыры.
Для разреженных нот чуть длиннее release и небольшая компенсация громкости.

```js
const pluckLift = note(m('<[f#5 ~ ~ ~ ~ ~ ~ ~ a5 c#6 a5 ~ ~ ~ ~ ~]
  [~ ~ ~ ~ f#5 ~ ~ ~ ~ ~ a5 ~ ~ ~ f#5 ~]
  [c#6 ~ a5 ~ f#5 ~ ~ ~ ~ ~ ~ ~ a5 ~ ~ ~]
  [~ ~ ~ ~ ~ ~ g#5 ~ a5 ~ c#6 ~ ~ ~ ~ ~]>'))
```

Такт 1: одна нота, потом группа из 3. Такт 2: одна, потом две. Такт 3:
три, потом одна. Такт 4: группа из 3. Разреженно и запоминается, не арп.

## 4. Psy lead с рандомным bandpass

```js
$: note(m('<[f#3 ~ a#3 ~ c#4 ~ a#3 ~] [g3 ~ a#3 ~ f#3 ~ g3 ~]>'))
  .s('sawtooth').unison(2).detune(0.08)
  .gain(leadVol.mul(tlOr('lead')))
  .lpf(leadCut.mul(perlin.slow(8).range(0.8, 1.2))).lpq(2)
  .lpenv(2).lpa(0.003).lpd(0.12).lpsustain(0.1)
  .decay(0.12).sustain(0.2).release(0.15)
  .delay(0.4).delaytime(0.375).delayfeedback(0.5)
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .mask(gateOf('lead')).filter(audible)
```

`rand.range(...)` на срезе — дешёвый аналог Sample&Hold: каждый ивент
получает своё значение. Не ставь это на 16-е баса — только на редкие
лид-ноты.

## 5. FM-сквелч

```js
$: note(m('~ ~ f#4 ~ ~ g4 ~ ~ ~ a#4 ~ ~ ~ g4 ~ ~'))
  .s('sine').fmi(4).fmh(2.01)
  .gain(squelchVol.mul(tlOr('squelch')))
  .bpf(1240).bpq(3.5)
  .attack(0.001).decay(0.06).sustain(0).release(0.02)
  .delay(0.3).delaytime(0.375).delayfeedback(0.4)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .pan(rand.range(0.3, 0.7))
  .mask(gateOf('squelch')).filter(audible)
```

2–4 сквелча на такт, не на даунбит.

## Psy FX вставки (элементы полёта)

Короткие разреженные синтовые вставки в пустотах. **Fat low** — исключение:
это слой, играет с интро, бьёт каждые 4 такта: три удара A1, затем A0. Laser/bubble/crunch — редкие
(1 такт из 8/16), в панораме и с дилеем; не стакай их в дропах.

```js
// fat low: A1 с интро, одна нота каждые 4 такта; три удара A1, затем A0.
// cutoff 1800–2400 (LFO 4 такта), resonance 14–24 (LFO 8 тактов = шаг в 2 раза меньше),
// сильное эхо + длинный реверб, слайдер attack.
$: note(m('<a1 a1 a1 a1 a1 a1 a1 a1 a1 a1 a1 a1 a1 a1 a1 a0>'))
  .struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~'))
  .mask(m('<0 0 0 1>'))
  .s('sawtooth').unison(3).detune(0.25)
  .distort(1.2)
  .lpf(2100 .add(sine.range(-300, 300).slow(4)))
  .lpq(19 .add(sine.range(-5, 5).slow(8)))
  .attack(0.02).decay(0.4).sustain(0.6).release(1.4)
  .delay(0.85).delayfeedback(0.54)
  .room(1.2).pan(sine.slow(8).range(0.2, 0.8))

// laser: 4 низкие F#3, жёсткий срез, 1 такт из 8
$: note(m('f#3 f#3 f#3 f#3'))
  .struct(m('~ ~ ~ ~ ~ ~ ~ ~ x x x x ~ ~ ~ ~'))
  .mask(m('<0 0 0 0 0 0 0 1>'))
  .s('sawtooth').unison(2).detune(0.1)
  .distort(1.1)
  .lpf(2500 .mul(saw.range(0.2, 3.2))).lpq(4)
  .lpenv(3).lpa(0.002).lpd(0.08).lpsustain(0)
  .decay(0.08).sustain(0).release(0.04)
  .delay(0.35).room(0.4).pan(sine.slow(8).range(0.2, 0.8))

// bubble: 4 нейтральных F#6/G6 FM-щелчка (только m2), 1 такт из 16
$: note(m('f#6 f#6 f#6 g6'))
  .struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x x x x'))
  .mask(m('<0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0>'))
  .s('sine').fmi(2).fmh(2.01)
  .attack(0.001).decay(0.03).sustain(0)
  .delay(0.3).pan(rand.range(0.2, 0.8))

// crunch: 2 crushed-noise удара, 1 такт из 16
$: s('white')
  .struct(m('~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x ~ x ~'))
  .mask(m('<0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0>'))
  .crush(6).hpf(400).lpf(4000)
  .decay(0.08).sustain(0).room(0.4).pan(rand.range(0.2, 0.8))
```

Локальные `switchangel_acid` (pulse/FM) и `DISSOLUTION-PROTOCOL` (bytebeat/
noise) — хорошие референсы. Редкие вставки держи ненавязчиво: сильная
панорама/дилей, низкий gain; вес пусть несёт fat low.


## Динамический cutoff (чего не хватало)

Референсы в основном статичные. Двигай срез двумя слоями:

```js
// 8-е/16-е слои: база × медленный LFO × автоматика секции
.lpf(cut.mul(sine.range(0.6, 1.3).slow(16)).mul(autoAt('keys.acid.cut')))

// длинные пэды/струнные: непрерывный LFO, один проход за 16 тактов
.lpf(cut).lpdepth(0.6).lpsync(1/16).lpdc(0)
```

`sine.range` сэмплится на каждом ивенте, поэтому годится для баса, acid,
арпа и pluck. Для длинных нот — `lpdepth`/`lpsync`, иначе срез сэмплится
только в момент атаки. `autoAt` двигает базу по секциям, LFO — внутри
секции.

### Рампа acid в груве (старт тёмный, раскрытие к середине)

При `acidCut = 250` и `lpf(acidCut × sine.range(0.7, 1.8) × autoAt(...))`
автоматика `[24, 0.45], [32, 1.0], [40, 0.9]` стартует грув около 80 Гц и
раскрывает его к середине к 32-му такту. Минимум слайдера acid cut — 80.

## 6. Riser и реверс

```js
// один длинный шум на 4 такта; в LOOP выключен
$: s('white').slow(4)
  .gain(riserVol.mul(tlOr('riser', pure(0))))
  .hpf(400).lpf(6000)
  .lpenv(2).lpa(6).lpd(2).lpsustain(0.2)
  .attack(2).decay(2).sustain(0.7).release(1.2)
  .room(verb.mul(0.5)).roomsize(fx.reverb.size)
  .mask(gateOf('riser', pure(0))).filter(audible)

// реверс-креш на входе в секцию
$: s('cr').rev().slow(2)
  .gain(reverseVol.mul(tlOr('reverse', pure(0))))
  .decay(0.4).sustain(0)
  .room(verb.mul(0.6)).roomsize(fx.reverb.size)
  .mask(gateOf('reverse', pure(0))).filter(audible)
```

`reverse`/`roll` держи `loopLevel = 0`: в LOOP они не нужны, только в
секциях.

## 7. Скелет аранжировки

```js
const TIMELINE = [
  { at: 0,   len: 16, name: 'INTRO',  values: { kick: 1, bass: 1, sub: 1, hats: 0, acid: 0, lead: 0 } },
  { at: 16,  len: 16, name: 'GROOVE', values: { kick: 1, bass: 1, sub: 1, hats: 1, acid: 1, lead: 0 } },
  { at: 32,  len: 16, name: 'LIFT',   values: { kick: 1, bass: 1, sub: 1, hats: 1, oh: 1, clap: 1, acid: 1, lead: 0 } },
  { at: 48,  len: 16, name: 'BREAK',  values: { kick: 0, bass: 0, sub: 0, hats: 0, acid: 0, lead: 1, riser: 1 } },
  { at: 64,  len: 16, name: 'BUILD',  values: { kick: 1, bass: 1, sub: 1, hats: 1, oh: 1, clap: 1, roll: 1, riser: 1 } },
  { at: 80,  len: 16, name: 'DROP',   values: { kick: 1, bass: 1, sub: 1, hats: 1, oh: 1, clap: 1, acid: 1, lead: 1 } },
]
```

16 тактов кик+бас в начале, слои по 8–16, смены на границах 8/16.

## 8. Проверки

```bash
npm run verify  -- tracks/psytrance/01-serpent-engine.js
npm run gains   -- tracks/psytrance/01-serpent-engine.js
npm run cpu     -- tracks/psytrance/01-serpent-engine.js
npm run levels  -- tracks/psytrance/01-serpent-engine.js 104
npm run modes   -- tracks/psytrance/01-serpent-engine.js
```

Ориентиры: `cpu` — до ~150 worklet/с; `gains` — тишина на нулях;
`levels` — лид/кислота не в тени пэда; `modes` — все режимы меняют
рисунок, а не только громкость.
