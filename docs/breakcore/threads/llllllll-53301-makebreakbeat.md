# makebreakbeat

- source: https://llllllll.co/t/53301
- host: llllllll.co
- posts in topic: 57
- posts captured: 40

> Auto-extracted for offline reading. Formatting is flattened; links kept as `text (url)`.

---

### #1 · infinitedigits · 2022-03-04

(#p-537216-makebreakbeat-1)makebreakbeat

make break beats.

[image]

this script is a wrapper for another script I wrote (https://github.com/schollz/dnb.lua/) that generates breakbeats from a drum sample. I made this to learn more about sox (http://sox.sourceforge.net/) and aubio (https://aubio.org/) as all the audio is generated with those tools.

https://www.instagram.com/p/Car87BZFJ74/

 (#p-537216-requirements-2)Requirements

norns

 (#p-537216-documentation-3)Documentation

press K2 to generate beat

press K3 to toggle playing

use any E to change sample

to “break” a beat, this script first determines the tempo of the input file. it then determines onsets based on the tempo (minimum distance being sixteenth notes) and splits the input file into slices by onset markers. it then takes each slice and manipulates the slice with effects with some probability. the manipulated slice is then appended to an audio file at a position quantized to the desired tempo (set by norns clock). all the effect probabilities are available to modify in the parameters.

deviation (https://github.com/schollz/makebreakbeat/blob/a81972cd0b642a5efa309b46867e8bc090bb4957/lib/dnb.lua#L546-L548): probability of deviating from base pattern (0-100%)

reverse (https://github.com/schollz/makebreakbeat/blob/a81972cd0b642a5efa309b46867e8bc090bb4957/lib/dnb.lua#L611): probability of reversing (0-100%)

stutter (https://github.com/schollz/makebreakbeat/blob/a81972cd0b642a5efa309b46867e8bc090bb4957/lib/dnb.lua#L292-L330): probability of stutter (with random volume/pitch ramps) (0-100%)

pitch (https://github.com/schollz/makebreakbeat/blob/a81972cd0b642a5efa309b46867e8bc090bb4957/lib/dnb.lua#L595): probability of pitch up (0-100%)

trunc (https://github.com/schollz/makebreakbeat/blob/a81972cd0b642a5efa309b46867e8bc090bb4957/lib/dnb.lua#L333-L346): probability of truncation (0-100%)

half (https://github.com/schollz/makebreakbeat/blob/a81972cd0b642a5efa309b46867e8bc090bb4957/lib/dnb.lua#L603): probability of slow down (0-100%)

reverb (https://github.com/schollz/makebreakbeat/blob/a81972cd0b642a5efa309b46867e8bc090bb4957/lib/dnb.lua#L655): probability of adding reverb tail to kick/snare (0-100%)

stretch (https://github.com/schollz/makebreakbeat/blob/a81972cd0b642a5efa309b46867e8bc090bb4957/lib/dnb.lua#L281-L290): probability of stretching audio (0-100%)

kick (https://github.com/schollz/makebreakbeat/blob/a81972cd0b642a5efa309b46867e8bc090bb4957/lib/dnb.lua#L577): probability of snapping a kick to down beat (0-100%)

snare (https://github.com/schollz/makebreakbeat/blob/a81972cd0b642a5efa309b46867e8bc090bb4957/lib/dnb.lua#L586): probability of snapping a snare to down beat (0-100%)

kick db:  volume of added kick in dB (-96-0 dB)

snare db:  volume of added snare in dB (-96-0 dB))

all the resulting audio files are automatically put into the ~/dust/audio/makebreakbeat folder.

 (#p-537216-notes-4)notes

this script generates beats slowly. to get around this I suggest generating short beats (8-16 beats) continuously (beats continue to play when generating).

 (#p-537216-run-on-any-linuxmac-computer-5)run on any linux/mac computer

you don’t need norns to run this script. simply install lua, sox and aubioonset on your computer. (for mac this might involve using brew install aubio-tools sox lua5.3). (for linux this involves doing apt install aubio-tools sox lua5.3). then clone the repo and run:

git clone https://github.com/schollz/makebreakbeat
cd makebreakbeat/lib
./dnb.lua -o 174_3.wav -b 64 -i amen_resampled.wav -trunc 0 -stutter 30 -kick 10 -deviation 10 --snare 10 --reverse 10 --pitch 10 --kick-mix -6 --snare-mix -6 --reverb 5 --stretch 1 --half 1 --trunc 10 --tempo 174 --input-tempo 174 --bassline

 (#p-537216-install-6)Install

install with

;install https://github.com/schollz/makebreakbeat

once you start the script for the first time it will install aubio and sox (~5 MB total).

---

### #2 · lleicamun · 2022-03-04

I will never stop to thank you for your commitment to the script cause :grinning_face_with_smiling_eyes:, I bet this give you a lot of happiness and it gives us true happiness for sure.

And, when i see an app like that (eg. Amen, Beets..), which give me the chance to make break beats and stuttering, I’m always so excited as I started making electronic music to achieve that kind of style, even if with Norns I started knowing the “looper wave” and started thinking a lil bit more in these terms.

Which differences this script has compared to Amen for example? I’m asking this before trying the app of course, so the question is more related to your “needs” of making it.

I loved the concept of Amen and the fact that I can use a controller like grid which I love, but I never been able to use it perfectly in sync or quantized to my movements actually.

As always, my hopes for a grid UI are big,  but right now, I’m going to install this beauty!

Thanks again!

---

### #3 · Cementimental · 2022-03-04

Looks great! another thing to add to my list of breakcore tools that I never actually manage to make any music with haha

---

### #4 · infinitedigits · 2022-03-04

[image] lleicamun:

Which differences this script has compared to Amen for example?

to be honest I just wanted to play with sox and see if I could challenge myself to make generative music out of that little tool. I ended up with dnb.lua (https://github.com/schollz/dnb.lua/) which can generate breakbeats and even dnb-style basslines. it was fun little project but since I mainly use norns for music stuff I figured I’d put it into a norns script so I can easily access it.

but on another level - this script using “sox” which (mainly) manipulates audio files vs amen which uses SuperCollider that mainly manipulates audio streams. in practice it was easier to implement some cool things using files versus streams. for example: adding reverb to a sound and then reversing it. this is hard to do in SuperCollider (you’d have to render it to a buffer in between, somehow) but its very easy to do with a file-based tool like sox.

---

### #5 · lleicamun · 2022-03-04

Ok, this make sense, I don’t know Sox at all actually, but it’s very clear what you told me.

Talking again about a grid interface (which is clearly my personal obsession) watching the demo, i think is correct to think about this eventuality as redundant, as it seems more like a super nice generative tool to create stuttering loops with a touch of a button ahah..

---

### #6 · TanSaturn · 2022-03-04

This looks really cool, but I’m getting an issue where the progress bar doesn’t move at all. Maiden just says ‘resetting’ over and over again. I tried reinstalling and power cycling a few times, but no dice. Anyone got any ideas?

---

### #7 · infinitedigits · 2022-03-04

can you capture the maiden output when you first turn it on? it might be getting stuck adding some dependencies.

also whats norns? (fates/gray box/ shield)?

---

### #8 · vehka · 2022-03-04

I had the same issue, updated my norns (or actually fates) to the latest version, and now it works. The beats are amazing, yet another gem @infinitedigits (/u/infinitedigits)! Can’t wait to try it with my own loops…

---

### #9 · TanSaturn · 2022-03-04

I’m running on a Fates. Norns is up to date.

I just did a reinstall and reboot and got these results…

First it worked with the supplied amen_resampled.wav Yay!

Then I tried a different wav file and got a syntax error that I think has to do with the parenthesis in the file name.

Then I tried a different file and got some sox Fails and AUBIO errors.

pset >> write: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset
lua /home/we/dust/code/makebreakbeat/lib/dnb.lua --no-logo --snare-file /home/we/dust/code/makebreakbeat/lib/snare.wav --kick-file /home/we/dust/code/makebreakbeat/lib/kick.wav  -t 175 -b 9 -o /home/we/dust/audio/makebreakbeat/175_1.wav  -i /home/we/dust/audio/makebreakbeat/amen_resampled.wav --deviation 10 --reverse 10 --stutter 20 --pitch 5 --trunc 2 --half 1 --reverb 5 --stretch 2 --kick 50 --snare 20 --snare-mix  -6 --kick-mix  -6 &
running command!
found 14 onsets
resetting
filename: /tmp/breaktemp-a9hP6gU5.wav
sample rate: 48000
channels: 2
tempo: 177 bpm
resetting
generated 9 beats into '/home/we/dust/audio/makebreakbeat/175_1.wav' @ 175 bpm
resetting
resetting
resetting
resetting
resetting
resetting
pset >> write: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset
lua /home/we/dust/code/makebreakbeat/lib/dnb.lua --no-logo --snare-file /home/we/dust/code/makebreakbeat/lib/snare.wav --kick-file /home/we/dust/code/makebreakbeat/lib/kick.wav  -t 175 -b 9 -o /home/we/dust/audio/makebreakbeat/175_3.wav  -i /home/we/dust/audio/makebreakbeat/5th Dimension - Rainmaker (part1).wav --deviation 10 --reverse 10 --stutter 20 --pitch 5 --trunc 2 --half 1 --reverb 5 --stretch 2 --kick 50 --snare 20 --snare-mix  -6 --kick-mix  -6 &
sh: 1: Syntax error: "(" unexpected
running command!
resetting
resetting
resetting
resetting
pset >> write: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset
lua /home/we/dust/code/makebreakbeat/lib/dnb.lua --no-logo --snare-file /home/we/dust/code/makebreakbeat/lib/snare.wav --kick-file /home/we/dust/code/makebreakbeat/lib/kick.wav  -t 175 -b 9 -o /home/we/dust/audio/makebreakbeat/175_3.wav  -i /home/we/dust/audio/makebreakbeat/20th Century - Hot Pants.wav --deviation 10 --reverse 10 --stutter 20 --pitch 5 --trunc 2 --half 1 --reverb 5 --stretch 2 --kick 50 --snare 20 --snare-mix  -6 --kick-mix  -6 &
running command!
sox FAIL formats: can't open input file `/home/we/dust/audio/makebreakbeat/20th': No such file or directory
sox FAIL formats: can't open input file `/home/we/dust/audio/makebreakbeat/20th': No such file or directory
sox FAIL formats: can't open input file `/home/we/dust/audio/makebreakbeat/20th': No such file or directory
AUBIO ERROR: source_sndfile: Failed opening /tmp/breaktemp-gSVYWgHI.wav (System error : No such file or directory.)
AUBIO ERROR: source_wavread: Failed opening /tmp/breaktemp-gSVYWgHI.wav (No such file or directory)
Error: could not open input file /tmp/breaktemp-gSVYWgHI.wav
lua: /home/we/dust/code/makebreakbeat/lib/dnb.lua:33: attempt to perform arithmetic on local 'number' (a nil value)
stack traceback:
	/home/we/dust/code/makebreakbeat/lib/dnb.lua:33: in function </home/we/dust/code/makebreakbeat/lib/dnb.lua:29>
	(tail call): ?
	/home/we/dust/code/makebreakbeat/lib/dnb.lua:398: in function 'new'
	/home/we/dust/code/makebreakbeat/lib/dnb.lua:986: in main chunk
	[C]: ?
resetting
resetting

I also found that I can get the amen sample working again if I re-select it and delete breaktemp-progress from /tmp.

Fuuuuuuuuck. This script is so cool!

---

### #10 · moogah · 2022-03-04

Daaaaaamn this gives me a wild idea of making a plugin or extension for the ranger file manager (https://github.com/ranger/ranger) (written in python) where it can “preview” audio files by having Aubio analyze and “chop” it into relevant slices and then use SoX to scrub/navigate through the slices… and then trim/process any interesting bits into a new file.. and .. and

Crap this gives me ideas!  Thanks for sharing :smiley:

Edit: holy crap this might be a big deal Aubio and youtube_dl play nicely together, which could mean that needing to actually download files in order to look for interesting slices might just be obsolete for me aubio : /20171004-1234_online_songs.html (https://aubio.org/news/20171004-1234_online_songs.html)

---

### #11 · Ukasz · 2022-03-04

Many thanks as always! Can’t wait to put some non-drum samples into it =]

---

### #12 · infinitedigits · 2022-03-04

[image] TanSaturn:

Then I tried a different wav file and got a syntax error that I think has to do with the parenthesis in the file name.

whooops! yeah that looks to be a bug. glad you figured it out, I can put a fix on that.

[image] moogah:

where it can “preview” audio files by having Aubio analyze and “chop” it into relevant slices and then use SoX to scrub/navigate through the slices… and then trim/process any interesting bits into a new file… and … and

that sounds very cool…like file ranger as a daw :slight_smile: aubioonsets gives really pretty good onset detection and once they are split into little units it gives a lot of interesting ways to play.

what I really like about sox though is its ability to splice audio. it allows you to specify a “leeway” which is used with a “wave similarity comparison” to best determine the best place to join:

      length1   excess
    -----------><--->
    _________   :   :  _________________
             \  :   : :\     ‘
              \ :   : : \     ‘
               \:   : :  \     ‘
                *   : :   * - - *
                 \  : :   :\     ‘
                  \ : :   : \     ‘
    _______________\: :   :  \_____‘____
                      :   :   :     :
                      <--->   <----->
                      excess  leeway

not only that, but it will crossfade the two clips (the “excess”) so it can very easily make great “cuts”. this is basically the basis of makebreakbeat.

happy to shoot around ideas if you have. I’ve been digging into sox a lot so its at the forefront of my head right now lol.

[image] Ukasz:

Can’t wait to put some non-drum samples into it

this can give some wild things. here’s the Michael Jackson one I made:

---

### #13 · TanSaturn · 2022-03-05

Nice! I also discovered that the other issue I was having was being caused by spaces in the file names of the samples I was using. Not sure if that is just a limitation or not.

---

### #14 · moogah · 2022-03-05

sounds like a typical annoyance with unix file systems, it’ll try to read each individual word as a new file and it causes weird error messages.

---

### #15 · rebuspop · 2022-03-05

looks and sounds great but am getting this error in maiden:

Summary
 (#p-537405-script-clear-1)script clear

 (#p-537405-script-load-homewedustcodemakebreakbeatmakebreakbeatlua-2)script load: /home/we/dust/code/makebreakbeat/makebreakbeat.lua

 (#p-537405-script-run-3)script run

loading engine: Makebreakbeat

reading PMAP /home/we/dust/data/makebreakbeat/makebreakbeat.pmap

m.read: /home/we/dust/data/makebreakbeat/makebreakbeat.pmap not read.

Engine.register_commands; count: 5

___ engine commands ___

amp f

load_track s

lpf f

lpfqr f

tozero

___ polls ___

amp_in_l

amp_in_r

amp_out_l

amp_out_r

cpu_avg

cpu_peak

pitch_in_l

pitch_in_r

 (#p-537405-script-init-4)script init

resetting

pset >> read: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset

E

:

Failed to fetch https://mirrors.switch.ca/raspbian/raspbian/pool/main/libg/libgsm/libgsm1_1.0.13-4_armhf.deb server certificate verification failed. CAfile: /etc/ssl/certs/ca-certificates.crt CRLfile: none

E

: Failed to fetch https://mirrors.switch.ca/raspbian/raspbian/pool/main/o/opencore-amr/libopencore-amrwb0_0.1.3-2.1_armhf.deb server certificate verification failed. CAfile: /etc/ssl/certs/ca-certificates.crt CRLfile: none

E: Failed to fetch http://raspbian.raspberrypi.org/raspbian/pool/main/w/wavpack/libwavpack1_5.0.0-2+deb9u2_armhf.deb 404 Not Found [IP: 2a00:1098:0:80:1000:75:0:3 80]

E: Unable to fetch some archives, maybe run apt-get update or try with --fix-missing?

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

---

### #16 · infinitedigits · 2022-03-05

[image] rebuspop:

looks and sounds great but am getting this error in maiden:

what kind of norns are you on? (fates/grey box/shield)?

---

### #17 · rebuspop · 2022-03-05

Shield #200323 w sw upd 220129

---

### #18 · infinitedigits · 2022-03-05

can you try running

os.execute("sudo apt-get update")

through maiden and try again?

edit: and if that doesn’t work - I just built sox that is portable and should work on any norns. you can install it using this command from maiden:

os.execute("cd /tmp && wget https://github.com/schollz/makebreakbeat/releases/download/v0.1.0/sox && chmod +x sox && sudo mv sox /usr/local/bin/")

---

### #19 · rebuspop · 2022-03-05

Ok. did the sudo apt-get and had this response:

Summary
new script

matron

supercollider

os.execute(“sudo apt-get update”)

Get:1 Index of /raspbian (http://raspbian.raspberrypi.org/raspbian) stretch InRelease [15.0 kB]

Get:2 Index of /debian (http://archive.raspberrypi.org/debian) stretch InRelease [25.3 kB]

Ign:3 https://package.monome.org (https://package.monome.org/) stretch InRelease

Get:4 Index of /raspbian (http://raspbian.raspberrypi.org/raspbian) stretch/main armhf Packages [11.7 MB]

Err:5 https://package.monome.org (https://package.monome.org/) stretch Release

server certificate verification failed. CAfile: /etc/ssl/certs/ca-certificates.crt CRLfile: none

Get:6 Index of /debian (http://archive.raspberrypi.org/debian) stretch/main armhf Packages [192 kB]

Get:7 Index of /debian (http://archive.raspberrypi.org/debian) stretch/ui armhf Packages [44.6 kB]

Reading package lists…

E

: The repository ‘https://package.monome.org (https://package.monome.org/) stretch Release’ does no longer have a Release file.

nil exit 100

then did the second command and got this at the end:

Summary
100%

10.8M

=0.4s

2022-03-05 20:50:13 (6.46 MB/s) - ‘sox’ saved [2638064/2638064]

true exit 0

Restarted and got this again

Summary
resetting

resetting

 (#p-537499-script-clear-1)script clear

 (#p-537499-script-clear-2)script clear

lua:

/home/we/norns/lua/core/clock.lua:59: bad argument #1 to ‘resume’ (thread expected)

stack traceback:

[C]: in function ‘coroutine.resume’

/home/we/norns/lua/core/clock.lua:59: in function ‘core/clock.resume’

lua: /home/we/norns/lua/core/clock.lua:59: bad argument #1 to ‘resume’ (thread expected)

stack traceback:

[C]: in function ‘coroutine.resume’

/home/we/norns/lua/core/clock.lua:59: in function ‘core/clock.resume’

 (#p-537499-script-clear-3)script clear

 (#p-537499-script-load-homewedustcodemakebreakbeatmakebreakbeatlua-4)script load: /home/we/dust/code/makebreakbeat/makebreakbeat.lua

 (#p-537499-script-run-5)script run

loading engine: Makebreakbeat

reading PMAP /home/we/dust/data/makebreakbeat/makebreakbeat.pmap

m.read: /home/we/dust/data/makebreakbeat/makebreakbeat.pmap not read.

Engine.register_commands; count: 5

___ engine commands ___

amp f

load_track s

lpf f

lpfqr f

tozero

___ polls ___

amp_in_l

amp_in_r

amp_out_l

amp_out_r

cpu_avg

cpu_peak

pitch_in_l

pitch_in_r

 (#p-537499-script-init-6)script init

resetting

pset >> read: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset

resetting

resetting

Should I try and remove the pset? Thought maybe it was because no Amen installed, but did that

again and still loops back into resetting, resetting etc. Will admit that have been having off behaviour with the Shield since the last system update, probably Knob Goblins.

---

### #20 · eequeue · 2022-03-05

I pretty much the exact same results just now :slight_smile:

---

### #21 · infinitedigits · 2022-03-05

@eequeue (/u/eequeue) and @rebuspop (/u/rebuspop) I think I fixed it. can you try updating makebreakbeat and run again? I think the problem was that the previous workload didn’t get cleared on script start (I assumed it was already cleared, which is not the case when things go wrong). it also will fallback to the statically-built sox installation automatically now.

---

### #22 · eequeue · 2022-03-05

Thanks so much for your help with this! This is what I’m getting now with an update and restart:

Blockquote pset >> read: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset

pset >> write: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset

lua /home/we/dust/code/makebreakbeat/lib/dnb.lua --no-logo --snare-file /home/we/dust/code/makebreakbeat/lib/snare.wav --kick-file /home/we/dust/code/makebreakbeat/lib/kick.wav  -t 90 -b 17 -o /home/we/dust/audio/makebreakbeat/90_1.wav  -i /home/we/dust/audio/makebreakbeat/amen_resampled.wav --deviation 10 --reverse 10 --stutter 20 --pitch 5 --trunc 2 --half 1 --reverb 5 --stretch 2 --kick 50 --snare 20 --snare-mix  -6 --kick-mix  -6 &

running command!

aubioonset: error while loading shared libraries: libaubio.so.5: cannot open shared object file: No such file or directory

lua:

/home/we/dust/code/makebreakbeat/lib/dnb.lua:33: attempt to perform arithmetic on local ‘number’ (a nil value)

stack traceback:

/home/we/dust/code/makebreakbeat/lib/dnb.lua:33: in function </home/we/dust/code/makebreakbeat/lib/dnb.lua:29>

(tail call): ?

/home/we/dust/code/makebreakbeat/lib/dnb.lua:398: in function ‘new’

/home/we/dust/code/makebreakbeat/lib/dnb.lua:986: in main chunk

[C]: ?

resetting

resetting

resetting

---

### #23 · infinitedigits · 2022-03-05

can you remind me which norns (if you already said)?

its weird that  its breaking on aubioonset since that should have been compiled directly. can you run the following in maiden:

os.execute("cd /tmp/ && git clone https://github.com/aubio/aubio && cd aubio && sed -i 's/curl -so/curl -k -so/g' scripts/get_waf.sh && ./scripts/get_waf.sh && ./waf configure && ./waf build && sudo ./waf install && cd /tmp && rm -rf aubio")

when it finishes it should say:

...
...
/tmp/aubio/build/tests/test-pitch
/tmp/aubio/build/tests/test-mathutils-window
tests that fail 0/52
'install' finished successfully (3.903s)
true	exit	0

if it doesn’t say that, could you copy and paste it again?

---

### #24 · eequeue · 2022-03-05

can you remind me which norns (if you already said)?

Ah yeah, I don’t think I did; sorry about that. Shield the most recent updates.

So, I ran the command above with the expected result and here’s what I got:

pset >> read: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset

pset >> write: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset

lua /home/we/dust/code/makebreakbeat/lib/dnb.lua --no-logo --snare-file /home/we/dust/code/makebreakbeat/lib/snare.wav --kick-file /home/we/dust/code/makebreakbeat/lib/kick.wav -t 90 -b 17 -o /home/we/dust/audio/makebreakbeat/90_1.wav -i /home/we/dust/audio/makebreakbeat/amen_resampled.wav --deviation 10 --reverse 10 --stutter 20 --pitch 5 --trunc 2 --half 1 --reverb 5 --stretch 2 --kick 50 --snare 20 --snare-mix -6 --kick-mix -6 &

running command!

aubioonset: error while loading shared libraries: libaubio.so.5: cannot open shared object file: No such file or directory

lua: /home/we/dust/code/makebreakbeat/lib/dnb.lua:33: attempt to perform arithmetic on local ‘number’ (a nil value)

stack traceback:

/home/we/dust/code/makebreakbeat/lib/dnb.lua:33: in function </home/we/dust/code/makebreakbeat/lib/dnb.lua:29>

(tail call): ?

/home/we/dust/code/makebreakbeat/lib/dnb.lua:398: in function ‘new’

/home/we/dust/code/makebreakbeat/lib/dnb.lua:986: in main chunk

[C]: ?

---

### #25 · rebuspop · 2022-03-05

Still getting the resetting loop, there must be a dependency on something that is not

installed, I did recently swap out SD card and put a clean system and didn’t reinstall all the accumulated

scripts.

Here is the maiden output:

Summary
 (#p-537627-script-clear-1)script clear

 (#p-537627-script-load-homewedustcodemakebreakbeatmakebreakbeatlua-2)script load: /home/we/dust/code/makebreakbeat/makebreakbeat.lua

pset last used: 1

 (#p-537627-script-run-3)script run

loading engine: Makebreakbeat

reading PMAP /home/we/dust/data/makebreakbeat/makebreakbeat.pmap

Engine.register_commands; count: 5

___ engine commands ___

amp f

load_track s

lpf f

lpfqr f

tozero

___ polls ___

amp_in_l

amp_in_r

amp_out_l

amp_out_r

cpu_avg

cpu_peak

pitch_in_l

pitch_in_r

 (#p-537627-script-init-4)script init

v0.0.2

resetting

pset >> read: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset

resetting

resetting

resetting

resetting

pset >> write: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset

lua /home/we/dust/code/makebreakbeat/lib/dnb.lua --no-logo --snare-file /home/we/dust/code/makebreakbeat/lib/snare.wav --kick-file /home/we/dust/code/makebreakbeat/lib/kick.wav -t 120 -b 17 -o /home/we/dust/audio/makebreakbeat/120_1.wav -i /home/we/dust/audio/amen/amenbreak_bpm136.wav --deviation 10 --reverse 10 --stutter 20 --pitch 5 --trunc 2 --half 1 --reverb 5 --stretch 2 --kick 50 --snare 20 --snare-mix -6 --kick-mix -6 &

running command!

aubioonset: error while loading shared libraries: libaubio.so.5: cannot open shared object file: No such file or directory

lua: /home/we/dust/code/makebreakbeat/lib/dnb.lua:33: attempt to perform arithmetic on local ‘number’ (a nil value)

stack traceback:

/home/we/dust/code/makebreakbeat/lib/dnb.lua:33: in function </home/we/dust/code/makebreakbeat/lib/dnb.lua:29>

(tail call): ?

/home/we/dust/code/makebreakbeat/lib/dnb.lua:398: in function ‘new’

/home/we/dust/code/makebreakbeat/lib/dnb.lua:986: in main chunk

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

 (#p-537627-script-clear-5)script clear

 (#p-537627-script-clear-6)script clear

 (#p-537627-script-load-homewedustcodemakebreakbeatmakebreakbeatlua-7)script load: /home/we/dust/code/makebreakbeat/makebreakbeat.lua

pset last used: 1

 (#p-537627-script-run-8)script run

loading engine: Makebreakbeat

reading PMAP /home/we/dust/data/makebreakbeat/makebreakbeat.pmap

Engine.register_commands; count: 5

___ engine commands ___

amp f

load_track s

lpf f

lpfqr f

tozero

___ polls ___

amp_in_l

amp_in_r

amp_out_l

amp_out_r

cpu_avg

cpu_peak

pitch_in_l

pitch_in_r

 (#p-537627-script-init-9)script init

v0.0.2

resetting

pset >> read: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset

resetting

resetting

resetting

resetting

This is after update and another attempt to install ‘aubioonset’ w url above

---

### #26 · infinitedigits · 2022-03-05

okay @rebuspop (/u/rebuspop) and @eequeue (/u/eequeue) my guess is that you both have two aubioonset commands and one of them is now corrupted? so try this.

run this command from maiden remove aubioonset:

os.execute("sudo rm $(which aubioonset)")

run this command to 100% definitely install aubioonset (make sure maiden says "'install' finished successfully" when its done):

os.execute("cd /tmp/ && git clone https://github.com/aubio/aubio && cd aubio && sed -i 's/curl -so/curl -k -so/g' scripts/get_waf.sh && ./scripts/get_waf.sh && ./waf configure && ./waf build && sudo ./waf install && cd /tmp && rm -rf aubio")

restart your norns (just for posterity sake)

try running makebreakbeat again.

---

### #27 · rvense · 2022-03-05

Just for reference, that’s not the filesystem, it’s the shell. The shell breaks things up on any kind whitespace by default:

$ ls -1
'hest hest )) ko (('
'the quick brown fox'
$ for f in `ls -1`; do { echo $f; } done
hest
hest
))
ko
((
the
quick
brown
fox

But you can tell it otherwise by setting the variable IFS (internal field separator). Here I set it to a line break to parse the output of ls in a more predictable way:

$ export IFS="
> "
$ for f in `ls -1`; do { echo $f; } done
hest hest )) ko ((
the quick brown fox

You can set it to anything you like, of course, even a letter or ,.

---

### #28 · infinitedigits · 2022-03-05

that was also my bad. using filenames with spaces should be fixed now. the problem was that I wrote my argument handling from scratch in lua and forgot to handle those special cases where an argument has two+ space separated entities (in case of filenames with spaces).

---

### #29 · rvense · 2022-03-06

This is one of the things everyone has to relearn every once in a while. Like how it’s not just the soldering iron that gets hot, but also the things you touch with it :slight_smile:

---

### #30 · rebuspop · 2022-03-06

sadly, still the same ‘error’/result for me:

Summary
 (#p-537663-script-clear-1)script clear

 (#p-537663-script-load-homewedustcodemakebreakbeatmakebreakbeatlua-2)script load: /home/we/dust/code/makebreakbeat/makebreakbeat.lua

pset last used: 1

 (#p-537663-script-run-3)script run

loading engine: Makebreakbeat

reading PMAP /home/we/dust/data/makebreakbeat/makebreakbeat.pmap

Engine.register_commands; count: 5

___ engine commands ___

amp f

load_track s

lpf f

lpfqr f

tozero

___ polls ___

amp_in_l

amp_in_r

amp_out_l

amp_out_r

cpu_avg

cpu_peak

pitch_in_l

pitch_in_r

 (#p-537663-script-init-4)script init

v1.0.0

resetting

pset >> read: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset

pset >> write: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset

lua /home/we/dust/code/makebreakbeat/lib/dnb.lua --no-logo --snare-file /home/we/dust/code/makebreakbeat/lib/snare.wav --kick-file /home/we/dust/code/makebreakbeat/lib/kick.wav -t 90 -b 17 -o /home/we/dust/audio/makebreakbeat/90_1.wav -i /home/we/dust/audio/amen/amenbreak_bpm136.wav --deviation 10 --reverse 10 --stutter 20 --pitch 5 --trunc 2 --half 1 --reverb 5 --stretch 2 --kick 50 --snare 20 --snare-mix -6 --kick-mix -6 &

running command!

aubioonset: error while loading shared libraries: libaubio.so.5: cannot open shared object file: No such file or directory

lua: /home/we/dust/code/makebreakbeat/lib/dnb.lua:38: attempt to perform arithmetic on local ‘number’ (a nil value)

stack traceback:

/home/we/dust/code/makebreakbeat/lib/dnb.lua:38: in function </home/we/dust/code/makebreakbeat/lib/dnb.lua:34>

(tail call): ?

/home/we/dust/code/makebreakbeat/lib/dnb.lua:403: in function ‘new’

/home/we/dust/code/makebreakbeat/lib/dnb.lua:1018: in main chunk

resetting

resetting

resetting

resetting

I tried with the original wav file and with the one from Amen, just to see if it would load as an alternate, but think that is not relevant.

---

### #31 · infinitedigits · 2022-03-06

I’m pretty perplexed. I can’t seem to reproduce theproblem but I do know of at least three people with this problem. another guess is that aubio-tools is installed in some problematic order (I tried some ordering and couldn’t reproduce the error still). so maybe try this:

os.execute("sudo apt-get purge -y libaubio-dev aubio-tools")

that command will remove libaubio and aubio-tools if it was installed via apt. makebreakbeat should be installing it from source, so this is the only way (I can think of) that there can be a collision.

---

### #32 · rebuspop · 2022-03-06

[image] infinitedigits:

os.execute("cd /tmp && wget https://github.com/schollz/makebreakbeat/releases/download/v0.1.0/sox && chmod +x sox && sudo mv sox /usr/local/bin/")

Summary
 (#p-537771-script-load-homewedustcodemakebreakbeatmakebreakbeatlua-1)script load: /home/we/dust/code/makebreakbeat/makebreakbeat.lua

pset last used: 1

 (#p-537771-script-run-2)script run

loading engine: Makebreakbeat

reading PMAP /home/we/dust/data/makebreakbeat/makebreakbeat.pmap

Engine.register_commands; count: 5

___ engine commands ___

amp f

load_track s

lpf f

lpfqr f

tozero

___ polls ___

amp_in_l

amp_in_r

amp_out_l

amp_out_r

cpu_avg

cpu_peak

pitch_in_l

pitch_in_r

 (#p-537771-script-init-3)script init

v1.0.0

resetting

pset >> read: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset

pset >> write: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset

lua /home/we/dust/code/makebreakbeat/lib/dnb.lua --no-logo --snare-file /home/we/dust/code/makebreakbeat/lib/snare.wav --kick-file /home/we/dust/code/makebreakbeat/lib/kick.wav -t 90 -b 17 -o /home/we/dust/audio/makebreakbeat/90_1.wav -i /home/we/dust/audio/amen/amenbreak_bpm136.wav --deviation 10 --reverse 10 --stutter 20 --pitch 5 --trunc 2 --half 1 --reverb 5 --stretch 2 --kick 50 --snare 20 --snare-mix -6 --kick-mix -6 &

running command!

aubioonset: error while loading shared libraries: libaubio.so.5: cannot open shared object file: No such file or directory

lua: /home/we/dust/code/makebreakbeat/lib/dnb.lua:38: attempt to perform arithmetic on local ‘number’ (a nil value)

stack traceback:

/home/we/dust/code/makebreakbeat/lib/dnb.lua:38: in function </home/we/dust/code/makebreakbeat/lib/dnb.lua:34>

(tail call): ?

/home/we/dust/code/makebreakbeat/lib/dnb.lua:403: in function ‘new’

/home/we/dust/code/makebreakbeat/lib/dnb.lua:1018: in main chunk

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

 (#p-537771-script-clear-4)script clear

 (#p-537771-script-clear-5)script clear

 (#p-537771-script-load-homewedustcodemakebreakbeatmakebreakbeatlua-6)script load: /home/we/dust/code/makebreakbeat/makebreakbeat.lua

pset last used: 1

 (#p-537771-script-run-7)script run

loading engine: Makebreakbeat

reading PMAP /home/we/dust/data/makebreakbeat/makebreakbeat.pmap

Engine.register_commands; count: 5

___ engine commands ___

amp f

load_track s

lpf f

lpfqr f

tozero

___ polls ___

amp_in_l

amp_in_r

amp_out_l

amp_out_r

cpu_avg

cpu_peak

pitch_in_l

pitch_in_r

 (#p-537771-script-init-8)script init

v1.0.0

resetting

pset >> read: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset

pset >> write: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset

lua /home/we/dust/code/makebreakbeat/lib/dnb.lua --no-logo --snare-file /home/we/dust/code/makebreakbeat/lib/snare.wav --kick-file /home/we/dust/code/makebreakbeat/lib/kick.wav -t 90 -b 17 -o /home/we/dust/audio/makebreakbeat/90_1.wav -i /home/we/dust/audio/amen/amenbreak_bpm136.wav --deviation 10 --reverse 10 --stutter 20 --pitch 5 --trunc 2 --half 1 --reverb 5 --stretch 2 --kick 50 --snare 20 --snare-mix -6 --kick-mix -6 &

running command!

aubioonset: error while loading shared libraries: libaubio.so.5: cannot open shared object file: No such file or directory

lua: /home/we/dust/code/makebreakbeat/lib/dnb.lua:38: attempt to perform arithmetic on local ‘number’ (a nil value)

stack traceback:

/home/we/dust/code/makebreakbeat/lib/dnb.lua:38: in function </home/we/dust/code/makebreakbeat/lib/dnb.lua:34>

(tail call): ?

/home/we/dust/code/makebreakbeat/lib/dnb.lua:403: in function ‘new’

/home/we/dust/code/makebreakbeat/lib/dnb.lua:1018: in main chunk

resetting

resetting

resetting

resetting

resetting

resetting

Still gives the above error.

Here is the maiden response when applying it:

Summary
os.execute(“sudo apt-get purge -y libaubio-dev aubio-tools”)

Reading package lists…

Building dependency tree…

Reading state information…

Package ‘aubio-tools’ is not installed, so not removed

Package ‘libaubio-dev’ is not installed, so not removed

0 upgraded, 0 newly installed, 0 to remove and 218 not upgraded.

true exit 0

---

### #33 · HalfMajesty · 2022-03-08

I’ve got a factory Norns and even after a few shots at updating, un/reinstalling, I can open the script, but freezes up when trying to load the amen wav (which I verified is in the directory on my Norns).

Any ideas?

Thanks!!

---

### #34 · infinitedigits · 2022-03-08

[image] HalfMajesty:

Any ideas?

can you see if there is any output in maiden? anything is helpful.

[image] rebuspop:

aubioonset: error while loading shared libraries: libaubio.so.5: cannot open shared object file: No such file or directory

I have no clue about this error. between you and other folk I’ve suggested many things but no avail. I’ve tried a lot and cannot reproduce this unfortunately

---

### #35 · GoneCaving · 2022-03-08

Factory Norns, with the latest updates applied. I’m getting the following in Maiden (I didn’t quite catch all of the install triggered from Maiden ):

Summary
gpg: directory ‘/home/we/.gnupg’ created

gpg: keybox ‘/home/we/.gnupg/pubring.kbx’ created

gpg: /home/we/.gnupg/trustdb.gpg: trustdb created

gpg: key 22BE0C62FFBFA548: public key “Thomas Nagy <tnagy@waf.io (mailto:tnagy@waf.io)>” imported

resetting

gpg: Total number processed: 1

gpg: imported: 1

gpg: assuming signed data in ‘waf-2.0.23.tar.bz2’

gpg: Signature made Wed 15 Dec 2021 08:05:03 AM +07

gpg: using RSA key 0B3972B2D9E32EAB423D2E0F22BE0C62FFBFA548

gpg: Good signature from “Thomas Nagy <tnagy@waf.io (mailto:tnagy@waf.io)>” [unknown]

gpg: WARNING: This key is not certified with a trusted signature!

gpg: There is no indication that the signature belongs to the owner.

Primary key fingerprint: 0B39 72B2 D9E3 2EAB 423D 2E0F 22BE 0C62 FFBF A548

------> Executing code from the top-level wscript <-----

Configuring the project

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

pset >> write: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset

lua /home/we/dust/code/makebreakbeat/lib/dnb.lua --no-logo --snare-file /home/we/dust/code/makebreakbeat/lib/snare.wav --kick-file /home/we/dust/code/makebreakbeat/lib/kick.wav -t 120 -b 17 -o /home/we/dust/audio/makebreakbeat/120_1.wav -i /home/we/dust/audio/makebreakbeat/amen_resampled.wav --deviation 10 --reverse 10 --stutter 20 --pitch 5 --trunc 2 --half 1 --reverb 5 --stretch 2 --kick 50 --snare 20 --snare-mix -6 --kick-mix -6 &

running command!

aubioonset: error while loading shared libraries: libaubio.so.5: cannot open shared object file: No such file or directory

lua: /home/we/dust/code/makebreakbeat/lib/dnb.lua:39: attempt to perform arithmetic on local ‘number’ (a nil value)

stack traceback:

/home/we/dust/code/makebreakbeat/lib/dnb.lua:39: in function </home/we/dust/code/makebreakbeat/lib/dnb.lua:35>

(tail call): ?

/home/we/dust/code/makebreakbeat/lib/dnb.lua:404: in function ‘new’

/home/we/dust/code/makebreakbeat/lib/dnb.lua:1031: in main chunk

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

resetting

---

### #36 · HalfMajesty · 2022-03-09

This looks to be the Maiden output:

pset >> read: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset

pset >> write: /home/we/dust/data/makebreakbeat/makebreakbeat-01.pset

lua /home/we/dust/code/makebreakbeat/lib/dnb.lua --no-logo --snare-file /home/we/dust/code/makebreakbeat/lib/snare.wav --kick-file /home/we/dust/code/makebreakbeat/lib/kick.wav -t 10 -b 17 -o /home/we/dust/audio/makebreakbeat/10_1.wav -i /home/we/dust/audio/makebreakbeat/amen_resampled.wav --deviation 10 --reverse 10 --stutter 20 --pitch 5 --trunc 2 --half 1 --reverb 5 --stretch 2 --kick 50 --snare 20 --snare-mix -6 --kick-mix -6 &

running command!

aubioonset: error while loading shared libraries: libaubio.so.5: cannot open shared object file: No such file or directory

lua: /home/we/dust/code/makebreakbeat/lib/dnb.lua:39: attempt to perform arithmetic on local ‘number’ (a nil value)

stack traceback:

/home/we/dust/code/makebreakbeat/lib/dnb.lua:39: in function </home/we/dust/code/makebreakbeat/lib/dnb.lua:35>

(tail call): ?

/home/we/dust/code/makebreakbeat/lib/dnb.lua:404: in function ‘new’

/home/we/dust/code/makebreakbeat/lib/dnb.lua:1031: in main chunk

[C]: ?

resetting

resetting

resetting

resetting

---

### #37 · infinitedigits · 2022-03-09

can you update? I pushed a fix about 2 hours ago that should’ve fixed it. if it works i’ll make a official release

---

### #38 · HalfMajesty · 2022-03-09

Thanks! It seems to be working now! So excited to play with this. :slight_smile:

Quick question edit, it seems to be stuck playing something suuuuuuuuuper slowly. Altering parameters and reloading doesn’t seem to have an effect. Probably user error, but wanted to flag in case I’m just missing something. Thanks again!

---

### #39 · infinitedigits · 2022-03-09

whats your internal clock tempo? the resulting beats are clocked to that beat. the other possible scenario is that the wrong bpm was determined for the sample

---

### #40 · HalfMajesty · 2022-03-09

Looks like it was initally set to 10(?!), which is bizarre. I bumped it up to 88 and now it’s hanging up on the loading screen again.

---
