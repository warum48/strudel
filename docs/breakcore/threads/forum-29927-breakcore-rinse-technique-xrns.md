# Breakcore Rinse Technique Xrns

- source: https://forum.renoise.com/t/29927
- host: forum.renoise.com
- posts in topic: 38
- posts captured: 38

> Auto-extracted for offline reading. Formatting is flattened; links kept as `text (url)`.

---

### #1 · ericneilj · 2010-09-19

these are the techniques i’ve used most frequently over the years. feel free to add!

for fast breaks to sound intelligible (whatever that means, just sounded right), you’ve gotta use note offs. i use it in a ridiculously simple way: always put a note-off before the next sample and usually keep a break rinse limited to one column. by using note offs, the punctuated bits of silence (milliseconds or less) are in time with the bpm. it’s arguably below conscious perceptibility, though it’s a beautiful thought to know that the song is then perfectly divisible by these bits of silence.

i made an xrns using this and other techniques. it may not sound the best (i’m in a public place and without headphones) but it demonstrates what i’m talking about.

rinse technique.xrns (http://www.mediafire.com/?smbmv1ha5gcobbu)

the “core” of “breakcore” can be downloaded below.

101 breaks pack

http://tinyurl.com/qfd4l

and

declassified breaks pack

http://www.artmeetsscience.co.uk/downloads/declassified-breakspack.rar

remember this is only technique, what you do with it is what matters. if you spend all day emulating bob ross painting techniques, you’re still the one deciding where to place the “happy little tree”.

[image]

---

### #2 · maes · 2010-09-20

thanks for the tips! will check it out when i get off work.

by the by, the unbelievable attack of les horrid bananas gets frequent plays here still! 'tis nice!

---

### #3 · rhowaldt · 2010-09-20

always a nice thing to hear about techniques, and get free samples on top of that [image]

thanks!

---

### #4 · s-n-s · 2010-09-20

always cool to see other peoples techniques

---

### #5 · Sepix · 2010-09-20

yay, thx =)

---

### #6 · niNja_pWn · 2010-09-21

Hey sepix… That’s a fucked up picture bud, lol!

---

### #7 · Sepix · 2010-09-22

fits the music [image]

---

### #8 · insane · 2010-09-22

Nice tip! I do breakcore. BTW, in breakcore you may want to use the Renoise internal maximizer [image]

---

### #9 · ericneilj · 2010-09-26

if anyone has any other neat breakcore tricks to share, please do. thinking of making an improved version of my tutorial as well.

---

### #10 · Antischocken · 2010-09-27

Don’t you guys work on you drums? The above “technique” doesn’t split the drumloop up to work in detail? This is the reason most of the self-called breakcore music sound noisy with unambitious acoustic patterns?^^

---

### #11 · s-n-s · 2010-09-27

[image] Antischocken:

Don’t you guys work on you drums? The above “technique” doesn’t split the drumloop up to work in detail? This is the reason most of the self-called breakcore music sound noisy with unambitious acoustic patterns?^^

do you have an exsample on how you do it?

---

### #12 · Rex_Sathum · 2010-09-27

Not that it’s particularly breakcore, but here’s the way I approach beat-slicing in my most recent finished track

I prefer to use 09xx commands rather than manually chopping the break into individual hits as this preserves the human playing dynamics of the sampled phrase which IMHO is the whole point of breaks. I know the sample offset markers are not properly accurate yet, but I think a bit of dead air adds to the live feel, especially on snares and hats - saves having to fuck about with the delay column!

I also use 09xx for to improve timing accuracy as with the string samples and also to spice up some of the guitar parts I record. [image]

PS. Uses one instance of FM8 and several instances of Audio Damage’s Rough Rider Compressor (free to download and fucking great on drums!)

---

### #13 · rhowaldt · 2010-09-27

i don’t necessarily make breakcore (although i would like to be able to do sick shit like vsnares, but nobody - including me - really enjoys a copy-cat), but i do use some of these techniques, and i agree on the use of the 09xx command with beats as said by Rex. it preserves the beat, and on top of that just randomly guessing some of the values with the added inaccuracy often leads to surprising outcomes that sound much better than trying to mathematically figure out that stuff in detail, making it sound like it’s ‘supposed to’ sound. this, of course, involves trial and error, but it’s the errors that make it work so often [image].

