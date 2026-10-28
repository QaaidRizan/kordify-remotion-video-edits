> Current version: normal-speed Kokoro narration, 34.2667 seconds. See `docs/natural-voice-direction.md`. Older rates, durations and QA figures below describe the previous 30-second version.

# Voiceover and store artwork pass

## Delivered behavior

- All 11 script lines are narrated using the same English neural voice,
  `en-US-AndrewNeural`. The short takes are synthesized to fit each approved
  scene, then assembled into a single 30-second master. This is scene-aligned
  synthesized narration rather than a literal one-take recording.
- Narration starts at 0.08 seconds and ends at 29.546 seconds. Scene starts,
  900-frame duration and final 10-frame visual hold remain unchanged.
- The ending now explicitly says “get Kordify dot com”. The brand word reuses
  the introduction's exact audio at its original pitch/speed; short fades smooth
  the joins. The introductory wording and on-screen URL remain unchanged.
- Speech is not time-stretched or truncated. Only excess silence at take ends
  is removed. The hook is deliberately very fast to fit the existing 3 seconds.
- The approved short on-screen captions now use measured provider boundaries
  through explicit concept mappings. They remain summary captions, not a new
  verbatim subtitle layer. “One place” shares the provider's phrase boundary.
- The updated 61 SFX cues track their animation frames. They duck about
  8 dB under narration. Studio exposes separate voice and SFX volume controls.
- A warm shimmer/riser now bridges 11.133–12.633 seconds so the pause after
  “Meet Kordify” has continuous sound. Narration timing remains unchanged.
- Scene 11 shows the official Google Play badge plus the App Store icon with
  visible “iPhone coming soon” text. The exact original small print remains.
  Store artwork stays upright and is outside the camera push.

## Files and sources

- Voice master: `public/audio/vo.wav`; listening copy: `public/audio/vo.mp3`.
- Measured boundaries: `public/audio/vo-words.json`.
- Caption mappings: `src/caption-timings.json`.
- Voice generation details and rates: `src/voiceover.json`.
- Generation: `python scripts/generate-voiceover.py`, then
  `node scripts/align-voice-captions.mjs` (edge-tts 7.3.1).
- Provider information: https://github.com/rany2/edge-tts
- Store asset source URLs: `public/assets/store-artwork-sources.md`.
- Visual review: `out/cta-voice-preview.png`, frame 875.
- Updated video: `out/kordify-reel.mp4`.
- Studio: http://localhost:3000/KordifyReel

## Verification

ESLint and TypeScript pass. The actual rendered PCM mix is 30 seconds, 48 kHz,
stereo, with a sample peak of -2.77 dBFS and zero clipped samples. Every script
line matches the provider's returned text, with the URL expanded to its spoken
form “get Kordify dot com”. All 11 narration segments are present
in the rendered mix (source correlation 0.9528 or higher). No speech crosses a
scene boundary. See `out/voice-audio-qa.json`.

After the SFX refinement, every 100 ms window across the previous brand-reveal
silence contains sound; after adding music, the quietest window measures -31.42
dBFS RMS. The mix has no clipped samples.

Final FFprobe check: H.264, 1080x1920, 30 fps, 900 video frames; AAC stereo
48 kHz. Both streams and the MP4 container are exactly 30.000 seconds. The
final mux removes AAC padding beyond the 30-second endpoint without altering
video frames or speech (which finishes at 29.546 seconds).

The final store panel was inspected at full resolution and in Studio. Store
labels, CTA and exact small print fit above the bottom safe zone.

## Existing placeholders

Separate Kordify app icon and mascot poses remain replaced by the approved
wordmark. Actual checklist and web dispatch screenshots remain illustrative UI.
The mix now includes a quiet original instrumental bed in `public/audio/music.wav`,
automatically ducked under narration and SFX. See `docs/music-status.md`.
This pass adds no new product claims or product screenshots.
