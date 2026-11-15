# Кхмерский трек в Strudel

Трек: `tracks/khmer/01-sathukar.js`. 88 BPM, 27 дорожек, 83 слайдера.
Один цикл = один такт 4/4: `setcpm(88 / 4)`.

## 1. Скелет

```js
const BPM = 88
setcpm(BPM / 4)

const scene = slider(2, 0, 4, 1)   // intro build main break outro
const mode = slider(1, 0, 3, 1)    // sathukar pinpeat boxing percussion
const harmony = slider(0, 0, 1, 1) // fifth axis
```

Гейты — обычные сигналы:

```js
const atScene = (n) => scene.fmap((v) => (v === n ? 1 : 0))
const drumsOn = scene.fmap((v) => (v === 1 || v === 2 || v === 3 ? 1 : 0))
const m0 = mode.fmap((v) => (v === 0 ? 1 : 0))
// …
```

Защёлка гармонии:

```js
const hQ = harmony.seg(1 / 8)
const hA = hQ.fmap((h) => (h < 0.5 ? 1 : 0))
const hB = hQ.fmap((h) => (h < 0.5 ? 0 : 1))
```

`seg(1/8)` делает один сэмпл на 8 тактов: слайдер можно двигать
когда угодно, звук сменится на границе фразы. `latch` показывает
это как «такт 8, а не 4».

## 2. Инструменты

### Roneat ek — деревянный ксилофон

```js
note(EK7)
  .s("triangle").partials([1, 0.5, 0.25, 0.12])
  .penv(-5).panchor(1).pattack(0.001).pdecay(0.02).psustain(0)
  .gain(roneat.ek.vol.mul(ek7On).mul(ekOn))
  .lpf(roneat.ek.cut).hpf(400).lpq(1)
  .decay(roneat.ek.decay).sustain(0).release(0.05)
```

`penv` с отрицательным значением и `panchor(1)` даёт короткий
спуск питча на атаке — «ток» планки. `partials` добавляет
нечётные призвуки, чтобы треугольник не звучал как синус.

### Kong vong — бронзовый гонг

```js
note(VONG)
  .s("sine")
  .fm(gong.vong.fm).fmh(gong.vong.ratio)
  .fmdecay(gong.vong.decay).fmsustain(0)
  .decay(gong.vong.decay).sustain(0).release(0.4)
```

FM с негармоническим `fmh` (1.41) даёт бронзовый обертон.
`fmsustain(0)` обязателен: иначе модулятор тянет хвост.

### Sralai — тростниковый гобой

```js
note(REED)
  .s("sawtooth").unison(2).detune(0.05)
  .lpf(reed.lead.cut).lpq(reed.lead.q).ftype("24db")
  .shape(reed.lead.grit)
  .attack(reed.lead.att).decay(0.2).sustain(0.8).release(reed.lead.rel)
```

Пила + резонанс + короткий `shape` — грязный тростник. Без
гладкого вибрато и без «джазовой» артикуляции.

### Sampho — две головы

```js
s("sine").struct("x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ x")
  .gain(drums.samLow.vol.mul(drumsOn).mul(m1))
  // …
  .note("<eb2>").add(note(drums.samLow.pitch))
  .penv(-8).panchor(1).pattack(0.001).pdecay(0.04).psustain(0)
  .lpf(drums.samLow.cut).hpf(80)
  .decay(drums.samLow.decay).sustain(0)
```

Три слоя: low (theung), high (ting), ghost (tip/tup). У каждого
свой питч и фильтр.

### Skor thom — пара барабанов

```js
s("triangle").struct("x ~ ~ ~ ~ ~ x ~ x ~ ~ ~ ~ ~ x ~")
  .gain(drums.skorLow.vol.mul(drumsOn).mul(m1))
  // …
  .note("<c1>").add(note(drums.skorLow.pitch))
  .penv(-12).panchor(1).pattack(0.001).pdecay(0.08).psustain(0)
  .lpf(drums.skorLow.cut).hpf(30)
  .decay(drums.skorLow.decay).sustain(0).release(0.08)
```

Low — loose и глухой, high — tight и выше. Без сэмплов, поэтому
пара не превращается в драмкит.

### Chhing — часы

```js
s("sine").struct("x ~ ~ ~ x ~ ~ ~ x ~ ~ ~ x ~ ~ ~")
  .gain(drums.chhing.vol.mul(m1))
  .note("<c6>")
  .fm(1.8).fmh(2.76).fmdecay(drums.chhing.decay).fmsustain(0)
  .decay(drums.chhing.decay).sustain(0)
```

Закрытый — короткий, открытый — длиннее и на другой ноте.
В BOXING сетка становится 8-й.

## 3. Пэды

Пэд — momentary: панель пишет 1 на время нажатия и 0 при отпускании.
В треке это всегда гейт:

```js
gain(gong.thom.vol.mul(padGong).mul(1.4))
```

Пэды: `padGong`, `padSampho`, `padSkor`, `padChhing`, `padReed`,
`padSwell` (клавиши 1–6). Ни один не звучит по умолчанию; `gains`
это проверяет.

## 4. Сцены

`// @scenes` — две кнопки в панели:

```js
// @scenes {"intro":{…},"theme":{…}}
```

Ключи — полные пути по дереву (`drums.skorLow.vol`,
`roneat.ek.vol`, `verb`). Intro: воздух, бурдон, гонги, часы.
Theme: полный ансамбль.

## 5. Грабли 1.2.6

- **`.add(slider)` на note-паттерне.** `note("<c1>").add(drums.skorLow.pitch)`
  выдаёт `[warn]: Can't do arithmetic on control pattern` и не
  применяет сдвиг. Работает `.add(note(drums.skorLow.pitch))`.
  В треке так и сделано.
