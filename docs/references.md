# Ссылки

Проверено 2026-11-12 (код ответа 200). Если что-то отвалилось — правь смело.

## Доки Strudel

- https://strudel.cc/learn/ — оглавление туториала, отсюда всё остальное
- https://strudel.cc/learn/mini-notation/ — мини-нотация: `~`, `[]`, `<>`, `*`, `,`, `:`
- https://strudel.cc/learn/synths/ — синтезаторы, `s("supersaw")`, `unison`, `detune`, FM
- https://strudel.cc/learn/effects/ — фильтры, дилей, реверб, дисторшн
- https://strudel.cc/learn/samples/ — сэмплы, банки, `.bank('RolandTR909')`

Справочник по функциям — не по ссылке, а в самом REPL: слева иконка «?» /
вкладка с функциями, там же живой поиск. Прямой URL отдаёт 403 ботам.

## Форумы и сообщества

- https://club.tidalcycles.org — Tidal Club, главный форум сцены. Tidal, но 90%
  приёмов переносится в Strudel один в один (`lpf`/`lpenv`/`lpsync` те же).
  Ищи по словам `reese`, `wobble`, `lfo`, `sustain`.
- https://codeberg.org/uzu/strudel — исходники (не GitHub, репа переехала).
  Issues — фактически второй форум; там же отвечают мейнтейнеры.
- https://tidalcycles.org/docs/ — доки Tidal, полезны для понимания концепций
  (cycle, event, control pattern), даже если пишешь на JS.

## Код людей

Switch Angel (алгорейв, пишет на Tidal и Strudel, много видео):

- https://www.youtube.com/@switchangel — видео, код обычно на экране
- https://github.com/switchangel/strudel-scripts — её кастомные функции
  (`prebake.strudel`). Оттуда взяты рецепты ниже.
- https://github.com/switchangel/breaks — брейки, которые она правил
- https://github.com/switchangel/beginningtrance — сэмплы из видео

Её два рецепта баса (из `prebake.strudel`), если не хочется изобретать:

```js
// "acid": сустейн-бас с резонансным фильтром
pat.s('supersaw').detune(.5).unison(1).lpf(100)
   .lpsustain(0.2).lpd(.2).lpenv(2).lpq(12)

// "protobass": волновой бас, LFO синхронный с тактом
s("wt_ana:1").unison(5).wtsync(1.2).detune(rand.mul(1.5))
  .lpsync("[3 16] 8").lpdepth(5).lpq(0).fm(1.4).fmh(2.04).lpskew(rand)
```

## Что я выяснил по исходникам (не по докам)

Фильтровый LFO — `packages/superdough/helpers.mjs`, функция `createFilter`:

| контрол | что делает |
|---|---|
| `lpf(f)` | базовый срез, Гц |
| `lpdepth(k)` | глубина LFO = **k × f** (множитель, не герцы) |
| `lpdepthfrequency(hz)` | то же, но в герцах |
| `lpsync(n)` | `rate = cps × n` → n качков **на такт** |
| `lprate(hz)` | то же, но в герцах (не синхронно с тактом) |
| `lpdc(0)` | униполярно: LFO только открывает фильтр вверх (по умолчанию `-0.5`, качает в обе стороны) |
| `lpenv(n)` | огибающая фильтра в **октавах**: `2**n × f` |
| `lpa/lpd/lpsustain` | атака/спад/сустейн этой огибающей |
| `ftype("24db")` | два каскада биквадов — круче и толще |
| `ftype("ladder")` | ворклет-лестница, у неё есть `drive` |

Порядок в звуке: огибающая пишет в `filter.frequency`, LFO-нода **прибавляется**
к тому же параметру. Поэтому `lpenv` даёт «ВУ» на атаке, а LFO — «УУУ-УУУ» поверх.

`penv` / `panchor` / `pattack` / `pdecay` / `psustain` / `pcurve` в
`@strudel/core` 1.2.6 есть и работают (см. README, «Грабли движка»).
`glide` — не встроенная функция, а регистр из `09-dark-acid-v2.js` /
Switch Angel: он считает интервал от предыдущей ноты и пишет `penv`.

## Даб-техно

- `docs/dub-techno/README.md` — плейбук: характер, гармония, звук, микс,
  чек-лист следующего трека.
- `docs/dub-techno/sources.md` — внешние гайды, канон для наслушанности,
  что именно из них взято.
