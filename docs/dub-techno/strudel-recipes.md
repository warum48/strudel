# Dub Techno — рецепты для Strudel

Готовые куски из `techno/16-minimal-dub` и `techno/17-halfstep-dub`.
Полные треки — в `tracks/techno/`; здесь только то, что переиспользуется.

## Каркас

```js
const BPM = 120
setcpm(BPM / 4) // один цикл = один такт 4/4

if (typeof samples === 'function') {
  samples('github:tidalcycles/uzu-drumkit')
  samples('github:tidalcycles/Dirt-Samples')
}

const phrase = (bars) => m('<' + bars.join(' ') + '>')
const verb = slider(0.7, 0, 1, 0.01) // большой тёмный реверб
```

Дерево инструментов — обычное:

```js
const instruments = {
  atmos: { name: 'Atmos', hiss: { vol, cut, hpf }, air: { vol, cut, lfo }, field: { vol, cut } },
  drums: { name: 'Drums', kick: { vol, cut, shape, decay }, hat: { ... }, rim: { ... }, click: { ... } },
  bass:  { name: 'Bass',  sub: { vol, cut, decay }, dub: { vol, cut, decay } },
  chords:{ name: 'Chords', pad: { ... }, stab: { ... } },
  fx:    { name: 'FX', dub: { send, time, feedback }, reverb: { size } },
}
const { atmos, drums, bass, chords, fx } = instruments
const audible = (h) => {
  const g = h.value?.gain
  return typeof g !== 'number' || g > 0.001
}
```

## Гармония

### Classic 120 BPM: Am9 → Bbmaj9

```js
// @roots a a a a bb bb bb bb
const ROOT = phrase([
  '[a1]', '[a1]', '[a1]', '[a1]',
  '[bb1]', '[bb1]', '[bb1]', '[bb1]',
])

const PAD_A = phrase([
  '[a2,c3,e3,g3,b4]', '[a2,c3,e3,g3,b4]',
  '[a2,c3,e3,g3,b4]', '[a2,c3,e3,g3,b4]',
  '[bb2,d3,f3,c4,a4]', '[bb2,d3,f3,c4,a4]',
  '[bb2,d3,f3,c4,a4]', '[bb2,d3,f3,c4,a4]',
])

const PAD_B = phrase([
  '[a3,e4,b4]', '[a3,e4,b4]',
  '[a3,e4,b4]', '[a3,e4,b4]',
  '[bb3,f4,c5]', '[bb3,f4,c5]',
  '[bb3,f4,c5]', '[bb3,f4,c5]',
])
```

Почему так:
- `bII` (Bb) — сочный сдвиг на полтона, не 1–2–4–5.
- В Am9 есть `e`, в Bbmaj9 — `bb`; не ставь их одновременно в одном такте.
- `PAD_A` — тёплая укладка; `PAD_B` — открытые квинты/9-е без терций.
- `b4`/`a4` подняты, чтобы стаб не ловил малую секунду с `b3`/`a3`.

### Halfstep 104 BPM: Dm9 → Bbmaj9

```js
// @roots d d d d bb bb bb bb
const PAD_A = phrase([
  '[d3,f3,a3,c4,e4]', '[d3,f3,a3,c4,e4]',
  '[d3,f3,a3,c4,e4]', '[d3,f3,a3,c4,e4]',
  '[bb2,d3,f3,c4,a4]', '[bb2,d3,f3,c4,a4]',
  '[bb2,d3,f3,c4,a4]', '[bb2,d3,f3,c4,a4]',
])
```

## Саб и dub-бас

Правило проекта: **срез ≤80 Гц**. Слайдер max = 80; выше не поднять.

```js
bass: {
  name: 'Bass',
  sub: { vol, cut: slider(70, 40, 80, 1), decay },
  dub: { vol, cut: slider(80, 40, 80, 1), decay },
}
```

```js
// Саб — оффбит-пульс, не на долю с киком.
$: note(ROOT)
  .s("sine")
  .struct("~ x ~ ~ ~ x ~ ~")
  .gain(bass.sub.vol)
  .lpf(bass.sub.cut)
  .shape(0.2)
  .attack(0.01).decay(bass.sub.decay).sustain(0.6).release(0.3)
  .filter(audible)

// Dub-бас — фраза с паузами и контрапунктом, не «тоника-терция-квинта».
$: note(BASS)
  .s("triangle")
  .gain(bass.dub.vol)
  .lpf(bass.dub.cut).lpq(1.2)
  .decay(bass.dub.decay).sustain(0.5).release(0.2)
  .filter(audible)
```

Пример `BASS` для Am/Bb (все ноты ниже 80 Гц):

```js
const BASS = phrase([
  '[a1 ~ ~ e1 ~ ~ g1 ~]',
  '[~ a1 ~ ~ c2 ~ ~ e1]',
  '[a1 ~ ~ ~ e1 ~ g1 ~]',
  '[~ ~ d2 ~ ~ e1 ~ a1]',
  '[bb1 ~ ~ f1 ~ ~ d2 ~]',
  '[~ a1 ~ ~ c2 ~ ~ f1]',
  '[a1 ~ ~ ~ f1 ~ d2 ~]',
  '[~ ~ c2 ~ ~ f1 ~ bb1]',
])
```

