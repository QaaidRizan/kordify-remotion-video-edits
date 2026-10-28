# Reusable reel editing template

Use this document to make another video with the same editing style and project setup as the finished Kordify reel. Change the script, product information and assets; preserve the visual system, motion, sound treatment and reusable component structure.

This is a standalone Markdown handoff for a coding agent. Fill in section 2, supply the new script and assets, and paste the prompt in section 10.

## 1. What to give your next agent

For the closest match, start from a **copy of this working Remotion project** in a separate folder. The existing components contain the precise layout and animation details. A written guide alone can reproduce the style, but cannot guarantee an identical result without the source and assets.

Include:

| Item | Purpose |
| --- | --- |
| `template.md` | This reusable setup and editing specification |
| `docs/reel-script.md` | Your new approved narration, captions, claims and CTA; use section 3 |
| `docs/reel-edit-guide.md` | Copy sections 4–8 of this template as the permanent editing guide |
| `AGENTS.md` | Use the generic instructions in section 9 in the new project |
| `.agents/skills/reel-motion-explainer/` | Copy the complete skill folder, including `SKILL.md` and any supporting files |
| `.agents/skills/remotion-best-practices/` and related Remotion skill folders | Preserve the router and referenced guidance; a router `SKILL.md` alone may not contain its dependencies |
| `src/`, `scripts/`, project configuration, `package.json`, `package-lock.json` | Preserve the implementation and reproducible dependency setup |
| `public/` | Supply the new logo, screenshots, character poses and audio; retain reusable effects as appropriate |
| A reference MP4 or representative frames, if available | Let the agent compare the new edit with the finished style |

Keep the original Kordify guides as historical references if copying this repository. Update the new project's `AGENTS.md` to point at the generic guides so the old script does not drive the new video. Do not copy `node_modules` or generated output as required source files; install dependencies from the lockfile. Preserve any locally stored voice tooling separately if the generation workflow depends on it.

**Reference precedence:** your new explicit instructions and approved script control content. The finished source controls the established visual treatment. This template and the new edit guide control the reusable workflow. Old scripts, checkpoint reports and generic skill examples are references, not instructions to repeat old product claims.

The Kordify reference currently lasts **1,028 frames / 34.2667 seconds at 30 fps**. Its original guides also contain historical 900-frame / 30-second tables. Do not accidentally restore those old timings. Neither duration is a requirement for every new script.

## 2. Fill in the new video brief

```text
Project / product name:
Composition ID (for example ProductReel):
Output filename (for example product-reel.mp4):
Audience:
One-sentence product explanation:
Main problem:
Main promise:
Approved features / facts:
Claims or wording to avoid:
CTA text:
Destination URL:
Required small print / platform availability:
Logo and screenshot paths:
Character: retain logo badge / supply mascot poses
Accent color: retain reference coral #fa5959 / specify another
Voice: warm, clear American female like the reference / specify another
Brand pronunciation:
Spoken URL pronunciation:
Music: reuse the reference treatment / supplied track and usage rights
Target duration: approximately 30–35 seconds unless specified otherwise
Duration rule: flexible to fit natural speech / strict maximum of ___ seconds
Requested delivery: Studio preview / preview plus final MP4
Other changes explicitly requested:
```

If a nonessential field is blank, retain the reference treatment. Never infer product facts, trial offers, prices, availability or statistics from the old video. If the duration is flexible, fit the edit to clear narration. If a strict limit conflicts with the approved copy, surface that conflict before shortening or speeding up the script.

## 3. New script template — `docs/reel-script.md`

Copy and fill this section for each video. Bracketed text is an authoring placeholder, not finished copy to display or narrate.

