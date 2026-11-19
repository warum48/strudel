# Experimental · Complex Bass

Новая серия: треки, где звук строится не «осциллятор → фильтр», а как у
Баклы — сложный осциллятор, FM/AM, waveshaping и парная модуляция.

Трек: `tracks/experimental/01-complex-bass.js` — 160 BPM, жирный шершавый
бас, без «мультяшных» тембров.

> **Честно.** В Strudel вейвтейбл — сэмпловый источник. Его нельзя
> аудио-рейт FM-ить другим слоем. Настоящая cross-mod — внутри FM-голоса
> (carrier + modulator). У вейвтейблов — `wt`/`warp` + амплитудное
> ducking от FM-партнёра. Это осознанная адаптация, а не Buchla-реконструкция.

## 5 пар = 10 осцилляторов

| Пара | Wavetable | FM-партнёр | Роль |
|---|---|---|---|
| 1 | `wt_dbass` | sine | низкий суб |
| 2 | `wt_distorted` | sawtooth | середина, грязь |
| 3 | `wt_ebass` | square | ответ, тело |
| 4 | `wt_raw` | triangle | верхняя грязь |
| 5 | `wt_bitreduced` | sine | скрим, обертоны |

Плюс 5 управляющих LFO, hardcore kick `bd*4` с `sub`-телом, хеты, sidechain, низкий drone
и два слоя dirt. Всего 18 дорожек, 206 слайдеров.

## Как играть

1. `npm run web` → `tracks/experimental/01-complex-bass.js`.
2. Выбери рифф ручкой `riff` 0…11 (`acid / roll / dnb / prod / off / oct /
   stair / two / pedal / stab / skip / crawl`).
3. `mode 0` — хэты ровно на слабую (оффбит) и 4-в-пол; `mode 3` — хардкорные 16-е и бочка на 4-й доле каждого 2-го такта.
4. Панель стартует с **vol 0 + M on** у всех; подними громкость и сними M у 1–2 инструментов.
5. Бочка `bd` по режиму уже на каждом бите; `drums.kick.dist/shape` — характер.
6. Начни с `mode 0 CLEAN` или `mode 1 GRIT`; `mode 3 SCREAM` — на кульминации.
7. `mode 0 CLEAN` — почти без waveshaping, `mode 2 FOLD` — больше warp.
8. `harmony 1 AXIS` — drone D–Ab, `0 LOW` — D–A.
9. В MIXER у WT/FM/drone есть `M/S`, у WT/FM/drone — цветной `G`
   (групповой mute). Верхний `@mutes` скрыт: G его заменяет.
10. Крути `wt.wtN.pos/warp`, `fm.fmN.index/indexMod`, `cut/res`,
   `shape`, `pace`, `decay`.

## Гейты

`verify` — 18 дорожек / 206 слайдеров / 106 ударов на такт.
`tension` — трения нет (37 намеренных тритонов под `@dark`).
`modes` — kick 16/16/16/2, hats 16/32/40/52.
`latch` — такт 8.
`gains` — тихо, `doubles` — наложений нет, `cpu` — 112 worklet/такт
(75/с), `live` — eval ок.

## Документы

- `01-buchla.md` — как работает Buchla / West Coast.
- `02-track.md` — карта трека и ручки.
- `03-strudel.md` — рецепты и грабли.
- `04-sources.md` — источники.
- `05-riffs.md` — как делаются acid-риффы и 12 риффов трека.

EN: те же файлы с `.en.md`.
