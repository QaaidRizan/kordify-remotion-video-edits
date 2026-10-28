> Current version: normal-speed Kokoro narration, 34.2667 seconds. See `docs/natural-voice-direction.md`. Older rates, durations and QA figures below describe the previous 30-second version.

# Sound design pass

## Current refinement

61 cues using 16 original synthesized effects. Added a warm brand shimmer/riser
from 11.133–12.633 seconds to cover the silence after “Meet Kordify”; narration
and scene durations remain unchanged. Signal strike at scene 1 f14 now has a
clear descending disconnect tone. Scene 2 has five audible card pops at
f0/f5/f10/f15/f20. Scene 3 combines its f28 stamp with a two-tone error. Scene 4
uses a fuller alternating tick-tock at f10/f20/f30/f40/f50/f60. Scene 6's technician
location pin gets a rising ping at f45.

The current mixed audio is `out/kordify-voice-mix.wav`, verified with
`python scripts/check-voice-mix.py`, including 100 ms RMS checks across the
previous brand-reveal silence. Current video: `out/kordify-reel.mp4`.

## Original SFX-only pass (historical)

The current narration/store-artwork update is documented in
[voiceover-status.md](voiceover-status.md). The cue list below remains accurate;
the current mix additionally ducks these effects under narration.

Added 55 frame-aligned cues across all 11 scenes. The master SFX level is 0.85,
adjustable through `sfxVolume` in Remotion Studio. Individual levels and offsets
live in `src/sfx-cues.json`; scene starts come from `src/scenes.ts`.

## Sound choices

| Scene | Effects |
| --- | --- |
| No signal | Phone whoosh at f4, error at f14, status pop at f22 |
| Messy cards | Light whoosh and three pops at f0, f10, f20 |
| No proof | Two card whooshes, stamp impact at f28 |
| Late invoice | Stack whoosh, warning buzz, four ticks, riser into the reveal |
| Meet Kordify | Pop and low impact at f4 |
| Dispatch | Board/phone whooshes, pickup and landing clicks, map-pin pop |
| Offline | Phone whoosh, chip pop, sync click, success chime at f55 |
| Proof | Three fan-out whooshes; checks at f30, f45, f60; quieter row/tag cues |
| Payment | Invoice whoosh, bell pings at f20/f36, flip whoosh, success at f50 |
| One place | Bass hit at f2; chip pops at f20/f28/f36; riser into CTA |
| Trial CTA | Phone whoosh, logo/button pops, URL click, final chip pop |

Frames above are scene-relative. Risers intentionally bridge scene boundaries.
Audio sequences sit outside the scene Freeze so tails play normally. All effects
finish before the final ten-frame visual hold.

## Assets

Ten original synthesized effects are in `public/audio/`, at 48 kHz stereo PCM16.
They use WAV rather than MP3 for accurate onset timing without lossy sample delay.
No third-party sound recordings, voices or music are used.

Regenerate: `node scripts/generate-sfx.mjs`.
Render mix: `npx remotion render src/index.ts KordifyReel out/kordify-sfx.wav --codec=wav --port=3102`.
Verify mix: `node scripts/check-sfx.mjs`.

## Verification and outputs

- `npm run lint` passes (ESLint and TypeScript).
- Mix is exactly 30 seconds, stereo, 48 kHz.
- Sample peak: -6.08 dBFS; no clipped samples.
- Reconstructing all 55 cues at their scheduled samples matches the Remotion mix
  within 0.000087 amplitude, consistent with PCM rounding.
- Last audible effect ends at approximately 28.089 seconds.
- Full video: `out/kordify-reel.mp4`; isolated SFX mix: `out/kordify-sfx.wav`.
- The existing full-resolution visual draft was muxed with the Remotion-rendered
  mix using video stream copy, preserving the approved visual frames.

Voiceover and background music are not included in this SFX-only pass. Caption
timing remains the provisional timing from the script until voiceover is added.
Existing visual substitutes remain: logo for mascot/app icon, illustrative
checklist and dispatch board. No sound effects are missing or placeholders.
