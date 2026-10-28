# Natural voice revision ? 25 October 2026

The user approved extending the reel to preserve the full script at a clear pace.
The current edit is 1,028 frames at 30 fps: 34.2667 seconds, 11 scenes, 1080x1920.

## Voice

Kokoro 82M v1.0, `af_heart`, normal synthesis speed 1.0 throughout. A warm American
female synthetic voice replaces the accelerated Microsoft Andrew take. No speech
was time-stretched. Each complete scene line is synthesized at the same speed;
only leading/trailing silence is trimmed. Small breathing pauses separate scenes.
The invoice scene retains enough time for its six clock beats.

ElevenLabs was attempted, but the connected Edge session continued to show its
sign-in form after the user's sign-in messages. This replacement is **Kokoro,
not ElevenLabs**. No ElevenLabs generation or account credits were used.

The ending is explicitly spoken as "get Kordify dot com". Both brand mentions use
the same model, voice and spelling. Whisper recognizes Kordify at both mentions.
The old Edge pronunciation splice is not used in this recording.

## Timing and mix

Whisper.cpp 1.6.0, small.en generated measured word timings. Caption text remains
the approved script's short editorial captions. No-signal, sync, checklist/photo/
signature and payment effects follow the new spoken concepts. All 61 SFX remain.
The original locally synthesized score is regenerated to the new scene lengths,
with the existing speech and effects ducking. The composition, HUD and final
10-frame hold derive their duration from the scene timeline.

## Assets and reproducibility

- Current narration: `public/audio/vo.wav` and `vo.mp3`.
- Measured words: `public/audio/vo-words.json`.
- Narration manifest and visual beats: `src/voiceover.json`, `src/voice-beats.json`.
- Source clips, transcription, model tools: `out/voice-review`, `out/voice-tools`.
- Previous source/audio backup: `out/voice-review/before-natural`.
- Previous rendered music version: `out/kordify-with-music.mp4`.

The isolated tools were installed with:
`npm install --prefix out/voice-tools kokoro-js @remotion/install-whisper-cpp@4.0.538`.
Generation: `node scripts/generate-natural-voice.mjs`, then
`python scripts/assemble-natural-voice.py`. Transcribe the 16 kHz alignment WAV
with `out/voice-tools/transcribe.mjs`, then run `python scripts/install-natural-voice.py`
and `node scripts/generate-music.mjs`. Do not run the legacy accelerated Edge
`generate-voiceover.py` or `fix-ending-pronunciation.py` for this version.

Model source: https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX
The model card identifies the weights as Apache-2.0.

## Verification

ESLint and TypeScript pass. Final export: H.264 1080x1920, 1,028 frames at 30 fps,
AAC stereo 48 kHz, 34.266667 seconds. `out/kordify-reel.mp4` is the updated deliverable;
`out/kordify-natural-final.mp4` is the named copy.

All 11 script lines are present in the measured transcript. Narration ends at
33.904 seconds. PCM mix peak is -2.94 dBFS, with zero clipped samples. The quietest
100 ms between the brand introduction and dispatch is -36.09 dBFS, avoiding dead
air. Music defaults to 0.12 and stays 19.42?23.70 dB below narration per scene.
Focused SFX remain 9.77?26.44 dB above the music. Reports:
`out/voice-audio-qa.json`, `out/music-audio-qa.json`.

Reviewed rendered sync-state and ending frames; the final card retains the store
availability and iPhone-coming-soon notice. Studio loads the new composition.
The automated transcript and mix checks verify content and levels; human preference
for the voice remains subjective, so `public/audio/vo.mp3` is available separately.
