> Current version: normal-speed Kokoro narration, 34.2667 seconds. See `docs/natural-voice-direction.md`. Older rates, durations and QA figures below describe the previous 30-second version.

# Light background music

Added an original, locally synthesized 30-second electronic instrumental:
warm chords, a soft bass pulse, restrained plucks and a gentle ending fade.
It uses 120 BPM and shifts from a minor opening to brighter harmony at the
Kordify reveal. No external music or sample licensing is required by this
implementation because no third-party recording was used.

The master volume is 0.15. `BackgroundMusic.tsx` reduces it a further 8 dB
under narration, with a slow recovery between lines, plus 6 dB around SFX.
The existing voice and SFX gains are unchanged. The exact Kordify pronunciation
fix, brand bridge, five card pops, error tones, tick-tock and location ping remain.

- Source: `public/audio/music.wav`
- Generator: `scripts/generate-music.mjs`
- Studio control: `musicVolume` (0 mutes music independently)
- Final audio: `out/kordify-voice-mix.wav`
- Previous voice/SFX stem for comparison: `out/kordify-dialogue-sfx-reference.wav`
- Final video: `out/kordify-reel.mp4`
- Verification: `scripts/check-voice-mix.py` and `scripts/check-music-mix.py`

The music is added to the approved video with a video-stream copy. Scene timing,
captions, visuals, 1080x1920 resolution and 900-frame duration stay unchanged.

Verified the actual rendered mix: narration is 19.62–24.49 dB above the music
by scene RMS. The specifically requested SFX transients are 7.46–24.10 dB above
the music. The combined PCM peak is -2.77 dBFS with zero clipped samples.
The exact intro/ending brand sample match still passes. Final MP4: H.264,
1080x1920, 900 frames, AAC stereo, exactly 30.000 seconds. ESLint/TypeScript pass.
Detailed measurements: `out/music-audio-qa.json` and `out/voice-audio-qa.json`.
