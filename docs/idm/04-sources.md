# 04 · Источники

Собрано 2026-11-15. Читались страницы и треды, а не только заголовки.
Формат: источник → что взято → куда легло в треке.

---

## 1. IDM: секвенция и звук

### Studio Brootle — How To Make An IDM Beat

https://www.studiobrootle.com/how-to-make-an-idm-beat-aphex-twin-autechre-influenced/

- 114 BPM, 3 LinnDrum + 3 Operator: сложность из малого числа источников.
- Follow Actions: 4 варианта клипа играют случайно, но выбор ограничен.
- Velocity → random → FM amount / filter cutoff / envelope length.
- Beat Repeat, grain delay, ping-pong delay, широкий стерео.
- Короткие gated барабаны, питч вверх/вниз.
- Мурлыкающий саб отдельно.

**В трек:** `mode`-ветки, `degradeBy` на текстурах, `bits` и `grain`,
лёгкий саб, дилей вместо большого реверба.

### Studio Brootle — IDM Techniques

https://www.studiobrootle.com/idm-techniques/

- Looped envelopes → почти audio-rate модуляция.
- Grain delay с настройкой на 7 полутонов.
- Chorus/phaser с большим feedback.
- Beat Repeat + delay после него.
- Sample & Hold LFO (1/8, 1/16) на резонансный фильтр.
- Arpeggiator + random pitch.

**В трек:** LFO по срезу growl/пэда, `rand` на скорость зёрен,
`arp(run(...))` с вероятностным выбрасыванием нот.

### Elektronauts — What’s the sequencing theory in IDM?

https://www.elektronauts.com/t/whats-the-sequencing-theory-in-idm/173927

- «Muddy chaos» — главная ошибка; лечится EQ, фильтрацией, компрессией.
- Меньше слоёв, больше внимания каждому.
- Мелодия как ритм, ритм как мелодия.
- Рандом — специя; основа — ручная секвенция.
- Micro-slicing: брать пик и немного вокруг; играть 8-е, а не все 16-е.
- Не перегружать низ.

**В трек:** разрежённые рисунки, отдельные микро-слои, явные `struct`,
низ отдан сабу.

### Sonic State / Felix Fleer — How To Create IDM

https://sonicstate.com/news/2023/02/18/how-to-create-idm/

- Обзор sound design, drum processing и drum glitches.
- Глитч — обработка, а не отдельный жанр.

**В трек:** общая рамка; конкретика взята из других источников.

### ZacharySBrown — idm-course

https://github.com/ZacharySBrown/idm-course

- 12-недельный reverse-engineering курс: Aphex, Autechre, Four Tet,
  Squarepusher, Dilla, Burial.
- Подход: разбирать треки, а не собирать из лупов.

**В трек:** методика «сначала секвенция, потом слои».

---

## 2. Грануляр

### Sound on Sound — Granular Synthesis

https://www.soundonsound.com/techniques/granular-synthesis

- Зерно 1–100 мс; grain size, smoothing, density, position.
- Транзиенты страдают первыми: флэмминг, «двойной удар».
- Маленькое зерно + большое transient window для барабанов.
- Grain cloud: много зёрен, jitter по pitch/position/length/pan.
- Модуляция позиции — главный источник «живого» грануляра.

**В трек:** `grain.cloud` / `scan` / `freeze`; `window`, `density`,
`spread`, `pan(rand)`, `degradeBy`.

### Wikipedia — Granular synthesis

https://en.wikipedia.org/wiki/Granular_synthesis

- Grains 1–100 мс; cloud; microsound time scale.
- History: Gabor → Xenakis → Roads → Truax.
- Density/overlap меняют тембр от «облака» до «ноты».

**В трек:** терминология и диапазоны; практическая часть — из SOS.

---

## 3. 8 бит / chiptune

### Wikipedia — Chiptune

https://en.wikipedia.org/wiki/Chiptune

- PSG: pulse (duty cycle), square, triangle, saw, noise.
- Game Boy: 2 pulse + 4-bit wave + noise; C64 SID: 3 канала, ring mod,
  resonance filter.
- Мало голосов → быстрые арпеджио вместо аккордов.
- FM-эра (PC-88/PC-98, AdLib/OPL) — «тёплый цифровой» тембр.
- Трекерная культура: маленькие сэмплы, точная секвенция.

**В трек:** `pulse` + `pw`, `square`, `arp(run(8/16/32))`, `crush`,
короткие ноты, высокий регистр.

### Практика проекта

- `crush` — worklet; только на слоях с малым числом событий.
- `coarse` есть не везде; в треке «coarse» — другая глубина `crush`.

---

## 4. Эйсид / 303

### Switch Angel — strudel-scripts

https://github.com/switchangel/strudel-scripts

- `glide`: считать, от какой ноты едем; `panchor 0`, `psustain 0`,
  `pattack 0`, `pdecay = время`, `penv = -12*log2(fTo/fFrom)`.
- Гейт glide — без `<…>`.
- `accent` = громче И ярче.
- 303-патч: supersaw + detune 0.5 + unison 1.
- Разрежённая линия, широкие интервалы.

**В трек:** `acid.line` (glide на трёх 16-х), `acid.run`, `acid.scream`.

### `docs/switchangel-recipes.md`

- Локальная выжимка рецептов; читать перед новым треком.

---

## 5. Breakcore / микро-срезка

### `docs/breakcore/`

- Rinse-техника, micro-slicing, rolls, velocity-as-slice-selector.
- «Не перехлёстывать chop»; warp — убийца грува.
- Non-multiple slice count ломает фразировку осознанно.

**В трек:** `grain.edit` через `slice`, `padRoll`, `padCut`; без
тотального чопа.

---

## 6. Тёмная гармония

### `docs/rules.md`

- Бас ≤80 по умолчанию.
- Антипоп: без смешных мелодий, 303 — не обыгрывание аккордов,
  бочка глухая, без 1–2–4–5.
- Сложные аккорды — только если это джаз; иначе минимализм с
  сочными диссонансами на 9-ках.

### Практика проекта

- Тритон как ось, `@dark` в `tension`.
- Малая секунда не прощается.
- Регистры разведены: бас c1–db2, пэд c3–e4, лид c5–f6.

**В трек:** C–Gb–Db–Bb, тритоновые пары, квинты с 9-й.

---

## 7. Что не взято

- Трип-хоп и burial-атмосфера — уже есть в techno/17.
- Большой реверб и «эмбиент-пэд» — противоречат IDM-задаче.
- Плотный 16-й acid-поток — противоречит антипопу.
- Генеративный рандом без контроля — противоречит форумному консенсусу.