```markdown
# [Product] reel script

Format: 1080x1920, 30 fps
Target length: [duration and whether flexible or strict]
Core problem: [problem]
Core promise: [promise]
Approved facts: [supplied facts or supporting references]
Do not claim: [unsupported features, numbers, offers, etc.]
Pronunciation: [brand and URL spoken forms]

## Scene table

| # | Purpose / HUD label | Exact voiceover | On-screen caption | Accent word(s) | Mood | Hero / visual action | Asset |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Hook / problem | [VO] | [short caption] | [accent] | problem | [main visual] | [file or mock] |
| 2 | Scattered workflow | [VO] | [short caption] | [accent] | problem | [stack of cards] | [file or mock] |
| 3 | Missing result / evidence | [VO] | [short caption] | [accent] | problem | [empty state / stamp] | [file or mock] |
| 4 | Cost / delay | [VO] | [short caption] | [accent] | problem | [timer / warning card] | [file or mock] |
| 5 | Product introduction | [VO] | [short caption] | [accent] | warm | [logo reveal] | [logo] |
| 6 | Feature / step one | [VO] | [short caption] | [accent] | fix | [workflow UI] | [screenshot] |
| 7 | Feature / step two | [VO] | [short caption] | [accent] | fix | [phone / state change] | [screenshot] |
| 8 | Feature / step three | [VO] | [short caption] | [accent] | fix | [fan of cards / checks] | [screenshots] |
| 9 | Outcome | [VO] | [short caption] | [accent] | warm | [status transformation] | [file or mock] |
| 10 | Main takeaway / offer | [VO] | [short caption] | [accent] | success | [large text / approved number] | [optional] |
| 11 | CTA | [VO] | [short caption] | [accent] | warm | [product + button + URL] | [logo / screenshot] |

## Full voiceover

[Exact approved script in scene order. Match the scene table.]

## CTA and small print

Button: [exact text]
Visible URL: [exact URL]
Spoken URL: [natural spoken version]
Small print: [approved copy, or none]
Platform/store badges: [only applicable, supported availability]

## Additional on-screen copy

[Exact approved labels, chips, offer terms and hero text.]
```

The 11-scene arc is the default reference structure. Adapt scene roles and count to the supplied story when needed; preserve one idea per scene and the same editing language. Do not add irrelevant problems or features merely to fill this table. Use large typography without a number when no approved numerical claim exists.

## 4. Preserve the editing style

### Canvas and layout

- Vertical 9:16, 1080x1920, 30 fps.
- Keep important content between y=250 and y=1580. The reference HUD is an intentional exception in the top strip. Review camera scaling and tilted-card corners against these boundaries.
- Maintain the reference hierarchy: HUD at the top, large hero in the upper/middle area, kinetic captions in the lower middle, recurring brand badge or mascot below captions.
- Reference HUD: left/right margin 80 px, top 80 px, 23 px mono labels, 3 px progress bar at y=132.
- Reference caption container: left/right 90 px, top 1148 px, minimum height 220 px, centered and wrapped. Adjust line breaks to the new text without shrinking the entire design.
- The finished reference uses a bobbing **logo badge** because mascot poses were absent. Preserve this for the closest match. A new character is optional, not required to reproduce the current edit.
- Reference badge bounds: x=380, y=1385, width 320, height 135. Preserve the placement and apparent size; adapt cropping to the new logo instead of reusing the old image crop blindly.
- Keep CTA fine print legible above the bottom safe zone. Store artwork, when relevant, stays upright outside the camera push.

### Color and typography

| Token | Reference value / treatment |
| --- | --- |
| Background | `#07080d` |
| Main text | `#f4f1ec` |
| Muted text | `#999ba6` |
| Brand/caption accent | `#fa5959` coral in the finished source |
| Problem mood | `#ff3b3b` red |
| Warm mood | `#ff7a3d` orange |
| Fix mood | `#3b82ff` blue |
| Success mood | `#22c55e` green |
| Main captions | Inter 800–900; reference uses 88 px, weight 900 |
| Emphasized words | Instrument Serif italic 400; reference uses 108 px, accent color |
| HUD / UI labels | JetBrains Mono 500 |

Use `@remotion/google-fonts` as in the source. Keep the three font roles and contrast. The original generic skill mentions orange accents; the finished Kordify source uses coral for brand/caption accents and orange for warm mood lighting.

### Background and cards

- Near-black background, mood-colored radial glow, faint perspective floor grid, drifting dust, vignette and subtle grain.
- Giant outlined, low-opacity ghost word behind the content, derived from the new scene's key word.
- Blend mood lighting over approximately 8 frames when the scene changes.
- Rounded dark cards: reference radius 30 px, padding 30 px, gradient `#20222d` to `#101119`, thin translucent accent/mood border, soft colored glow and deep shadow.
- Preserve 3D tilt: perspective 1200 px, typical rotateX 10 degrees and rotateY -14 degrees; vary around 8–20 degrees where the composition needs it.
- Keep original product screenshots recognizable and undistorted. Map files by their actual visible content, not just their filenames.

