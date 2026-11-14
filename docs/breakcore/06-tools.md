# 06 · Инструменты

Что реально используют люди из тредов и зачем. Без «топ-10 плагинов».

---

## 1. Renoise (трекер) — самый цитируемый инструмент

### FX-карта (то, что реально называют)

| Команда | Что делает | Применение |
|---|---|---|
| `09xx` | sample offset / стартовая позиция | замена нарезке, «живые» хиты `[29927#12]` |
| `900–9FF` | offset без изменения высоты | точные позиции `[18985#50]` |
| `0Exy` | retrigger (y = число повторов) | роллы, снейр-раши `[18985#65]` |
| `04xy` | гейт/порог сэмпла | обрезка, стуттер `[26084#7]` |
| `040A` | перезапуск после cut | гейт-паттерны `[26084#7]` |
| `01xx` / `02xx` | питч вверх/вниз | пере-питч слайсов `[26084#15]` |
| `07xx` | volume slide | имитация быстрого decay `[29927#18]` |
| `08xx` | панорама | разведение слоёв `[26084#15]` |
| `10xx` | громкость | сглаживание бас-энвелопы `[18985#4]` |
| `B00/B01` | pattern break | резкие смены `[18985#4]` |
| `Fxx` | смена темпа | свинг и нечётные грувы `[2328#10]` |
| `maYbe` | вероятность события | генеративные фразы `[68093#3]` |

> ⚠️ **Разногласие по питчу:** Kosta говорит «`0180` = октава вверх, `0280` =
> октава вниз» `[34022#22]`, Rex поправляет: «`xx10` = полутон, `0180` = 8
> полутонов, `XXF0` = октава + 3 полутона» `[34022#23]`. Верить Rex, проверять в DAW.

### LPB / BPM / speed
- 8 LPB @ 400 BPM — визуально удобно `[29927#14]`.
- 16 LPB @ 200 BPM звучит идентично `[29927#21]`.
- 24 LPB — «24 LPB REPRESENT!» `[29927#23]`.
- BotB: 800 BPM / speed 3, чтобы убрать муть `[18985#46]`.
- Скорость 3 при 240 BPM — практический предел sunjammer'а `[18985#65]`.
- Настройки «Vache» (по видео): speed 3, tempo 447 `[18985#16]` — но чтение видео
  позже отозвано `[18985#15–17]`, не канон.

### LPB-арифметика (far_darrig)
- 96-строчный паттерн @ LPB 24: каждая 24-я строка = 1/4, 12-я = 1/8, 6-я = 1/16.
- Триоли: 24/3 = 8.
- 20 строк @ LPB 4 = 5/4 `[2328#7]`.

### Рабочий процесс
- Рендер выделения: `CTRL+SHIFT+ALT+R` → новый сэмпл `[34022#10]`.
- Отключить «beatfit» при рендере луп-точек, чтобы делать «rising snare fill» `[18985#4]`.
- FX-кнопка в сэмпл-редакторе — деструктивная вариация `[34022#5]`.
- Тяжёлые брейки — в отдельном проекте, потом импорт WAV `[18985#49]`.
- Демо-песни Renoise содержат пример beatslice — «Open it up and look deep into it» `[20448#2]`.

### Практические файлы (.xrns), упомянутые в тредах
- `rinse technique.xrns` — rinse-техника `[29927#1]`.
- `Tutorial6 - Sample Offset.rns` — объяснение `900–9FF` `[18985#60]`.
- `breekjebeenbiet.rar` (BotB) `[18985#38]`.
- `Benefit_of_the_Xrns.rar` `[26084#8]`.
- `Dank.it` / `Dankedit.xrns` `[18985#20]`.
- `mod.zip`, `an-pathren.zip` (Abrexxes) `[18985#2]`.
- Lneheb — xrns в описаниях YouTube `[68093#3]`.
- `grep-fu.net/venetiantabs/` — ремейк «Vache» (умер к 2013) `[18985#18, #74]`.

---

## 2. Железо

### Octatrack (самый частый)
- Slice + ручная правка автослайсов, «Octatrack often gets it wrong» `[175570]`.
- Timestretch **выключен**, пере-питч под темп `[175570]`.
- P-lock start/end, слайсы на кроссфейдере, freeze delay, retrig `[175570]`.
- LFO на выбор слайса = «random break chopping» `[212983]`.
- LoFi (SRR + bit depth + AM) и комб-фильтр `[173811]`.
- Три-тактовый чоп поверх 4/8 тактов, 6/8-грув `[226901]`.

