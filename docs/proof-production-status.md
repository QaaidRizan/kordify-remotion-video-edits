# Proof reel — 27 October 2026

Composition: `KordifyProofReel`. Studio: http://localhost:3005/KordifyProofReel.

10 scenes, 1080 × 1920, 30 fps, 1,037 frames / 34.5667 seconds. The supplied guide's audio section permits extending the timeline to retain complete natural narration. No speech is accelerated or truncated. Reels #1 and #2 remain registered.

## Theme and structure

- Existing shared `src/brand.ts` supplies the requested page background `#fdfbf7` and alternate background `#f6f2ed`, paper cards, coral, ink, mood colors and font roles.
- Reuses `Scene`, `Background`, `Hud`, `Caption`, `Mascot` and `FloatingCard`. `scenesProof.ts` supplies content and takes measured durations from `proof-voiceover.json`; shared scene schema includes the new hero variants.
- Shared kinetic captions, camera push, perspective cards, grain/grid, mood washes and logo badge are preserved. Each scene uses an internal six-frame fade; final ten frames are held with full progress and uninterrupted audio.
- New heroes: dispute bubble, cleaning/HVAC cards, job dispute, required checklist, locked completion button, stamped photo tiles, drawn signature, sealed job file, offline/sync state, free-trial CTA.
- Caption pages contain at most five words. Approved editorial copy is preserved, with measured spoken-concept anchors and intentional page breaks.

## Audio

- Kokoro 82M v1.0 `af_heart`, synthesis speed 1.0; same voice as the source reel. HVAC is spoken as letters; 14 as fourteen and URL as Get Kordify dot com.
- Master `public/audio/proof-vo.wav`; scene manifest `src/proof-voiceover.json`.
- Word timing JSON `src/proof-vo-words.json`, editorial captions `src/proof-caption-timings.json`, shared hero/SFX cues `src/proof-voice-beats.json`.
- Whisper normalized HVAC/HVSC, syncs/sinks and the merged spoken URL. URL subdivision uses estimated intervals within its measured phrase. Raw transcription remains in `out/proof-voice`.
- Original 120 BPM instrumental adapted to scene durations: `public/audio/proof-music.wav`. Existing original effects plus deterministic synthesized shutter, lock and pen Foley; no third-party samples.
- Voice, SFX and music controls are independent. Music ducks under speech and focused effects; effects duck under speech.
- Full soundtrack rendered for automated QA: `out/proof-review/full-mix.wav`. Stereo 48 kHz, 34.5667 seconds, peak -2.97 dBFS, zero clipped samples. Automated transcription/level review only; no full listening check is claimed.

## Assets and placeholders

- Existing evidence, signature and offline JPEG screenshots are mapped by actual content in `proofAssets`, preserving source files. Existing `app-icon.png` supplies the CTA icon.
- Missing `phone-3-checklist.webp`: labeled illustrative checklist, including required and optional items. Existing `phone-3-checklist.jpeg` actually shows job detail, so it is not mislabeled as a checklist.
- Before/after photo tiles now use `public/assets/proof-before-demo.png` and `public/assets/proof-after-demo.png`: generated demo photos of the same washbasin before and after cleaning. These replace the empty placeholder tiles at the user's request. Source prompts and provenance: `public/assets/proof-photo-sources.md`.
- Missing all six mascot poses (`stressed`, `think`, `wave`, `cool`, `happy`, `point`): established animated Kordify logo badge in every scene.
- Expected evidence/signature/offline WebP versions are absent, but equivalent supplied JPEGs are used; these do not require placeholders.

## Validation and delivery

- ESLint and TypeScript pass.
- Representative frames from all ten scenes, caption pages, lock/unlock, signature, evidence assembly, offline/sync and CTA hold inspected.
- Existing original and map compositions rendered for regression checks.
- Timeline contiguous; all narration and captions fit their scenes. Last ten frames are pixel-identical and nonblank.
- No CSS animation/transition declarations or new hardcoded color values.
- Studio preview and review stills are delivered. No final MP4 was requested or exported. Export when needed with `npm run render:proof`.

Reproduce voice: `node scripts/generate-proof-voice.mjs`, `python scripts/assemble-proof-voice.py`, `node scripts/transcribe-proof-voice.mjs`, `python scripts/align-proof-captions.py`. Set `KORDIFY_VOICE_TOOLS` to the existing Kokoro/Whisper tools directory on another machine.

Reproduce music/Foley: `node scripts/generate-proof-music.mjs`, `python scripts/generate-proof-sfx.py`.

Review: `npm run review:proof`; audio QA after rendering its WAV mix: `python scripts/check-proof.py`.