### Motion and transitions

- Derive animation from `useCurrentFrame()`, `spring()` and `interpolate()`. Frame-based sine motion is appropriate for bobbing and drift. No CSS animations/transitions, wall-clock animation or nondeterministic runtime randomness.
- Use contiguous `<Sequence>` scenes. **Do not use overlapping `TransitionSeries` for this template**, despite the generic reel skill's example: the project-specific edit uses element fades within each scene.
- Fade scene elements in over the first 6 frames and out over the last 6 frames. Keep the background continuous. The final scene does not fade away.
- Slow camera push: scale 1.00 to 1.05 across the scene, reference origin `50% 55%`.
- Caption pop: spring damping 14, stiffness 160; scale 0.85 to 1, rise 10 px, blur 6 px to 0 over 8 frames, opacity over 4 frames.
- Card entrance: spring damping 15, stiffness 150; rise roughly 260 px, scale 0.9 to 1, fade over 6 frames. Stagger related cards 4–8 frames.
- Badge/mascot entrance: spring damping 12, stiffness 160; scale from 0.9 with a small overshoot. Idle bob about 5 px and sway about 1.5 degrees, using the global frame for continuity.
- Use stamps, small shakes, ring pulses, check pops, flips, underline wipes and extruded typography at the script's emphasis points. Preserve restraint and readability.
- Align significant hero state changes with the words they illustrate. Do not copy old absolute cue frames into a differently paced script.
- Keep gentle motion or an intentional visual event at least every 0.5 seconds, except the final hold.
- Freeze the final scene and HUD for the last 10 frames, with the progress bar full and no visual fade. Keep audio outside the visual freeze so it plays normally.

### Captions and hero content

- Keep the short editorial captions supplied in the script. They summarize spoken concepts; they need not reproduce every spoken word.
- Show words progressively, with no more than 5 visible at once. Split longer phrases into balanced pages; the reference's six-word caption uses two pages of three.
- Map each caption word or phrase to the corresponding spoken concept. Never replace the approved summary captions with a full transcript automatically.
- Retain italic serif emphasis and large, readable type. Clear previous caption pages instead of stacking a paragraph.
- Reuse hero patterns: tilted phone, chaotic card pile, empty evidence/stamp, overdue/timer, logo burst, workflow board, state-change phone, fanned screenshots, status flip, large takeaway, CTA.
- The patterns are reusable; their labels and claims are not. Replace old product text, platform badges, trial chips and URLs everywhere, including React mocks and tiny labels.
- Illustrative UI must support the approved script and avoid invented metrics, testimonials or customer information.

## 5. Preserve the file structure

```text
AGENTS.md
template.md
package.json
package-lock.json
remotion.config.ts
tsconfig.json
eslint.config.mjs
.agents/skills/
  reel-motion-explainer/SKILL.md
  remotion-best-practices/SKILL.md
  [supporting Remotion skill folders and references]
docs/
  reel-edit-guide.md
  reel-script.md
  production-status.md
src/
  index.ts
  Root.tsx
  ProductReel.tsx             # Existing KordifyReel.tsx may be renamed consistently
  scenes.ts                  # All scene content, order and durations
  theme.ts                   # Shared colors and fonts
  assets.ts                  # Content-based mapping of real asset paths
  caption-timings.json        # Scene-relative measured caption timings
  voiceover.json              # Narration manifest
  voice-beats.json            # Spoken concepts used by hero animations
  sfx-assets.json             # Effect asset metadata
  sfx-cues.json               # Timed effect cues
  components/
    Scene.tsx                # ONE reusable scene component
    Background.tsx
    Hud.tsx
    Caption.tsx
    Mascot.tsx               # Also supports the recurring logo badge
    FloatingCard.tsx
    Voiceover.tsx
    SoundDesign.tsx
    BackgroundMusic.tsx
    StoreAvailability.tsx    # Only when relevant to the new script
    heroes/
      Hero.tsx               # Dispatches to reusable hero types
      shared.tsx
      [hero components adapted from the reference]
public/
  assets/                    # Logo, real screenshots, applicable badges
  character/                 # Optional transparent character poses
  audio/                     # Narration, measured words, music and effects
scripts/                     # Audio generation/alignment/QA helpers
out/                         # Generated review frames and requested exports
```

