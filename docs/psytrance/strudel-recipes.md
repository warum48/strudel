# Psytrance — Strudel recipes

Рабочие куски для full-on psytrance. Всё — нативные Strudel-функции:
`m(...)`, `struct`, `lpf/lpq/lpenv`, `duckorbit`, `delay`, `room`.
Слайдеры — только неотрицательные литералы.

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
  .lpf(bassCut).lpq(12).ftype('24db')
  .lpenv(3).lpa(0.002).lpd(0.05).lpsustain(0)
  .decay(0.07).sustain(0).release(0.02)
  .distort(1.2).clip(0.9)
  .orbit(2)
  .mask(gateOf('bass')).filter(audible)

// sub: тот же рисунок, sine, только корень
$: note(m('f#1')).struct(bassPat)
  .s('sine')
  .gain(subVol.mul(tlOr('sub')))
  .lpf(70)
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
  .lpf(acidCut.mul(autoAt('keys.acid.cut'))).lpq(15).ftype('24db')
  .lpenv(4).lpa(0.002).lpd(0.06).lpsustain(0)
  .decay(0.07).sustain(0.1).release(0.03)
  .distort(1.1)
  .delay(0.32).delaytime(0.375).delayfeedback(0.45)
  .room(verb.mul(0.3)).roomsize(fx.reverb.size)
  .mask(gateOf('acid')).filter(audible)
```

Одна-две ноты из лада, повтор, фильтр ползёт. Это не «обыгрывание
аккордов» — это ритмический рифф.

## 4. Psy lead с рандомным bandpass

```js
$: note(m('<[f#3 ~ a#3 ~ c#4 ~ a#3 ~] [g3 ~ a#3 ~ f#3 ~ g3 ~]>'))
  .s('sawtooth').unison(2).detune(0.08)
  .gain(leadVol.mul(tlOr('lead')))
  .bpf(leadCut.mul(rand.range(0.7, 1.3))).bpq(8)
  .lpenv(2).lpa(0.002).lpd(0.1).lpsustain(0.1)
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
  .bpf(1800).bpq(10)
  .attack(0.001).decay(0.06).sustain(0).release(0.02)
  .delay(0.3).delaytime(0.375).delayfeedback(0.4)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .pan(rand.range(0.3, 0.7))
  .mask(gateOf('squelch')).filter(audible)
```

2–4 сквелча на такт, не на даунбит.

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