### Digitakt / Digitakt II
- Нет полноценного ручного слайсинга (на момент тредов) → p-lock start/end `[175570]`.
- Трюк: LFO time-stretch, **фаза LFO** как «janky auto slice» `[175570]`.
- DT2 OS 1.10: transient-aware slicing, Slice Machine + random locks `[230650]`.
- LFO с сэмпл-слотом как целью, синус с нечётным таймингом = эволюция `[173927]`.

### Model:Samples / M8 / Polyend Tracker
- Model:Samples: p-lock start/end + retrigger + conditions `[175570]`.
- M8: слайсинг 2–128, немножественное число ломает фразировку `[209309]`.
- Polyend Tracker: beat slice, 8/16 чопов на плотный луп `[175570]`.

### Tonverk (свежий)
- 16 слайсов × velocity-слои: velocity ramp = нормальное воспроизведение,
  velocity random = генеративная вариация `[253094]`.
- BONK-кит: 128 velocity-слоёв, 8 round-robin, transient/BPM slicing `[253094]`.

---

## 3. norns (Monome) — два готовых скрипта

### `makebreakbeat`
Трубопровод: tempo detection → onset detection (min distance 1/16) → slice →
probabilistic FX на слайс → quantized reassembly `[53301]`.

Пример флагов из документации:
```
--trunc 0 --stutter 30 --kick 10 --deviation 10 --snare 10 --reverse 10
--pitch 10 --kick-mix -6 --snare-mix -6 --reverb 5 --stretch 1 --half 1
--trunc 10 --tempo 174
```
Stutter включает случайные volume/pitch ramp; реверб-хвост на кик/снейр
добавляется как отдельный квантованный слайс `[53301]`.

### `amenbreak`
200+ Amen-сэмплов, 2 ручки (amen / break), авто-стуттер/стретч/делэй, «punch» =
overdrive/decimate/degrade, ножной редактор слайсов, вероятностные FX `[60185]`.

**Порядок FX в скрипте (готовый рецепт):** stretch → volume → pitch → delay →
reverse → gate → tape stop → filter → mute `[60185]`.

---

## 4. Livecoding / генератив

| Инструмент | Что даёт | Источник |
|---|---|---|
| **SuperCollider + BBCut** | `SQPusher1` — быстрые порезы; half-speed = удвоить число слайсов (`SF3(file,16)` vs `8`); `SQPushFXPitch(pbchance:0.8)`; `CombN` после | `[5102#10]` |
| **Tidal Cycles** | `every 4 (rev)`, `density 4`, `*2`, `rev`, `brak`, `|+| pan sine1`, `[sn/2 sn/4 bd8 bd]8` | `[5102#10]` |
| **Conductive** (Renick Bell) | Haskell-библиотеки поверх SC-движка | `[5102#12]` |
| **Sonic Pi** | лайвкодинг + Voltage Modular, DAWless | `[6446]` |

**Ограничение:** генеративный подход требует тонкого контроля, иначе
«abstruse» `[5102#19]`.

---

## 5. DAW и плагины (что называют)

- **Ableton**: slice-to-MIDI, Simpler (transient sensitivity + timestretch),
  Drum Rack для поштучного питча `[175570]`.
- **FL Studio**: Slicex (до 150 слайсов), Gross Beat, dBlue Glitch, Love Philter,
  Peak Controller `[6643#30]`.
- **Reaper**: batch-стретч, batch-экспорт rx2-слайсов `[173927]`.
- **iZotope**: Stutter Edit, BreakTweaker `[5102#2]`.
- **Propellerheads ReCycle** — исторический инструмент Aphex `[244253]`.
- **Koala Sampler** — auto-chop equal 8/16 `[175570]`.
- **Serum 2** — разборы нарезки брейков `[193593]`.

---

## 6. Что выбрать под задачу

| Задача | Выбор | Обоснование |
|---|---|---|
| Максимальный контроль | Renoise | `09xx`/`0Exy`/`04xx` + LPB `[78569]` |
| Спидран одного трека | Ableton + Drum Rack | slice-to-MIDI + Simpler `[175570]` |
| Живое выступление | Octatrack | слайсы на кроссфейдере, freeze delay `[175570]` |
| Быстрые идеи в коде | Strudel | `slice/chop/degradeBy` — `08-strudel.md` |
| Генеративные вариации | SC/BBCut или Tidal | готовые примитивы `[5102#10]` |
| Гибрид | Renoise + рендер в сэмплы | «render to sample is your friend» `[29927#32]` |
