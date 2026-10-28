---
name: reel-motion-explainer
description: Build a 9:16 vertical product-explainer reel (about 30s) in Remotion with a dark cinematic look, a mascot character, word-by-word kinetic captions, floating 3D-tilted UI cards, big glowing numbers, a scene HUD with progress bar, and whoosh/pop sound design. Use this skill whenever the user wants a short social video (Reels, TikTok, Shorts) that explains a product, SaaS feature, tool or workflow in this motion-graphics style, even if they only say "make a video like this reference" or "explain my product as a reel". Always use together with the remotion-best-practices skill.
---

# Reel Motion Explainer

Style guide and build recipe for a ~30s vertical explainer reel. It is based on a
reference reel analysed from still frames (the audio was not analysed). Colors
and fonts below are approximations, so tune them to the user's brand.

Always read `remotion-best-practices` first. This skill only adds the look,
structure and motion rules.

## 1. Format

- 1080x1920 (9:16), 30 fps, 28-32 s total, about 11 scenes of 2-3 s each.
- Keep important content out of Instagram/TikTok UI zones: leave about 250px
  free at the top and about 340px at the bottom, except the HUD label which sits
  in the top safe strip.

## 2. Make it data-driven

Define one scenes array (Zod schema, so it is editable from Remotion Studio).
Each scene:

```ts
{
  id: string,
  label: string,            // HUD label, e.g. "THE PROBLEM"
  captionWords: { text: string; accent?: boolean; start: number }[], // start = frame
  mood: "warm" | "problem" | "fix" | "success",
  pose: "neutral" | "cool" | "wave" | "happy" | "think",
  hero: "bigNumber" | "cardGrid" | "terminal" | "fileCard" | "checkmark" | "none",
  heroProps?: Record<string, unknown>,
  durationInFrames: number
}
```

One `<Scene>` component renders background + HUD + mascot + caption + hero from
this config. Do not hand-write 11 separate scene files.

## 3. Visual language

- Background: near-black (#07080d) with a soft radial glow behind the mascot.
  Faint perspective grid floor, slow-drifting dust particles, light vignette,
  subtle film grain.
- Accent: warm orange (about #ff7a3d). Mood changes the glow color per scene:
  warm orange/brown = default, red = problem, blue = solution, green = success.
  Crossfade the glow color between scenes (about 8 frames).
- Type (three roles):
  - Mono small caps for HUD and UI labels (JetBrains Mono / Space Mono).
  - Heavy sans for caption words (Inter / Archivo, 800-900 weight).
  - Italic serif for the accent word (Instrument Serif Italic).
  Load via `@remotion/google-fonts`.
- Ghost text: a giant outlined, very low-opacity version of the key word sits
  behind the caption for depth.

## 4. Recurring components

- **HUD (top):** `NN / TT - LABEL` in mono, small orange dot before it, and a thin
  progress bar that fills across the whole video (progress = frame / total).
- **Caption (lower middle):** words appear one by one (spring pop plus 8px rise
  plus blur-to-sharp). Accent word is either an orange filled pill or orange
  italic serif. Keep to 2-5 words on screen at a time, and clear between phrases.
- **Mascot (bottom center):** transparent PNG poses in `public/character/`.
  Constant gentle bob (sin wave, 4-6px) plus slight rotation. On a scene change,
  swap the pose with a quick scale pop (0.9 to 1.05 to 1). Same position every
  scene so it feels anchored.
- **Floating UI cards:** rounded dark cards with 1px orange border and soft glow,
  using CSS `perspective` with `rotateX/rotateY` (about 8-20 deg), slow drift, and
  staggered entrance (spring from offscreen, 4-6 frames apart). Use for tags,
  categories, search results, error cards.
- **Big number / price:** huge extruded or glossy 3D-looking text (stack 8-12
  offset text-shadow layers or use `@remotion/three`), glow, a small tilted badge
  such as "FREE", and an underline that wipes in.
- **Terminal / search window:** dark window with traffic-light dots, typed text
  (typewriter by frame), blinking cursor, then result rows that tick in with
  green check marks.
- **File card:** icon plus filename plus "ready" status chip that pops in with a
  small bounce, optionally followed by a "sent to you" notification card.
- **Success pop:** green circle check scales in with overshoot, then the word
  "Done." slides out beside it.
- **Timer/problem props:** red countdown or stack of "404 / no results" cards
  that shake slightly, to sell the pain point.

## 5. Motion rules

- Never use CSS transitions or animations. Everything is driven by
  `useCurrentFrame()` with `spring()` and `interpolate()`.
- Springs: pop-ins `{ damping: 12, stiffness: 160 }`, soft drifts
  `{ damping: 200 }`. Add small overshoot only on emphasis elements.
- Exits are fast (6-8 frames) and entrances are slightly slower (10-14 frames).
- Overlap scenes by 6-10 frames so there are no dead cuts (`TransitionSeries`
  from `@remotion/transitions` with `fade` or `slide`).
- Add a very slow camera push (scale 1.00 to 1.05 across the scene) on the
  whole scene wrapper.
- Hero elements enter on the beat of the word they illustrate (use the caption
  word `start` frames).

## 6. Story structure (adapt copy to the product)

1. Hook with a big claim (number or stat).
2. Simplify the promise ("only one...").
3. Price/barrier removal ("$0", "no setup").
4. What it covers (cards of categories or features).
5. The problem (red mood, wasted time).
6. The fix (blue mood, how it works in 2-3 steps).
7. The result or deliverable (file, dashboard, output).
8. Install/use in one step (success pop).
9. Call to action ("comment X", "link in bio") with the mascot pointing.

## 7. Audio

- Voiceover: generate with ElevenLabs (or record), then get word-level
  timestamps (Whisper via `@remotion/install-whisper-cpp`, or the TTS provider's
  timestamps) and convert them to caption frames with `@remotion/captions`.
- SFX layer (`<Audio>` in `<Sequence>`): whoosh on card entrances, pop on
  numbers and checks, soft click on typing, riser into the CTA.
- Music: low-volume loop, ducked about 6-10 dB under the voice.

## 8. Build steps

1. `npx create-video@latest`, install the Remotion skill, add this skill.
2. Ask the user for the product name, one-line pitch, 3-5 features, the CTA, and
   brand colors/fonts. Draft the 11-scene script and get approval.
3. Generate the mascot expression sheet (or use the brand logo as the hero) and
   remove backgrounds.
4. Build the `Scene` component, then HUD, caption, mascot, and each hero type.
5. Wire the scenes array, voiceover, and word timings.
6. Preview in Remotion Studio, tune timings, then
   `npx remotion render <Comp> out/reel.mp4`.

## 9. Final check

- Is every scene readable with sound off?
- Does something move in every 0.5 s?
- Are all text and hero elements inside the safe zone?
- Does the video have exactly one idea per scene?