Preserve the existing scene schema fields: `id`, `from`, `dur`, `label`, `mood`, `pose`, `hero`, `words`, `accent`. Extend configuration only where the new content needs it. Add hero variants within the shared system; do not create one full scene file per scene.

Derive total duration from the scene array. Require positive integer durations, first `from=0`, and each next `from=previous.from+previous.dur`. Drive composition duration, progress, audio envelopes and final hold from the same timeline.

When changing scene count, replace reference assumptions such as `id === 11`, `/ 11`, and scene-specific caption breaks with appropriate configuration or derived values. Update hero routing/types and all timing manifests together. Existing generation scripts contain Kordify-specific copy, paths and timing assumptions: inspect and adapt them before running them for another product.

## 6. Voice, music and sound design

- Match the finished reference's clear, warm, conversational delivery. It uses Kokoro `af_heart` at synthesis speed 1.0; that describes the reference, not a requirement to use that provider.
- Use one consistent voice throughout. Check both the introduction and CTA for the same brand pronunciation. Record the URL in its natural spoken form while keeping the correct written URL on screen.
- Preserve complete approved lines. Trim excess leading/trailing silence and allow small breathing pauses; do not time-stretch, truncate or force unnatural speech to fit an old scene duration.
- Establish narration first, measure it, then retime scenes and visual events. If narration is unavailable, proceed with provisional timings and clearly report them as provisional.
- Generate or obtain word timestamps and save `public/audio/vo-words.json`; map them into `src/caption-timings.json` and `src/voice-beats.json` using the existing formats. Be explicit about scene-relative versus global time, and milliseconds versus frames.
- Add whooshes to entrances, distinct pops to card/check events, clicks to workflow actions, warning tones/ticks to problems, success chimes to results, and a riser/shimmer at reveal and CTA transitions.
- Cue SFX from the new visual beats. Do not preserve the old cue count just to match the reference. Keep effect tails natural and avoid abrupt cuts.
- Use a quiet instrumental bed with warm chords, restrained plucks and soft bass; preserve the darker problem opening and brighter reveal. The reference music generator uses 120 BPM.
- Start from reference Studio gains: voiceover 1.0, SFX 0.85, music 0.12. These are starting controls, not guaranteed loudness targets for different assets.
- Retain ducking: reduce music around 8 dB under speech and around 6 dB around focused effects; reduce effects around 8 dB under speech as appropriate. Tune by listening and checking the actual mix.
- Bridge short reveal pauses with music/riser tails so the soundtrack feels continuous. Keep speech intelligible and prevent clipping.
- Preserve independent voice, SFX and music controls. Use supplied, original or appropriately licensed audio and record its source.

## 7. Agent workflow

1. Read the new script, edit guide, `AGENTS.md` and both required skills. Inspect the copied source and reference preview before editing.
2. Inventory assets by content. Update `src/assets.ts`; preserve the supplied originals. Use a deliberate placeholder for a missing asset and record it in `docs/production-status.md`.
3. Map the new story onto the reusable scene system. Preserve the approved wording and style. Make routine implementation decisions without repeatedly asking for confirmation.
4. Start Remotion Studio and keep the preview available while working. Retain the safe-zone toggle and audio controls.
5. Update theme/branding, scene data, hero content, recurring badge and CTA. Reuse shared components wherever possible.
6. Prepare narration and measured timings, then update the timeline, captions, hero beats, SFX and music as one coordinated edit. Do not run historical accelerated-voice scripts without adapting them.
7. Inspect representative frames from every scene, state-change beats, caption page changes and the ending. Fix collisions, unreadable labels, stale branding and safe-zone problems.
8. Run the project's lint/type checks. Listen through the complete soundtrack and verify timing, pronunciation, intelligibility and clipping when audio is available.
9. Deliver the Studio preview. Render a final MP4 when the user requests export, an MP4, or selects preview plus MP4 in the brief. Do not stop after every three scenes unless staged reviews were requested.
10. Report the final duration, changed content, validation performed and remaining placeholders. Never claim a render, listening check or visual review happened unless it did.

## 8. Commands and completion checks

For a copied project with its lockfile:

```bash
npm ci
npm run dev
npm run lint
```

Replace `ProductReel` with the actual registered composition ID and update package scripts if renaming the composition:

```bash
npx remotion still src/index.ts ProductReel out/frame-30.png --frame=30
npx remotion render src/index.ts ProductReel out/product-reel.mp4 --codec=h264
```

If a render encounters a Studio port collision, use a different render port, for example `--port=3101`. Keep the copied package versions consistent; do not upgrade dependencies just to change a script.

Before delivery, verify:

- [ ] Same dark cinematic treatment, typography, 3D cards, HUD, caption rhythm and badge/mascot placement.
- [ ] Every displayed or spoken claim comes from the new approved script, including hero chips, offers and small print.
- [ ] No old branding, URL, product availability or trial terms remain unintentionally.
- [ ] Captions have at most five visible words and follow the correct spoken concepts.
- [ ] No clipped text, image distortion or important content in unsafe regions.
- [ ] Timeline has no gaps/overlaps; total duration and HUD match the scene data.
- [ ] Hero events, captions, sound effects and narration remain aligned after retiming.
- [ ] Final 10 frames hold visually without cutting speech; progress is complete.
- [ ] All animation is frame-driven and renders deterministically.
- [ ] Lint/type checks pass; scene frames and full audio have been reviewed where available.
- [ ] If exported: verify H.264, 1080x1920, 30 fps, expected frame count/duration and the intended audio stream.
- [ ] Missing assets and provisional timing/audio are explicitly listed.

## 9. Reusable `AGENTS.md`

Copy this block into the new project's root `AGENTS.md`. Replace the composition name and output filename as needed.

```markdown
# Reel Project

Remotion + TypeScript vertical product reel, 1080x1920, 30 fps.

## Always
- Read template.md, docs/reel-edit-guide.md and docs/reel-script.md before changes.
- Use the remotion-best-practices and reel-motion-explainer skills.
- Preserve the reference editing style; replace content using the new approved script.
- Follow the project edit guide when generic skill examples differ on style/timing.
- Drive motion with useCurrentFrame(), spring() and interpolate(); no CSS animations/transitions.
- Use one reusable Scene component driven by src/scenes.ts, with reusable hero components.
- Keep contiguous Sequences and internal element fades; no overlapping TransitionSeries.
- Derive duration, progress and final hold from the timeline; do not hard-code 900 frames or 11 scenes.
- Keep narration natural and synchronize captions, hero beats and SFX to it.
- Only use approved script claims. Do not import old features, stats, offers or platform claims.
- Load public assets with staticFile(); map actual asset content in src/assets.ts.
- Use placeholders for missing assets and list them in the delivery report.
- Preserve user changes and original assets. Adapt copied generation scripts before running them.
- Preview in Studio, check representative frames, and run npm run lint.
- Render the final MP4 when the user requests export or an MP4.

## Commands
- Preview: npm run dev
- Check: npm run lint
- Still: npx remotion still src/index.ts ProductReel out/frame-30.png --frame=30
- Export: npx remotion render src/index.ts ProductReel out/product-reel.mp4 --codec=h264
```

## 10. Prompt to give your next agent

```text
Create my next product reel using the same editing style as the supplied Kordify
reference project. Read template.md, AGENTS.md, docs/reel-edit-guide.md and my new
docs/reel-script.md first. Use the remotion-best-practices and
reel-motion-explainer skills.

Use the supplied project as the implementation base. Preserve its dark cinematic
background, font roles, kinetic caption treatment, floating 3D cards, mood colors,
HUD/progress bar, camera push, recurring logo badge or supplied mascot, sound
design, music ducking and final 10-frame visual hold.

Replace the product copy, screenshots, logo, CTA, URL, applicable small print and
narration with the new approved material. Adapt the existing hero patterns to
the new script. Keep one reusable Scene component driven by src/scenes.ts.
Remove old product-specific copy and assumptions throughout the copied source.

Use clear natural narration and retime scenes, captions, visual beats and SFX
together. Follow the duration rule in my brief. Do not force the new script into
the old 30-second or 1,028-frame timeline. Do not invent claims or offers.

Follow the filled brief in section 2 of template.md for the requested delivery.
Open the Studio preview, finish the implementation, inspect frames and audio,
and run the project checks. If an asset is missing, use an appropriate placeholder
and list it at the end. Report final duration and verification results. Export the
MP4 if my brief requests it.
```
