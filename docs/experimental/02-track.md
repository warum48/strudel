# Трек 01 · Complex Bass

`tracks/experimental/01-complex-bass.js` — 160 BPM, 18 дорожек, 206 слайдеров.
Задача: **шершавый жир на басу**, без «мультяшных» вейвтейблов.

## 1. Пары

| # | WT | FM | Орбита | Роль |
|---|---|---|---|---|
| 1 | `wt_dbass` | sine | 7 | суб, D1 |
| 2 | `wt_distorted` | sawtooth | 7 | грязь, D1/F1 |
| 3 | `wt_ebass` | square | 7 | тело, G1/D1 |
| 4 | `wt_raw` | triangle | 7 | верхняя грязь, A1/C2 |
| 5 | `wt_bitreduced` | sine (октавой выше) | 7 | скрим, D2/F2/G2 |

Для каждой пары:

- WT-слой: `.wt(lfo * posDepth + pos)`, `.warp(lfo * warpDepth + warp)`,
  `lpf/res`, `shape`, `decay`.
- FM-слой: `.fm(index + lfo * indexMod) * fmMode`, `.fmh(ratio)`,
  `lpf/res`, `shape`, `slide`, `.orbit(7)`.
- LFO — `sine.range(0,1).fast(rate)`, управляет и WT, и FM.

Все 10 басов живут на орбите 7, а бочка дакает эту орбиту через
`duckorbit(7)` — честный сайдчейн, а не LFO-пила. Это не аудио-рейт FM;
связанность пары даёт общий рисунок и общий bus.

## 2. Риффы

12 переключаемых риффов: `acid`, `roll`, `dnb`, `prod`, `off`, `oct`,
`stair`, `two`, `pedal`, `stab`, `skip`, `crawl`.
Все 10 осцилляторов играют один и тот же `RIFF`; `riff` 0…11 меняет
рисунок, не тембр. FM5 — то же самое октавой выше. Подробно: `05-riffs.md`.

У каждого баса есть свой `pace` 4…32 (16 = 1×, 4 = замедление в 4 раза,
32 = ускорение в 2 раза): `note(RIFF).fast(pace.fmap(p => p / 16))`.
Пейсы независимы — басы могут разъехаться по фазе, это намеренно.

## 3. Ноты и строй

- Низ: D1/F1/G1/A1/C2/D2/F2/G2.
- `@roots d d d d d d d d`, `@dark`: тритоны D–Ab намеренные.
- `PAD_A` = D2–A2 (low), `PAD_B` = D2–Ab3 (axis); drone латчится на 8 тактов.
- Никаких мажорных трезвучий и «красивых» каденций.

## 4. Режимы

| mode | Что делает |
|---|---|
| 0 CLEAN | хэты на слабую (оффбит), 4-в-пол; минимальный grit |
| 1 GRIT | 8-е хэты, 4-в-пол; основной грязный бас |
| 2 FOLD | ломаные 16-е хэты; больше warp/shape |
| 3 SCREAM | хардкорные 16-е хэты; бочка на 4-й доле каждого 2-го такта |

`mode` меняет рисунок бочки (16/16/16/2 за 4 такта), хэтов (16/32/40/52),
`grit`/`fmMode` и плотность air (4/12/24/28). Поэтому `modes` видит разницу.

## 5. Ручки

- WT: `oct pace vol pos posDepth warp warpDepth cut res shape decay pan echo room`.
- FM: `oct pace vol ratio index indexMod cut res shape decay pan echo room slide`.
- LFO: `rate`.
- Drone: `vol cut det room`.
- Dirt: `crackle` / `air` — vol/cut.
- FX: `fx.dub.delaySend/delayTime/delayFeedback`, глобальные `verb/verbSize`.
- `mode` / `harmony` — переключатели.
- `riff` 0…11; M/S у 17 каналов MIXER; G у 15 (WT/FM/drone), цвета по группам
  `muteWT/muteFM/muteDrone`.

## 6. Kick / hats / sidechain

`bd*4` — ровно на каждый бит; `shape` + `distort` + `lpf` 280 + `sub`-тело.
Хеты: `hh` 16-ми и `oh` на оффбитах, `shape`/`hpf` для хардкора.
`sidechain` (0…1) — `duckorbit(7)` на бочке: реальный дакинг всех басов,
depth = `sidechain`, attack 0.02.

`bd*4` — ровно на каждый бит. `shape` + `distort` + `lpf` 280 дают хардкор;
`sub`-слой на тех же долях добавляет тело. Ручки: `drums.kick.vol/cut/shape/
dist/decay/tune`, `drums.kickSub.vol/cut/decay/tune`; G-группа `muteKick`.

## 7. Гейты

- `verify` — 18 дорожек, 106 ударов/такт, 206 слайдеров.
- `tension` — трения нет; 37 намеренных тритонов.
- `modes` — air 4/12/24/28; FM/WT меняют тембр.
- `latch` — такт 8.
- `gains` — тихо; `doubles` — без наложений.
- `cpu` — 112 worklet/такт (75/с).
- `live` — eval ок, паттерн играет.
