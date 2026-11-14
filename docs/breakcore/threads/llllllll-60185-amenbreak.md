# amenbreak

- source: https://llllllll.co/t/60185
- host: llllllll.co
- posts in topic: 149
- posts captured: 40

> Auto-extracted for offline reading. Formatting is flattened; links kept as `text (url)`.

---

### #1 · infinitedigits · 2022-12-17

(#p-609477-amenbreak-1)amenbreak

[image]

this is a dedicated amen break script for norns. with 2 knobs - amen and break (plus more stuff). thanks @scanner_darkly (/u/scanner_darkly) for the inspiration :star:


    [image]
   (https://www.youtube.com/watch?v=ZbV8A3CWqr0)


    [image]
   (https://www.youtube.com/watch?v=Im8riBR7_lU)


    [image]
   (https://www.youtube.com/watch?v=8h3KSgyc4Gk)

 (#p-609477-requirements-2)Requirements

norns

at least 150MB of disk space

 (#p-609477-documentation-3)Documentation

[image]

 (#p-609477-quickstart-4)quickstart

E2 amens, E3 breaks.

 (#p-609477-features-5)features

over 200 amen break samples (from internet archive (https://archive.org/details/amen-breaks-compilation)), loaded into memory for instant playback

automatic stutter/stretch/delay effects (amen+break)

overdrive/decimate/degrade control (punch)

kick drum added to bolster kicks of pre-analyzed samples

edit mode allows manipulating individual slices/kick volume

all effects are determined by probabilities with sweet spots controlled by many different easing functions (https://www.desmos.com/calculator/3mmmijzncm) (thanks to @dewb (/u/dewb) for pointing this out)

(with grid) bass engine w/ keyboard+sequencer, looped/one-shot sample player

 (#p-609477-controls-6)controls

there are two modes - performance and editor.

in performance mode:

K1 switches to edit mode

K2 switches parameters

K3 stops/starts

E1 changes volume

E2 changes amen/track

E3 changes break/punch

in edit mode:

K1 switches to performance

K2 select slice

K3 auditions slice

E1 changes kick

E2 zooms

E3 jogs slice

f*** it:

any two keys

 (#p-609477-grid-7)Grid

[image]

the fx region of the grid has the following effects in order, left-to-right and top to bottom: stretch, change volume, change pitch, delay, reverse, gate, tape stop, filter, mute

if you are using the sample player you can only sync them if they have bpm in the title. for example, my_sound_bpm120.wav will process it as a 120-bpm sample. upon loading, amenbreak stretches the sample to keep the same pitch but match the current tempo. note: this only works when loading, so be careful when using samples and changing tempo.

 (#p-609477-install-8)Install

please note that the first time you run it will say “loading…” for awhile while it downloads the samples.

install with

;install https://github.com/schollz/amenbreak

https://github.com/schollz/amenbreak

---

### #2 · appa · 2022-12-17

Oh now this is exciting! Can’t wait to give this a wiggle. Thanks!!!

---

### #3 · xmacex · 2022-12-17

Nice, i just spent all day today with Abacus (https://llllllll.co/t/abacus/37871) and the amen break. I might spend the evening with this haha :slight_smile: Give me a break.

PS. Sweet breakcore demo!!

---

### #4 · Cementimental · 2022-12-17

haha this is incredible, thanks !!!

---

### #5 · rebuspop · 2022-12-18

another gem, most fun

---

### #6 · kasselvania · 2022-12-18

This is rad. I’m so excited to play with this! Thank you!

---

### #7 · infinitedigits · 2022-12-23

thanks everyone for the kind words. this script was a lot of fun to make and builds on all the things I’ve been learning.

 (#p-610752-v110-built-in-tape-emulation-1)v1.1.0 - built-in tape emulation

integrated tapedeck (https://github.com/schollz/tapedeck) in the PARAMS > TAPE menu

added tape stop as an effect

add sidechaining for incoming audio

fix random mistakes

break breaks even more

instead of putting tapedeck on a norns at the end of the chain, I just went ahead and added tapedeck to the audio output for amenbreak. things can get even more distorted/gritty if you choose. also there’s tape effects (tape stops, slow downs).

---

### #8 · xmacex · 2022-12-23

I’m am re-living my youth of listening to drum and bass mixtapes loud on walkmans and cheap headphones.

---

### #9 · dtm · 2022-12-29

This is so much fun! Breaks for dayzzzz!

Is there a way to reset the break to the beginning of the loop after a tape stop?

---

### #10 · kasselvania · 2022-12-29

To piggyback off of this; a start/stop/reset function, both through physical key input on the Norns AND through midi would make this an amazing companion piece to other gear but is tough to pair otherwise.

---

### #11 · appa · 2022-12-29

Really good idea! How difficult will it be, though…

---

### #12 · kasselvania · 2022-12-29

The beauty of not being able to code is I can just blankly and coldly list out ideas that excite me, with little consideration, beyond common courtesy, for the difficulty in implementation.

[image]

Hopefully it’s something that could actually work tho! I tried paring this script with a Tenori-on for some ambient DnB and sadly, because of the sync issues, it was a no go.

Fingers crossed!

---

### #13 · aeoner · 2022-12-31

Thank you very much for this script, @infinitedigits (/u/infinitedigits). As I told you before, it’s very inspiring and a game changer for an amen break :folded_hands:t3::drum: freak like me :slight_smile: I’m using it everyday :sparkles:

What I need to do to load my own breaks? Basically record/edit them 160 bpm and save in the folder?

---

### #14 · infinitedigits · 2023-01-03

[image] xmacex:

mixtapes loud on walkmans and cheap headphones.

love this !!!

[image] aeoner:

What I need to do to load my own breaks? Basically record/edit them 160 bpm and save in the folder?

you should just be able to load them in by opening them up via the load sample in the PARAMS menu! I didn’t add automatic spicing in this script, so you’ll have to edit the splices yourself. if you do know the bpm you can put the bpm in the filename, like file_bpm160.wav so that it will automatically detect it and keep it in sync. also if you want the splicing to be as easy as possible, you can make sure the loop is a specific number of beats and add that into the filename as well. like file_beats4_bpm160.wav - this example should be 1.5 seconds long and it will then splice perfectly across it.

[image] kasselvania:

a start/stop/reset function, both through physical key input on the Norns AND through midi

hm! I added a midi start/stop function. I never tested it though so maybe its not working…I’ll take a look!

[image] dtm:

Is there a way to reset the break to the beginning of the loop after a tape stop?

yeah that’s a good idea! that can be added.

in general, speaking of break manipulations, I’m adding in grid support that will enable lots more manipulations of the break…

---

### #15 · kasselvania · 2023-01-03

I think the start and stop may be in there, but a reset function isn’t, I don’t think? That was my main issue, is that even if I paused it, it was hard to sync things up.

---

### #16 · McNUG · 2023-01-03

[image] infinitedigits:

grid support that will enable lots more manipulations of the break…

Humble request for 64 grid compatiblity since you’re tackling grid support.

Amenbreak is a triumph as is, thank you for continuing to make awesome tools for the community.

---

### #17 · infinitedigits · 2023-01-09

(#p-614420-v120-grid-support-audio-outputs-1)v1.2.0 grid support + audio outputs

added grid!

added waveshaping (somewhat similar to ableton’s saturator (https://ableton-production.imgix.net/manual/en/Saturator.png?auto=compress%2Cformat&w=716)) (PARAMS > AUDIO OUT > saturate wave folder)

added compress/expand curves (from Ezra’s Pirate radio code (https://github.com/norns-study-group/pirate-radio/blame/159ac8d17df0935db8b53e3acaa1d7764da8aa21/supercollider/classes/PirateRadio.sc#L792-L809)) (PARAMS >AUDIO OUT > compress|expand...)

added noise gate (PARAMS >AUDIO OUT > noise gate...)

better cpu usage for tape emulation

auto tape stops are optional (PARAMS > AUDIO OUT > tape auto)

fixed initializing clock (no more lag)

grid outline:

[image]

demo (the 8th row has some special stuff which I’m not quite done with):


    [image]
   (https://www.youtube.com/watch?v=GNHCCfG6_TY)

[image] kasselvania:

that even if I paused it, it was hard to sync things up.

turns out I had a bug where the clock wasn’t started until ~30 ms after pressing start. that should be fixed now and it should stay in sync!

[image] McNUG:

Humble request for 64 grid compatiblity since you’re tackling grid support.

totally 64 grid compatible! not sure about monobright, I think it will work…

---

### #18 · saiiils · 2023-01-09

This script just gets crazier and crazier and I’m here for all of it!

---

### #20 · Dewb · 2023-01-09

Gah, I had a lot of fun jamming with your undocumented prototype grid support, and this looks even better! Kudos for the consistent delight!

---

### #21 · ruaridhTVO · 2023-01-09

this is the most fun I’ve add in WEEKS. Amazing stuff

---

### #22 · Medenine · 2023-01-10

This is too much fun. Amazing!!!

---

### #23 · ReallyRad · 2023-01-10

I can’t believe what I’m seeing! I have no idea what I’m doing and yet I’m loving it. You’re making it wayyyy to easy! Also how did you fit so many samples in so little space, :rofl:

---

### #24 · Cementimental · 2023-01-10

sounding incredible, can’t wait to update and have a go

---

### #25 · jonsimon · 2023-01-10

awesome!!! thanks so much for this!

---

### #26 · ReallyRad · 2023-01-11

I feel like this could spawn a whole new generation of live jungle acts.

Please add some dub siren sounds :sob:


      [image]

      Instagram (https://www.instagram.com/stories/artypye/3013567995311507681?igshid=YmMyMTA2M2Y%3D)



    [image]

Instagram (https://www.instagram.com/stories/artypye/3013567995311507681?igshid=YmMyMTA2M2Y%3D)

  Create an account or log in to Instagram - Share what you're into with the people who get you.










            [image]

---

### #27 · infinitedigits · 2023-01-15

(#p-615673-v130-synced-samples-bass-updated-grid-1)v1.3.0 - synced samples, bass, updated grid

NEW: add “gate” button and fx

FIX: better filter slewing

NEW: add samples (load samples by putting them in audio/amenbreak/row[1|2|3|4|5] folder

NEW: add bass mini keyboard and bass engine and bass sequencer

FIX: removed compressor at end of chain (you can still use the norns built-in one)

FIX: reduced cpu-usage slightly

[image]

the fx region of the grid has the following effects in order, left-to-right and top to bottom: last played, change volume, change pitch, delay, reverse, gate, tape stop, filter, mute. these can be combined with any of the retriggers section…

there is also a sample player now (you can add siren sounds @ReallyRad (/u/reallyrad) !). if you are using the sample player you can only sync them if they have bpm in the title. for example, my_sound_bpm120.wav will process it as a 120-bpm sample. upon loading, amenbreak stretches the sample to keep the same pitch but match the current tempo. note: this only works when loading, so be careful when using samples and changing tempo. if you don’t care about tempo-syncing, then just don’t put the bpm in the title and it won’t sync.

demo:


    [image]
   (https://www.youtube.com/watch?v=8h3KSgyc4Gk)

---

### #28 · saiiils · 2023-01-15

Insane, can’t wait to try it out!

---

### #29 · ReallyRad · 2023-01-15

So good! God my dubsirens loaded!!

wub wub wub

Also would be interested in adding your gross beat implementation to some other scripts.

EDIT : I think I found 2 bugs

On my second row of samples, after a few on/off triggers, one of the samples would keep playing in a loop even if it was disabled

the filter sweep effect sometimes doesn’t go back to it’s initial 0, so all drums samples sound muffled. I also noticed a delay when controlling the LP filter with midi, dunno why that is.

---

### #30 · infinitedigits · 2023-01-16

[image] ReallyRad:

God my dubsirens loaded!!

[image] [image] [image]

[image] ReallyRad:

I think I found 2 bugs

thanks! I am aware of the first bug (its happened to me once but I still can’t quite reproduce it to figure out what it was). the second one is new, I will check that out too.

---

### #31 · Prophane · 2023-01-16

Tried as many options as I could think of, but I still just get a black screen when loading the script. Latest Norns firmware. It did the same with the previous version of AMEN BREAK btw… Is there something else I have to install for it to work? Is only says “loading” for a second and goes dark.

---

### #32 · infinitedigits · 2023-01-16

[image] Prophane:

but I still just get a black screen when loading the script.

could you drop the system.log here? here’s how to gather the log (https://monome.org/docs/norns/help/#logs).

---

### #33 · Prophane · 2023-01-16

Ok found the system log file but it’s too big to post here (42.9MB).

here is a link to the log : https://wetransfer.com/downloads/d86b4c2828377738ad354c585a49246c20230116161317/26bad26f38a1b4bfad39d035e29a1cb320230116161406/32f1e7 (https://wetransfer.com/downloads/d86b4c2828377738ad354c585a49246c20230116161317/26bad26f38a1b4bfad39d035e29a1cb320230116161406/32f1e7?trk=TRN_TDL_01&utm_campaign=TRN_TDL_01&utm_medium=email&utm_source=sendgrid)

---

### #34 · infinitedigits · 2023-01-16

can you try this:

copy paste this command into maiden:

os.execute("journalctl --output=with-unit --boot=-1 >> ~/dust/data/system.log && curl -s --upload-file /home/we/dust/data/system.log https://share.schollz.com/")

that will copy the log and upload it to a website so you don’t have to dump it here. it will output something after its done (see below), just copy that down and paste it here so I can view it.

[image]image1553×120 23.6 KB
 (https://llllllll.co/uploads/default/399a2d36d53c2f3eb9e06f83a03e978c81a7e6d6)

edit: I see you just posted log :slight_smile: will look now

---

### #35 · infinitedigits · 2023-01-16

okay its because you have no samples…the default samples failed to download. can you try this: delete the amenbreak data folder and then try running it again?

you can do this from maiden:

os.execute("cd ~/dust/data && rm -rf amenbreak")

then restart and try again. on restarting it will automatically download the samples.

---

### #36 · Prophane · 2023-01-16

It’s happening, the script is working now. AMAZING, again. Thank you so much for being so responsive and giving your time away to dummies like me :wink:

---

### #37 · infinitedigits · 2023-01-16

yayyy! have fun, no problem :slight_smile: there are no dumb questions.

---

### #38 · infinitedigits · 2023-01-16

(#p-615929-v140-slightly-better-stretching-hpf-1)v1.4.0 - slightly better stretching + hpf

NEW added high-pass filter (PARAMS > hpf)

NEW improved stretching

FIX added back the patterns for amen,break, and drum selection (row 2, columns 6, 7, and 8 respectively)

FIX Better method of detecting existing plugin by @sixolet (/u/sixolet) in Better method of detecting existing plugin by sixolet · Pull Request #8 · schollz/amenbreak · GitHub (https://github.com/schollz/amenbreak/pull/8) (:pray: )

realize it is only one day since the last release, but I had some more free time this morning to tinker…so previously the “stretching effect” was just a sample of a stretched audio that was constantly re-used. I updated the code so that the stretching audio is of the current track (after a small delay to process the track. the processing is debounced so it won’t take up much cpu). this gives a much more accurate stretching. also this made way for removing some dead code so that slightly less cpu is used. overall this is better, although it seems to have introduced a least one more bug where the stretched audio is occasionally silent towards the end of the duration of the slice…not sure why this is occurring and it happens so seldomly I can’t quite debug it properly.  haven’t found fixes for the other bugs yet.

I updated the grid graphic to be more clear:

[image]

---

### #39 · Klangschmied · 2023-01-17

Installed today, 17.01.2023 via

;install https://github.com/schollz/amenbreak

but the version shows v1.3.1 not 1.4 on noirns

---

### #40 · ReallyRad · 2023-01-17

20 char of same here.

---

### #41 · infinitedigits · 2023-01-17

[image] Klangschmied:

but the version shows v1.3.1 not 1.4 on noirns

[image] ReallyRad:

20 char of same here.

thanks! I only forgot to change that text “v1.3.1” to “v1.4.0”, they are the same. I fixed it now, but v1.3.1 is the same as v1.4.0 for all purposes

---