`a1` на Bb-тактах — maj7-педаль, а не ошибка. Не добавляй `e` на Bb:
`e–bb` — тритон.

## Кик

```js
$: s("bd*4")
  .gain(drums.kick.vol)
  .lpf(drums.kick.cut).lpq(1)       // 250–300
  .shape(drums.kick.shape)          // 0.4–0.5, мягко
  .decay(drums.kick.decay).sustain(0).release(0.08)
  .filter(audible)
```

Никакого клика, дисторшна и яркого верха. В halfstep кик может быть
`x ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ x` (1 + пикап) или `1 + 3.5`.

## Стаб в дилее — главный звук

```js
const STAB = phrase([
  '[~ [a3,c4,e4,g4] ~ ~ ~ ~ ~ ~]',
  // ...
  '[~ [bb3,d4,f4,a4] ~ ~ ~ ~ ~ ~]',
])
```

```js
$: note(STAB)
  .s("sawtooth").unison(2).detune(0.06)
  .gain(chords.stab.vol)
  .lpf(chords.stab.cut).lpq(chords.stab.res).ftype("24db")
  .decay(chords.stab.decay).sustain(0).release(0.4)
  .delay(fx.dub.send)
  .delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback)
  .room(chords.stab.room.mul(verb)).roomsize(fx.reverb.size)
  .filter(audible)
```

Значения:
- `fx.dub.time` = `0.375` — пунктирная четверть.
- При 120 BPM один цикл = 2 с, значит эхо через **0.75 с**.
- `fx.dub.feedback` 0.45–0.65; выше — каша.
- `chords.stab.cut` 900–1200; повторы темнее сухого стаба.
- Сухой стаб должен быть громче первого эха.

## Пэд

```js
// WARM
$: note(PAD_A)
  .s("sawtooth").partials([1, 0.45, 0.25, 0.1, 0.05])
  .unison(2).detune(chords.pad.det)
  .gain(chords.pad.vol.mul(hA))
  .lpf(chords.pad.cut).hpf(chords.pad.hpf).lpq(chords.pad.q).ftype("24db")
  .lpdepth(chords.pad.lfo).lpsync(0.125).lpdc(0)
  .chorus(0.4)
  .attack(4).decay(3).sustain(0.9).release(12)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

// AIR
$: note(PAD_B)
  .s("triangle").partials([1, 0.3, 0.15, 0.06])
  .unison(3).detune(chords.pad.det.mul(1.4))
  .gain(chords.pad.vol.mul(hB))
  .lpf(chords.pad.cut.mul(1.2)).hpf(300).lpq(chords.pad.q.mul(0.7))
  .attack(6).decay(4).sustain(0.9).release(16)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)
```

`hA`/`hB` — защёлка harmony на 8 тактов. Пэд не двигается с киком.

## Хэты, rim, click

```js
$: stack(
     s("~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~").gain(drums.hat.vol.mul(m0)),
     s("~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~ ~ ~ oh ~").gain(drums.hat.vol.mul(m2).mul(0.8)),
   )
  .lpf(drums.hat.cut).hpf(500)
  .decay(drums.hat.decay).sustain(0)
  .delay(fx.dub.send.mul(0.35)).delaytime(fx.dub.time).delayfeedback(fx.dub.feedback.mul(0.5))
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .filter(audible)
```

```js
$: stack(
     s("~ ~ ~ ~ rim ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~").gain(drums.rim.vol.mul(m0)),
     s("~ ~ rim ~ ~ ~ rim ~ ~ ~ rim ~ ~ ~ rim ~").gain(drums.rim.vol.mul(m1)),
     // ...
   )
  .lpf(drums.rim.cut).hpf(500).lpq(2)
  .decay(0.06).sustain(0)
  .pan(rand.mul(1.2).sub(0.6))
  .delay(drums.rim.echo.mul(fx.dub.send))
  .delaytime(fx.dub.time).delayfeedback(fx.dub.feedback.mul(0.6))
  .filter(audible)
```

Click — только в STRIP/CLICK:

```js
$: s("click:0")
  .struct("~ x ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~")
  .gain(drums.click.vol.mul(m1.add(m3)))
  .lpf(drums.click.cut).hpf(2000)
  .decay(0.03).sustain(0)
  .pan(rand.mul(1.6).sub(0.8))
  .delay(drums.click.echo.mul(fx.dub.send))
  .delaytime(fx.dub.time).delayfeedback(fx.dub.feedback)
  .filter(audible)
```

## Текстуры