the name ‘rex’ made me think of the Reason DrRex device, which can be quite useful for creating strange beats as well. try loading up a nice beat, copy the midi-notes to track, and load up a new beat in the same DrRex, thus letting the previous drum rhythm play the new drum sounds. this is a lot of trial and error again, but it may work wonders for inventing new rhythms. (yes, this is not the Reason forum but who cares).

by the way, nice track Rex. and indeed, nice use of the 09xx command (on the acoustic guitar), i’ll remember that technique.

---

### #14 · ericneilj · 2010-09-28

[image] Antischocken:

Don’t you guys work on you drums? The above “technique” doesn’t split the drumloop up to work in detail? This is the reason most of the self-called breakcore music sound noisy with unambitious acoustic patterns?^^

in the xrns i posted, i used one-hits out of the amen, this is common; the fun alternative of course being the aforementioned 09xx. suggesting using one-hits is not working “in detail” is kinda silly; i split up the drum loop, split it even more, then used 8 lpb and 400bpm precisely for detail.

“us guys” do work on our drums, and sometimes grammar.

---

### #15 · maes · 2010-09-28

Mushen:

in the xrns i posted, i used one-hits out of the amen, this is common; the fun alternative of course being the aforementioned 09xx. suggesting using one-hits is not working “in detail” is kinda silly; i split up the drum loop, split it even more, then used 8 lpb and 400bpm precisely for detail.

“us guys” do work on our drums, and sometimes grammar.

oi, any specific reason why you go with 400 bpm and 8 lpb instead of 200 bpm and 16 lpb for example?

i don’t understand the discussion of cutting up vs 09ing the beats… it’s basically the same thing or?

---

### #16 · rhowaldt · 2010-09-28

[image] maes:

i don’t understand the discussion of cutting up vs 09ing the beats… it’s basically the same thing or?

both techniques are able to give you the same results if used in a certain way (e.g. if you finetune your 09xx commands to be right on the beat), but as mentioned above, i prefer the 09xx command (most of the time) because it does not cut away the end of the sample, but just starts the sample in a different position. to me, it feels like the difference of nice and controlled paddling down a river (cutting up beats and placing them where you want) versus wild rafting, and constantly having to control the way the water is making the boat shoot off in different directions (using 09xx, because of the sample-pieces that are being played at places and timings you might not have planned them, which you then have to control by more 09xx commands, or not cuz it sounds fat). i hope you get that analogy, because i don’t know how to express this in a better way.

in short, ‘basically’ is the important word in your comment [image]

---

### #17 · maes · 2010-09-28

ah, ye i get what you mean now.

but you could just as well just copy the sample from where the hit starts all way to the end of the break and load that to a new note. that way one can jam the break on the keyboard and it’s easy to see if a note is a hh, sn or bd hit by just looking at the note in the pattern editor.

---

### #18 · Rex_Sathum · 2010-09-28