- **`shape` — worklet на каждое событие.** На барабанах это
  дорого; поэтому `shape` только у сралая (редкие ноты).
  Барабаны используют `penv` + `lpf` + `decay`.
- **`samples()` в node нет.** Здесь сэмплов нет вообще: только
  `sine`, `triangle`, `sawtooth`, `white`, `pink`. `live` не
  зависит от GitHub.
- **`.gain()` после `stack()` перезаписывает внутренние gain.**
  Поэтому в `stack` каждый рисунок несёт свой
  `vol.mul(gate)`, а внешнего `.gain()` нет.
- **`lpdepth` — множитель, не герцы.** В `atmos.air` используется
  `lpdepth(lfo).lpsync(0.125)`; см. `docs/references.md`.

## 6. Бюджет

`npm run cpu -- tracks/khmer/01-sathukar.js`:

| mode | worklet/такт | в секунду |
|---|---|---|
| 0 sathukar | 0 | 0 |
| 1 pinpeat | 1 | 0 |
| 2 boxing | 4 | 1 |
| 3 percussion | 0 | 0 |

Это очень мало: у трека почти нет worklet-эффектов. Запас
огромный, поэтому можно добавить `shape` на сралай или фильтры
на гонги, не рискуя звуком.

## 7. Гейты

```bash
npm run verify  -- tracks/khmer/01-sathukar.js
npm run tension -- tracks/khmer/01-sathukar.js
npm run modes   -- tracks/khmer/01-sathukar.js
npm run latch   -- tracks/khmer/01-sathukar.js
npm run gains   -- tracks/khmer/01-sathukar.js
npm run doubles -- tracks/khmer/01-sathukar.js
npm run cpu     -- tracks/khmer/01-sathukar.js
npm run live    -- tracks/khmer/01-sathukar.js
```

Результат для 01:

- `verify` — 27 дорожек, 49 ударов/такт, 83 слайдера, 0 ошибок;
- `tension` — трения нет, 96 намеренных тритонов;
- `modes` — все барабаны меняют рисунок, мелодии включаются по режимам;
- `latch` — такт 8;
- `gains` — тихо при всех нулях;
- `doubles` — наложений нет;
- `cpu` — 4/такт в худшем режиме;
- `live` — eval ок, паттерн играет, слайдер синхронизирован.

## 8. Почему не микротоны

`note()` в Strudel принимает дробные числа, но `tension` и
`phrase([...])` читают ноты как имена (`c5`, `db5`). Дробные
MIDI-значения выпали бы из анализа. Поэтому строй approximated
12-TET, а кхмерская «плавающая» высота описана в доках, а не
сымитирована. Это осознанный компромисс: проверяемость важнее
псевдоточности.

## 9. 02-skors: реальные сэмплы, сцены-ритмы, mutes

Второй трек не использует синтез. Карта сэмплов — два вызова:

```js
if (typeof samples === 'function') {
  samples('github:tidalcycles/Dirt-Samples')
  samples({
    xylo: {
      c5: 'Percussion/Xylo/Xylo_Medium_C5_ff_01_far.wav',
      g5: 'Percussion/Xylo/Xylo_Medium_G5_ff_01_far.wav',
    },
    marimba: {
      c4: 'Percussion/Marimba/Marimba_hit_Outrigger_C4_loud_01.wav',
      g4: 'Percussion/Marimba/Marimba_hit_Outrigger_G4_loud_01.wav',
    },
    gong: {
      c2: 'Percussion/gongHit_mf.wav',
      g2: 'Percussion/gongHit_f.wav',
    },
    claves: {
      c6: 'Percussion/Claves1_Hit_v1_rr1_Sum.wav',
    },
  }, 'https://raw.githubusercontent.com/sgossner/VSCO-2-CE/master/')
}
```

`note("c5").s("xylo")` выбирает ближайший сэмпл и подстраивает питч.
VSCO 2 CE — CC0; Dirt-Samples даёт реальные тайко/хэнд/таблу/металл.

### Сцены — только ритм

```js
const sc = (arr) => scene.pick(arr.map((s) => m(s)))
$: s("east").n("6 7 8")
  .struct(sc(R.skorLow))
  .gain(drums.skorLow.vol.mul(unmuted(muteSkor)))
```

`R.skorLow` — массив из пяти 16-шаговых рисунков. Сцена выбирает
рисунок, но **не** умножает gain: все инструменты есть во всех
сценах. `mode` меняет только филл/призраков/свинг.

### Mutes вместо сцен

```js
const muteSkor = slider(0, 0, 1, 1)
const unmuted = (m) => m.fmap((v) => (v ? 0 : 1))
.gain(drums.skorLow.vol.mul(unmuted(muteSkor)))
```

`// @mutes muteSkor,muteSampho,…` рисует ряд кнопок под сценами
(панель `#mutes`). Это обычные 0/1, не momentary: клик глушит слой,
паттерн остаётся в секвенсоре. Пэдов в треке нет.

### Настройки инструментов

У каждого слоя в дереве `instruments` пять ручек:
`vol`, `cut` (lpf), `hpf`, `clip` (длина сэмпла), `room`. Панель
показывает `vol` в MIXER, остальные — в TONE; в коде это, например,
`drums.skorLow.cut` или `xylo.ek.room`. Все они — обычные сигналы,
поэтому их можно менять на лету и сохранять в JSON.

### Ограничения

- VSCO-ксилофон/маримба — западные инструменты, не roneat.
- Кнопка SAMPLES в панели качает только `github:`-карты; VSCO
  грузится лениво по прямым URL.
- Кхмерский one-shot банк не найден; локальные записи лучше. См.
  `05-samples.md`.
