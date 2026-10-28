> Current version: normal-speed Kokoro narration, 34.2667 seconds. See `docs/natural-voice-direction.md`. Older rates, durations and QA figures below describe the previous 30-second version.

# Kordify sound effects

Sixteen original synthesized effects created for this reel. The SFX use no downloaded
samples or third-party recordings. A separate neural narration is now included.

48 kHz stereo, 16-bit PCM WAV. WAV avoids encoder delay at precise animation cues.
The stereo channels match so the effects remain clear in mono playback.

Regenerate with `node scripts/generate-sfx.mjs` from the project root.
Timing and gains are in `src/sfx-cues.json`. `sfxVolume` is adjustable in Studio.

- whoosh: filtered airy movement
- pop: short falling-pitch bubble
- click: soft mechanical UI click
- error: subdued dissonant buzz
- success: rising three-note chime
- riser: short noise/pitch build
- stamp: dry low impact
- tick: short bright timer tick
- bell: payment reminder ping
- bass: warm low impact with an audible upper harmonic
- disconnect: two descending electronic tones for the signal strike
- denied: short two-tone error for the NO PROOF stamp
- clockTick / clockTock: alternating mechanical clock transients for the invoice timer
- location: bright rising ping for the technician map pin
- brandBridge: warm chord shimmer and airy rise connecting Meet Kordify to dispatch

The current schedule has 61 cues. All five messy cards pop at their entrance
frames (0, 5, 10, 15, 20). The invoice timer ticks every 10 frames from f10 to
f60. The brand bridge runs from 11.133 to 12.633 seconds, filling the narration
pause while preserving the approved scene timing and spoken lines.

## Voiceover

`vo.wav` is the 30-second, 48 kHz mono PCM master used by Remotion. `vo.mp3`
is a listening copy. All 11 lines come verbatim from the approved script.
Voice: Microsoft Edge TTS `en-US-AndrewNeural`, generated using edge-tts 7.3.1.
The delivery is synthesized per scene and assembled into one continuous track;
it is not a human recording or an ElevenLabs voice. Speaking rates are recorded
in `src/voiceover.json`. Only silent tails are trimmed; speech is not cut or
time-stretched. Last narration audio ends around 29.55 seconds.

The ending speaks the URL as “get Kordify dot com”. Its Kordify word reuses the
exact audio from “Meet Kordify”, at the original pitch and speed. The surrounding
“get” and “dot com” use the same voice. Only 3 ms edges are faded at the joins.
`scripts/fix-ending-pronunciation.py` applies this correction automatically after
voice generation, and can also be run by itself. The on-screen URL is unchanged.

`vo-words.json` contains the provider's measured word/phrase boundaries (adjusted
for the ending's audio joins) on the
global timeline. `src/caption-timings.json` maps the script's shorter editorial
captions to those spoken concepts; it is not a verbatim subtitle transcript.

Regenerate with `python scripts/generate-voiceover.py`, then
`node scripts/align-voice-captions.mjs`. Requires `edge-tts==7.3.1` and internet.
The generator sends only the public script to the TTS service. Cached source
takes are in `out/vo-source/` and do not need to ship with the project.

SFX duck by about 8 dB under narration, with short attack/release ramps.
`voiceoverVolume` and `sfxVolume` are adjustable in Studio. Muting narration
restores the original SFX levels.

## Background music

`music.wav` is an original 30-second instrumental composed and synthesized
locally for this reel. No external song or sound samples are used. At 120 BPM,
warm synth chords, rounded plucks and a light bass pulse accompany the visuals.
The restrained minor opening shifts to brighter major colors at the brand reveal.
Percussion leaves room for the invoice tick-tock; the ending fades gently out.

Regenerate with `node scripts/generate-music.mjs`. The source is 48 kHz stereo
PCM16, -14.31 dBFS RMS and -1.31 dBFS peak. Studio's `musicVolume` defaults to
0.15, with another 8 dB reduction under narration and about 6 dB around SFX.
Narration and effects retain their approved levels. Music is frame-synchronized
outside the visual Freeze and can be muted independently with `musicVolume: 0`.

Provider client documentation: https://github.com/rany2/edge-tts
