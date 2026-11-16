# Checklist

## Done
- [x] techno/12-slowtrap-v3.js — structure from 11, tree instruments, audible gate
- [x] techno/13-gabber-v3.js — 08/09 in the 12 structure
- [x] techno/14-acid-jazz.js — 90 BPM acid jazz, TIA, partials pads
- [x] techno/15-house-rave.js — 120 BPM jazz house / rave; arp pace 8/16/32
- [x] dnb/01-atmospheric-jungle.js — 174 BPM Bukem / Aphrodite
- [x] dnb/02-dark-techstep.js — 172 BPM dark jungle / techstep / IDM
- [x] dnb/02-dark-techstep-v2.js — long grinder variants + chop/granular layer
- [x] techno/16-minimal-dub.js — 120 BPM anti-pop dub techno, sub ≤80, echo stab
- [x] techno/17-halfstep-dub.js — 104 BPM Burial-leaning halfstep dub, vowel pad, sub ≤80 + growl, sparse Moog
- [x] techno/17-halfstep-dub-v2.js — v2: separate `Moog note` (low velvet d3/a2/bb2, octave −2…2) + full Moog/arp UI controls (attack/decay/sustain/release, shape, LFO, echo, room, slide, pace 4–16), pad.fb; v1 untouched
- [x] tracks/idm/01-splinter.js — 136 BPM glitch/granular IDM: C–Gb–Db–Bb, 33 tracks, 193 sliders, 8 switches (incl. `grainSrc`, `voxMode`), 6 pads, 8 drum modes (4–7 use every layer), `mutate`/`fill` rhythm macros, grain cloud/scan/freeze/edit with a moving padlong/space/wind/noise2 bank and pitch −24…+12, 8-bit pulse/square + arp, 303 glide (default run), `numbers` voice, sub ≤80 + growl + FM rubber, little reverb
- [x] tracks/khmer/01-sathukar.js — 88 BPM pinpeat/percussion: 27 tracks, 83 sliders, 3 switches (`scene`/`mode`/`harmony`), 6 pads, 7-tone scale c–db–eb–f–gb–ab–bb + 5-tone skeleton, roneat ek/thung, kong vong/thom, sralai, skor thom, sampho, chhing, krap, 4 modes (sathukar/pinpeat/boxing/percussion), no samples
- [x] tracks/khmer/02-skors.js — 96 BPM percussion/xylophones: 16 tracks, 86 sliders, real Dirt-Samples + VSCO 2 CE (CC0), scenes change rhythm only, `// @mutes` row under scenes, no pads, no sralai
- [x] tracks/khmer/03-skors-ritual.js — 76 BPM percussion + low xylophone: 11 tracks, 58 sliders, skor high .33, sampho low .34/high .28/ghost .23, chhing .23/open .21, krap .19, fills .18, kong thom .22, roneat low .24; low xylo only, no high xylo/sralai, rhythm-only scenes, mutes, fifth/axis gong, no pads
- [x] tracks/khmer/04-confluence.js — 108 BPM mix of 01–03: 16 tracks, 79 sliders, 12 rhythm scenes, percussion/gongs without melodic xylophones, acid bass + arp with `pace`, verb up to 1.2, verbSize up to 16, mutes, no pads
- [x] tracks/techno/18-khmer-dub.js — 122 BPM dub techno + Khmer percussion: 19 tracks (30 perc channels in one bus), 187 sliders, Fm9→Abmaj9→Dbmaj9→Gbmaj9, full dub set + Moog lead/arp, all 30 Khmer drums through shared delay/reverb, mutes, no pads
- [x] Web panel: `// @mutes` row (ordinary 0/1 buttons under scenes, not momentary)
- [x] docs/khmer/ — README + instruments + tuning/rhythm + Strudel + sources + samples (RU + EN)
- [x] README index + per-track notes for khmer/01
- [x] docs/idm/ — README + techniques + arrangement + Strudel + sources (RU + EN)
- [x] idm/01 `@scenes.theme` mirrors `dumps/idm-01-splinter-2026-11-15-20-13-18.json` (193 keys)
- [x] README index + per-track notes for idm/01
- [x] Web panel: pads keys 1–9 (idm/01 uses 6)
- [x] Web panel: DOWNLOAD SAMPLES button with live status
- [x] Web panel: Scenes/JSON bar (Intro/Theme from `// @scenes`, Export/Import JSON), static `STRUDEL EXTENSION` title
- [x] `docs/dub-techno/` — extracted playbook, sources and Strudel recipes from `docs/thoughts/dub_session.md`
- [x] README index and track notes
- [x] Audits: verify, tension, modes, latch, gains, doubles, cpu, live
- [x] Project memory bank

## Todo
- [x] `tracks/breakcore/01-rinse.js` — 174 BPM rinse / note-off, scenes + banks + momentary pads
- [x] Web panel: `// @pads` momentary pads (press/hold → 1, release → 0, keys 1..4), no MIDI
- [x] `docs/breakcore/10-panel.md` (+ `.en.md`) — how to play switches and pads
- [x] `tracks/breakcore/02-stems-hardcore.js` — 200 BPM stems/gabber, 3-layer kick, kick clean/dist/hard, 5 modes, 4 pads
- [x] `tracks/breakcore/01-rinse-slices.js` — second rinse version (16th fragments, no pitch shift); 01-rinse.js kept
- [x] docs/breakcore/04 §12 — fat gabber kick research (clean sub + band-limited saturation)