```js
$: s("crackle")
  .gain(atmos.hiss.vol)
  .lpf(atmos.hiss.cut).hpf(atmos.hiss.hpf)
  .room(verb.mul(0.4)).roomsize(fx.reverb.size)
  .filter(audible)

$: s("pink")
  .gain(atmos.air.vol)
  .lpf(atmos.air.cut).hpf(120).lpq(0.7)
  .lpdepth(atmos.air.lfo).lpsync(0.0625)
  .room(verb).roomsize(fx.reverb.size)
  .filter(audible)

$: s("wind:0")
  .loopAt(8)
  .gain(atmos.field.vol)
  .lpf(atmos.field.cut).hpf(200)
  .room(verb.mul(0.7)).roomsize(fx.reverb.size)
  .pan(sine.slow(64).range(0.3, 0.7))
  .filter(audible)
```

## Режимы и защёлка

```js
// @switches mode=dub,strip,pressure,click harmony=warm,air
const mode = slider(0, 0, 3, 1)
const m0 = mode.fmap((m) => (m === 0 ? 1 : 0))
// ...
const harmony = slider(0, 0, 1, 1)
const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))
```

`mode` меняет только хэты/rim/click/шейкер. Кик и саб остаются.

## Scenes

```js
// @scenes {"intro":{...},"theme":{...}}
```

Ключи — пути дерева (`drums.kick.vol`) или имена глобальных ручек
(`mode`, `harmony`). Панель даёт кнопки Intro/Theme и Export/Import JSON.

## Halfstep-вариант (Burial)

- 104 BPM, `setcpm(104 / 4)`.
- Кик на 1 + пикап, снейр на 3, шуршащие 16-е хэты со свингом.
- `swingBy(0.12, 8)` на хэтах.
- Гармония Dm9 → Bbmaj9; вокальный пэд `vowel("<a o>")`.
- Саб ≤80 + отдельный growl (исключение из правила 80 — это середина).
- Moog-нота и Moog-арп — краска, не лид.

## Аудиты

```bash
npm run verify -- tracks/techno/16-minimal-dub.js
npm run tension -- tracks/techno/16-minimal-dub.js
npm run modes -- tracks/techno/16-minimal-dub.js
npm run latch -- tracks/techno/16-minimal-dub.js
npm run gains -- tracks/techno/16-minimal-dub.js
npm run doubles -- tracks/techno/16-minimal-dub.js
npm run cpu -- tracks/techno/16-minimal-dub.js
npm run live -- tracks/techno/16-minimal-dub.js
```

Ориентиры для минимального даба:
- `verify` — без ошибок; 13–17 дорожек, 47–90 слайдеров.
- `tension` — чисто; трезвучия/9-е без тритонов.
- `cpu` — 3–4 worklet/с, с запасом.
- `gains` — тихо при всех нулях.
- `doubles` — без наложений; пустые первые такты у редких слоёв — норма.
- `live` — eval ок; sample button 45 файлов для 16.

## Khmer percussion bus (18)

18 кхмерских каналов — один `stack`, чтобы все прошли через общий
delay/reverb, а не через 18 отдельных хвостов.

```js
const percLayers = PERC.map((p) => {
  const base = p.note ? note(p.note).s(p.s) : s(p.s).n(p.n)
  return base.struct(m(p.pat)).speed(p.speed)
    .gain(perc[p.key].vol.mul(unmuted(MUTES[p.group])))
    .lpf(perc[p.key].cut).hpf(p.hpf)
    .clip(perc[p.key].clip)
    .pan(p.pan)
})

$: stack(...percLayers)
  .delay(percEcho)
  .delaytime(fx.dub.time)
  .delayfeedback(fx.dub.feedback.mul(0.7))
  .room(verb.mul(percVerb)).roomsize(verbSize)
  .filter(audible)
```

`PERC` — 30 спек: `east`/`hand`/`tabla`/`metal`/`tok`/`chin`/`claves`/`gong`.
У каждого канала в дереве `vol/cut/clip`, у групп — mute. Ноты/паттерны
держат ритм, а не мелодию.

## Native timeline (18)

Таймлайн, который играется в обычном Strudel. Таблица — множители к
hot-слайдерам; правки в панели применяются по Ctrl+Enter.

```js
const TIMELINE = JSON.parse('[{"at":0,"len":8,"name":"INTRO","values":{"kick":0}},{"at":8,"len":8,"name":"DUB","values":{"kick":1}}]')
const TL_TOTAL = Math.max(...TIMELINE.map((s) => s.at + s.len))
const tlCurve = (key) => {
  let last = 0
  const segs = []
  for (let i = 0; i < TIMELINE.length; i++) {
    const sec = TIMELINE[i]
    if (key in sec.values) last = sec.values[key]
    const next = i + 1 < TIMELINE.length ? TIMELINE[i + 1].at : TL_TOTAL
    if (next > sec.at) segs.push([next - sec.at, pure(last)])
  }
  return arrange(...segs)
}

$: s("bd*4").gain(drums.kick.vol.mul(tlCurve('kick')))
```

Важно: strudel.cc-транспайлер не любит двойные кавычки в JS-коде,
поэтому JSON лежит в `JSON.parse('…')` с одинарными кавычками.