Again, for me it is about trying to maintain the natural flow of the drums (even if they are pitched up or down to sound unnatural, and cutting up the break into separate samples means you lose the tail on snares, cymbals, boomy kicks, etc. On a real drum kit the only thing that would interrupt the tail on a particular drum would be that drum being hit again by the drummer or another part of the kit coming in to dominate the mix. I find that the 09xx method maintains that dynamic, and occassionally if I wanted abrupt stops or silences I use note-offs, or even better volume slides down (07xx) to simulate quick decay envelopes.

If you have a particularly long break then it helps to split it into 2 or more even parts and then reference these in the same note column to keep the monophonic vibe. I like to keep a pen and paper handy when I’m working on a track, I then just go to the sample editor and scribble down a list of the marker positions for each hit and what that hit is, i.e. 0922 = hard snare, 0948 = soft kick, 0972 = ride cymbal, etc. It’s all mapped out on paper like a kit then without any manual slicing. This also still lets you take advantage of the sync check box which manually chopping doesn’t.

The other tip which I recently learned is that once you have checked the sync box, you can hover over to get a tool tip for the exact tuning / fine tuning that the sample is at when synced. You can then uncheck the sync box and enter these manually which means the break will be perfectly synchronised but still allow you to mess around with the pitch which is an old junglist trick for detuning drums for things like gradually pitched up/down snare rolls which you will hear loads of in venetian snares drum programming - particularly on Detrimentalist.

---

### #19 · Antischocken · 2010-09-28

[image] s-n-s:

do you have an exsample on how you do it?

I spontaneously decide either I split the drumloop(if I am using one) up or if I’m using 09xx. Every part gets an extra track i.e. bd=Track01 sn=Track02 chh=Track03 etc.

Maybe some layering to each piece of instrument. This means maximum controll, maybe routing it all back together to one sendtrack to give compression/eq/filter etc. to the sum. I think this is the most common way most producers use today?!

---

### #20 · rhowaldt · 2010-09-28

[image] Rex:

The other tip which I recently learned is that once you have checked the sync box, you can hover over to get a tool tip for the exact tuning / fine tuning that the sample is at when synced. You can then uncheck the sync box and enter these manually which means the break will be perfectly synchronised but still allow you to mess around with the pitch […]

thank you! i sometimes do this manually, and sometimes do this by mistake (120bpm sample, renoise bpm to 360 and then… i don’t know i suck at math but you understand 360/3=120 so it fits), but now i know how to do this on purpose! i’m gonna totally sound like vsnares now that i know this trick! [image]

---

### #21 · ericneilj · 2010-09-28

[image] maes:

oi, any specific reason why you go with 400 bpm and 8 lpb instead of 200 bpm and 16 lpb for example?

no difference in resolution between the two, but i use 8 lpb and 400 bpm so the highlighted lines are positioned closer, thus a good visual reference that, in most cases, keeps me from having to reference the hex.

[image] maes:

I spontaneously decide either I split the drumloop(if I am using one) up or if I’m using 09xx. Every part gets an extra track i.e. bd=Track01 sn=Track02 chh=Track03 etc.

Maybe some layering to each piece of instrument. This means maximum controll, maybe routing it all back together to one sendtrack to give compression/eq/filter etc. to the sum. I think this is the most common way most producers use today?!

this is what most producers do for complete songs. but the break rinse i describe is only one track in this case. the break maintains relative sonic character by undergoing identical dsp. the technique i’m describing is a very simple method, for a very specific subgenre, and used in only one track of the final tune. nothing to get twisted up about if you don’t find it useful to your taste.

---

### #22 · vincentvc · 2010-09-28

Mushen:

no difference in resolution between the two, but i use 8 lpb and 400 bpm so the highlighted lines are positioned closer, thus a good visual reference that, in most cases, keeps me from having to reference the hex.

You can change “Highlight every xx lines” in the Song Settings tab. [image]

---

### #23 · Padlock · 2010-09-28

[image] vincentvc:

You can change “Highlight every xx lines” in the Song Settings tab. [image]

A very valuable breakcore tip for getting high resolution edits. 24 LPB REPRESENT!

---

### #24 · ericneilj · 2010-09-28

[image] vincentvc:

You can change “Highlight every xx lines” in the Song Settings tab. [image]

i’m aware of this as well, so i’ll just revise my answer to laziness [image] also like the fast metronome (which yes you can change also)

the equated bpm/lpb settings are arbitrary. how it sounds is what matters.

---

### #25 · rhowaldt · 2010-09-29

Mushen:

the equated bpm/lpb settings are arbitrary. how it sounds is what matters.

i use the 8lpb for the same reason you do, so i can see where each new set of 8 starts. to me, it’s just a matter of what i’m used to. if it works, don’t fix it.

---

### #26 · maes · 2010-10-03

[image] Rex:

Again, for me it is about trying to maintain the natural flow of the drums (even if they are pitched up or down to sound unnatural, and cutting up the break into separate samples means you lose the tail on snares, cymbals, boomy kicks, etc. On a real drum kit the only thing that would interrupt the tail on a particular drum would be that drum being hit again by the drummer or another part of the kit coming in to dominate the mix. I find that the 09xx method maintains that dynamic, and occassionally if I wanted abrupt stops or silences I use note-offs, or even better volume slides down (07xx) to simulate quick decay envelopes.

what? why do you necessarily need to cut the tail in the cut up sample? just copy it to a new sample from the hit until the end of the sample.

---

### #27 · Rex_Sathum · 2010-10-03

[image] maes:

what? why do you necessarily need to cut the tail in the cut up sample? just copy it to a new sample from the hit until the end of the sample.

Well when you use a break you obviously only get a single mono / stereo sample, and you rarely if ever get a ‘clean’ kick, snare or hi-hat without another part of the kit sounding before the previous hit has naturally decayed, plus the kick will often have a hi-hat played at the same time and the hi-hat following it will have a ‘hum’ from the tail of the kick. I find this means I am obliged to keep certain hi-hats or snares in a specific sequence to maintain the flow of the tails.

Although, following these discussions I have just started a track using the manual slice / separate tracks / note off method and am pleased with the results so far - stuck a short reverb on all the parts to fake the tails and keep it a bit more natural sounding. I don’t consider either method to be right / wrong or inferior / superior, they just yield slightly different results so both methods are valid and useful IMHO.

---

### #28 · wahrk · 2010-10-03

Yeah, I’m a 09xx command kinda guy for breaks, but honestly, I’ve mostly converted to one-shots. I just like having individual control of all of my parts so I can pitch slide this kick while I 0Exx that snare.

Maybe that makes me less breakcore. :confused:

---

### #29 · NightDriller · 2010-11-16

What other samples do you guys use in your breakcore tracks? I like to use samples from video games and cartoons and porn. I was just wondering what methods you use to sample them. I used to try to sample youtube videos until I learned how bad the audio quality was. Now I just try to get samples from a direct source. I just sampled all the SFX from Sonic The Hedghog 2 and Vectorman 2 into a long wavs they’re ready to be chopped up in renoise. I’ve found the experience of finding good samples like this online to be much like pulling teeth. So what does everybody else do? Any artists you recommend? I found this guy on myspace a few years ago that I really like, his name is Mothball Z and he makes breakcore using fruity loops, he offered to teach me his tricks, but I really like using renoise and my mac wont run fruity loops anyway.

---

### #30 · wahrk · 2010-11-16

I’m not a quantity-heavy guy. I only use maybe 5-10 samples on a track, and usually nothing too strange. I like glitching up straightforward samples to make cool noises mostly. Sampling your own acoustic sounds can be awesome though. I’ve done it a few times, and it rules.

Also, freesound.org (http://freesound.org) is an awesome source for stuff.

---

### #31 · pirate_utopia · 2010-11-16

Acid Overlord:

What other samples do you guys use in your breakcore tracks? I like to use samples from video games and cartoons and porn. I was just wondering what methods you use to sample them. I used to try to sample youtube videos until I learned how bad the audio quality was. Now I just try to get samples from a direct source.

Hey Acid Overlord, are you A Funk? Or just are you using similar tricks? : )

Youtube is a big source of material, but youre right, the quality is not good…

I like to use my own collection, no downloaded packs.

---

### #32 · ripley · 2010-11-19

Personally I slice every break to its single hits. Using the 09XX command is too complicated for me because I have to go to the FX column every time and type in the 09XX number. Having all the parts sliced up and named correctly gives a slightly quicker way of constructing beats cause you just need to use the mouse wheel to change the instrument very fast.

Depending on the break which is slow or fast, with 09XX you would need to type 09XX on the same places in the pattern as if you worked with sliced beats. The Amen break for example runs at around 136 Bpm, if you want to make a 180 Bpm breakcore track you can’t just let a certain area of the break which is longer than one drum hit run out, obviously. So in my opinion there is no real audible difference. If you use slices you can humanize the notes for more natural feel.

---

### #33 · wahrk · 2010-11-19

[image] ripley:

Personally I slice every break to its single hits. Using the 09XX command is too complicated for me because I have to go to the FX column every time and type in the 09XX number. Having all the parts sliced up and named correctly gives a slightly quicker way of constructing beats cause you just need to use the mouse wheel to change the instrument very fast.

Depending on the break which is slow or fast, with 09XX you would need to type 09XX on the same places in the pattern as if you worked with sliced beats. The Amen break for example runs at around 136 Bpm, if you want to make a 180 Bpm breakcore track you can’t just let a certain area of the break which is longer than one drum hit run out, obviously. So in my opinion there is no real audible difference. If you use slices you can humanize the notes for more natural feel.

You can just sync the loop to 4, 8, or 16 bars depending on the loop length.

Most of the numpad is dedicated to instrument switching.

I’d say that using 09xx makes up for the extra typing in the effect column with the hits that you let play out into subsequent hits in the loop. It retains the original feel of the break more too.

---

### #34 · Rex_Sathum · 2010-11-19

[image] ripley:

Personally I slice every break to its single hits. Using the 09XX command is too complicated for me because I have to go to the FX column every time and type in the 09XX number. Having all the parts sliced up and named correctly gives a slightly quicker way of constructing beats cause you just need to use the mouse wheel to change the instrument very fast.

Depending on the break which is slow or fast, with 09XX you would need to type 09XX on the same places in the pattern as if you worked with sliced beats. The Amen break for example runs at around 136 Bpm, if you want to make a 180 Bpm breakcore track you can’t just let a certain area of the break which is longer than one drum hit run out, obviously. So in my opinion there is no real audible difference. If you use slices you can humanize the notes for more natural feel.

Well if it’s properly sync’d and you use 8 LPB or more then I don’t find this a problem. As much as I love electronic music and crazy beat programming, I’m a guitarist at heart and am used to playing with live (by which I do NOT mean ‘real’) musicians so I prefer to maintain some playing dynamics in the samples I use where possible, but I realise this isn’t well suited to everyones style or work ethic. If I had access to a team of drummers, string players, pianists, ethnic instrumentalists, etc then I probably wouldn’t bother using samples at all but unfortunately this is boring old reality. [image]

---

### #35 · NightDriller · 2010-11-20

capitan_mission:

Hey Acid Overlord, are you A Funk? Or just are you using similar tricks? : )

Youtube is a big source of material, but youre right, the quality is not good…

I like to use my own collection, no downloaded packs.

Obviously I’m not the Funkmeister. I guess I’m just at the stage right now where all my stuff sounds like my favorite artists’ stuff. My hardcore and breakcore sound like Vsnares. My acid sounds like Ceephax. Etc. I definitely use a lot of downloaded stuff. Samples are cool most of the time, but I try to avoid soft synths and VSTs entirely. I don’t know if that is the “breakcore way” or if there even is a way, but thats just me. I rather use my little microkorg, once I get it to play nice with my computer, than use some software instruments. I used to have a Little Phatty with an Mbox2, but the sound quality on the mbox was terrible for me. Getting it to work sucked too. Thats why I love using samples of stuff from the internet. As for all the technical stuff, I don’t see the point sometimes. I mean as long as it sounds good thats what counts right? I’ve been learning renoise for a long time now and sometimes the tricks people use in their XRNS seem kinda gimmicky to me. If there is one thing I did learn its that experimentation is the key and that happy accidents are what makes electronic music as cool as it is.

---

### #36 · ericneilj · 2010-11-22

Acid Overlord:

I just sampled all the SFX from Sonic The Hedghog 2 and Vectorman 2 into a long wavs they’re ready to be chopped up in renoise.

there are apps out there (i believe the one i used was windows only) that strip roms of all of their sounds. you end up with a folder of every sound used in the video-game. thought this might be of interest to you, though i’m too lazy right now to find the program i used [image]

---

### #37 · NightDriller · 2010-11-22

Cool, I’ll look into that. Video game sounds are great for the breakcore sound!

---

### #38 · Agree_Culture · 2010-12-03

Mushen:

there are apps out there (i believe the one i used was windows only) that strip roms of all of their sounds. you end up with a folder of every sound used in the video-game. thought this might be of interest to you, though i’m too lazy right now to find the program i used [image]

Any idea what the name of the program was called? I’m doing some light Googling for something similar and haven’t come up with anything yet, but this sounds great.

---