- `tracks/techno/18-khmer-dub.js` — 122 BPM dub techno + 30 Khmer percussion channels, Fm9→Gbmaj9.
- `docs/dub-techno/strudel-recipes.md` — готовые куски: аккорды, саб ≤80,
  стаб в дилее, пэд, хэты, режимы, аудиты.
- Живые примеры: `tracks/techno/16-minimal-dub.js` (120 BPM),
  `tracks/techno/17-halfstep-dub.js` / `-v2` (104 BPM, Burial-leaning).

## IDM

- `docs/idm/README.md` — характер, карта инструментов, переключатели, пэды,
  сцены, как играть, гейты.
- `docs/idm/01-techniques.md` — глитч, грануляр, микро-события, 8 бит,
  эйсид, шершавый бас, барабаны, «мало реверба».
- `docs/idm/02-arrangement.md` — темп, форма, тёмная/атональная гармония,
  антипоп, рандом под контролем, микс, перформанс.
- `docs/idm/03-strudel.md` — `chop`/`slice`/`striate`/`splice`, `glide`,
  `seg`, пэды, бюджеты CPU и грабли 1.2.6.
- `docs/idm/04-sources.md` — источники и что именно взято.
- Живой пример: `tracks/idm/01-splinter.js` (136 BPM, glitch/granular).

## Кхмерская музыка

- `docs/khmer/README.md` — характер, карта пинпета, переключатели, пэды
  (01) и mutes (02), сцены, как играть, гейты.
- `docs/khmer/01-instruments.md` — roneat ek/thung/dek, kong vong/thom,
  sralai, sampho (ting/tip/theung/tup), skor thom (tight/loose),
  chhing, krap; малый и большой составы.
- `docs/khmer/02-tuning-rhythm.md` — семь тонов ~171 цент, пятитоновый
  скелет, 12-TET-приближения, колотомия, Sathukar, боксёрская музыка.
- `docs/khmer/03-strudel.md` — синтез, сэмплы VSCO/Dirt, `seg(1/8)`,
  сцены-ритмы, `@mutes`, бюджеты CPU, грабли 1.2.6 (`.add(slider)`).
- `docs/khmer/04-sources.md` — Wikipedia, UMBC/Sam-Ang Sam, UNESCO,
  Garzoli, Garland; что взято, а что адаптировано.
- `docs/khmer/05-samples.md` — какие реальные сэмплы есть, чего нет,
  как подставить локальные записи.
- Живые примеры: `tracks/khmer/01-sathukar.js` (88 BPM, синтез),
  `tracks/khmer/02-skors.js` (96 BPM, реальные сэмплы, сцены-ритмы,
  mute-кнопки, без пэдов), `tracks/khmer/03-skors-ritual.js`
  (76 BPM, только ударные, без высоких мелодических линий),
  `tracks/khmer/04-confluence.js` (108 BPM, микс 01–03, 12 ритмов,
  acid bass/arp с `pace`).

Сэмплы:

- VSCO 2 CE (CC0) — xylo, marimba, gong, claves:
  https://github.com/sgossner/VSCO-2-CE
- Dirt-Samples — east (тайко/woodblock), hand, tabla, metal:
  https://github.com/tidalcycles/Dirt-Samples
- Roneat Studio Pro — приложение для roneat ek; в репозитории
  mock/dummy сэмплы, не банк: https://github.com/Vagabond404/Roneat-Studio-Pro
- Sounds of Angkor — видео/фото инструментов, не one-shots:
  https://soundsofangkor.org/

Ключевые внешние источники:

- https://en.wikipedia.org/wiki/Music_of_Cambodia
- https://en.wikipedia.org/wiki/Pinpeat
- https://en.wikipedia.org/wiki/Roneat
- https://en.wikipedia.org/wiki/Samphor
- https://en.wikipedia.org/wiki/Sralai
- https://en.wikipedia.org/wiki/Ching_(instrument)
- https://en.wikipedia.org/wiki/Skor_thom
- https://www.umbc.edu/eol/cambodia/histcmus.htm
- https://www.umbc.edu/eol/cambodia/pinpeat.htm
- https://www2.umbc.edu/eol/cambodia/scale.htm
- https://unesdoc.unesco.org/ark:/48223/pf0000135257
- https://iftawm.org/journal/oldsite/articles/2015b/Garzoli_AAWM_Vol_4_2.pdf
