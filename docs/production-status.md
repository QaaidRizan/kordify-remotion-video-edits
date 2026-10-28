# Latest delivery — 27 October 2026

Reel #3, **Prove the Job Was Done**, is available as `KordifyProofReel` at http://localhost:3005/KordifyProofReel. It retains the requested cream backgrounds, all ten scenes and the full natural narration (34.5667 seconds). See [proof-production-status.md](proof-production-status.md) for assets, timing, audio, validation and placeholders. The dispatch reel notes below are retained as history.

# Dispatch + Live Map reel — 26 October 2026

## Delivery

- Studio composition: `KordifyMapReel`, http://localhost:3000/KordifyMapReel.
- 1080 × 1920, 30 fps, 10 contiguous scenes, 940 frames / 31.3333 seconds.
- User approved keeping all spoken words and extending the original 30-second brief.
- Logo placement revision: the recurring logo badge appears only on the final slide of `KordifyMapReel`; scenes 1–9 omit it.
- Layout revision: scenes 1–9 use the recovered space for larger heroes (4–28% by scene), captions lowered 132 px, and ghost lettering lowered to match. Scene-specific layout values live in `src/scenesMap.ts`. The final CTA retains its logo layout. The outer picture duration now follows the full timeline, fixing a black tail caused by a 924-frame cutoff.
- Reel #1 remains registered as `KordifyReel`. Both use the same Scene, background, HUD, captions, logo badge and floating cards. Shared brand colors and emphasis typography update both.
- All motion is frame driven. The final 10 frames are pixel-identical, and the progress bar reaches 100%.
- MP4 export command: `npm run render:map`. This delivery is the Studio preview, scene review stills and a rendered audio mix; no final MP4 export has been made.

## Brand and claims

Verified https://www.getkordify.com on 26 October 2026. The page confirms job dispatch, phone job details, customer number, site map, On my way, office technician tracking while on the way or at a job, deadline warnings, and the trial/platform copy. The customer portal is still coming soon; no customer tracking scene was added.

CSS snapshot: `out/brand-source/site.css`. Direct site values: coral `#ff4d4d`, blue `#2d5da1`, paper `#fdfbf7`, ink `#2d2d2d`, white cards. The site uses Kalam headings and Patrick Hand body text. Kalam now supplies emphasis lettering; Inter remains the heavy caption font and JetBrains Mono remains the HUD font to preserve the reel template.

The user approved a light theme using the supplied website backgrounds: `#fdfbf7` on odd scenes and `#f6f2ed` on alternate scenes. Cards use white, with warm raised surfaces `#eee8df`, borders `#c9c0b5`, ink text `#2d2d2d` and muted text `#665e55`. The dark vignette is removed; paper dots, faint mood washes and restrained shadows retain depth. Coral buttons stay `#ff4d4d`; caption emphasis uses a darker coral `#c52f36` for contrast. Blue labels use `#2d5da1`; red, amber and green are deepened for legibility on paper. All source hex values live in `src/brand.ts`. Minimum contrast across both background colors: main text 12.36:1, muted text 5.71:1, caption emphasis 4.91:1. Reviewed all 10 scenes and original reel comparison frames in the light palette.

## Audio and timings

- Narration: Kokoro 82M v1.0 `af_heart`, natural synthesis speed `1.0`, matching the original template voice. Every spoken line is retained. The brief's scene lengths remain minimum reading times; the deadline and CTA scenes extend for complete speech.
- Full approved script retained, with 14 spoken as “fourteen” and the URL spoken as “Get Kordify dot com”. Each line is synthesized separately, then assembled without speeding or truncating speech.
- Source takes: `out/map-kokoro`. Master: `public/audio/map-vo.wav`.
- Measured Whisper word boundaries: `src/map-vo-words.json`. Editorial summary captions are mapped onto those spoken concepts in `src/map-caption-timings.json`. Hero effects and SFX use `src/map-voice-beats.json`.
- Original synthesized music is adapted to the new timeline in `public/audio/map-music.wav`. Existing original SFX are reused with new cues. Voice, effects and music retain independent Studio controls and speech ducking.
- Reproduce: `node scripts/generate-map-kokoro.mjs`, `python scripts/assemble-map-kokoro.py`, `node scripts/transcribe-map-kokoro.mjs`, `python scripts/install-map-kokoro.py`, `python scripts/align-map-captions.py`, `node scripts/generate-map-music.mjs`. Set `KORDIFY_VOICE_TOOLS` to the tools directory containing Kokoro and Whisper when working on another machine. The earlier Edge take is retained only in `out/map-voice` for comparison; do not run its generator over the final take.
- Rendered full soundtrack: `out/map-review/full-mix.wav`. Automated levels are in `out/map-review/audio-qa.json`. Automated transcription contains all 84 spoken words after normalization of punctuation, fourteen/14, Cordify/Kordify, and the spoken URL. No human listening review is claimed.

## Assets and placeholders

Downloaded the official phone jobs, job detail, day-map screenshots and app icon from `https://www.getkordify.com/app/`. Existing supplied assets remain intact.

Missing assets:

- Six mascot poses (`public/character/stressed.png`, `think.png`, `wave.png`, `cool.png`, `happy.png`, `point.png`): the established animated Kordify logo badge is used as the placeholder.
- Optional `public/assets/web-dispatch.png`: illustrative dispatch board with Job A / Site A / Tech 1 / Tech 2.
- Optional `public/assets/web-live-map.png`: illustrative map with fictional geometry and no real locations. Office status labels are restricted to ON THE WAY and ON SITE.

## Verification

- ESLint and TypeScript pass.
- Rendered stereo mix: 48 kHz, 31.3333 seconds, -3.05 dBFS peak, zero clipped samples. `python scripts/check-map.py` confirms the final hold and timeline/caption bounds.
- Reviewed all 10 scene stills, the customer-number caption page, tap before/after, moving-map state, and ending hold.
- Reviewed reel #1 scenes 1, 5 and the CTA under the shared theme.
- No hardcoded hex colors outside brand.ts, and no CSS animation or transition declarations.
- No final MP4 codec verification applies because only the Studio video and review artifacts were produced.

Review images: `out/map-review/contact-sheet.png` and `out/map-review/detail-sheet.png`.
