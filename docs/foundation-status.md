# Foundation checkpoint

Historical checkpoint: foundation approved. Hero effects have since been added;
see [hero-status.md](hero-status.md) for the current state.

The 11-scene timeline is registered as `KordifyReel`: 1080 × 1920, 30 fps, 900 frames.
This implements setup step 8, prompt 1. Hero effects are intentionally deferred until
the requested foundation review. No final MP4 or voiceover has been produced.

Shared components: Background, Hud, Caption, Mascot, FloatingCard, and one Scene.
The scene array retains the guide's exact timings and copy. Captions use evenly
spaced draft timings and page into groups of at most five words. The final ten
frames freeze the scene and HUD. Use `showSafeZones` in Studio to inspect framing.

## Supplied image mapping

Original files are preserved. `src/assets.ts` maps content rather than trusting names:

| Content                            | Existing file          |
| ---------------------------------- | ---------------------- |
| Wordmark                           | logo.jpeg              |
| Jobs list                          | phone-2-job.jpeg       |
| Job detail                         | phone-3-checklist.jpeg |
| Evidence                           | phone-4-evidence.jpeg  |
| Offline jobs                       | phone-6-offline.jpeg   |
| Customer signature                 | app-icon.jpeg          |
| Reports (not needed by the script) | feature-graphic.jpeg   |

## Missing / substitutes

- Six mascot poses: logo badge used, as permitted by the edit guide.
- Actual app icon: wordmark available as fallback for the later reveal and CTA.
- Checklist screenshot: needs an illustrative placeholder in the proof scene.
- Optional web dispatch and invoice screenshots: generic React mocks planned.
- `vo.mp3`, `vo-words.json`, `music.mp3`, `whoosh.mp3`, `pop.mp3`, `click.mp3`,
  `error.mp3`, `success.mp3`, `riser.mp3`: absent; preview is silent and caption
  timing is provisional.

## Next stage

After reviewing the foundation, build the problem heroes from setup prompt 2,
then solution heroes, result/CTA, sound, and final QA. No new screenshots are needed
to continue with the provided assets and permitted placeholders.

## Validation

- `npm run lint` passes (ESLint and TypeScript).
- `npx remotion versions` reports compatible packages after pinning Zod to 4.5.4.
- Studio preview loads at `http://localhost:3000/KordifyReel`.
- Requested stills: `out/frame-30.png`, `out/frame-120.png`, `out/frame-330.png`.
- Additional late-caption QA stills are in `out/foundation-qa/`.
- Frames 890 and 899 have identical SHA-256 hashes, verifying the final freeze.
- Inspected rendered examples for caption wrapping, logo cropping and safe zones.
- No CSS animation/transition, random runtime motion or TransitionSeries in source.

The first render collided with the existing Studio server on port 3000. A separate
render port resolves it without stopping Studio:

```powershell
npx remotion still src/index.ts KordifyReel out/frame-30.png --frame=30 --port=3101
```
