# Kordify Reel #2: Remotion Edit Guide (Dispatch + Live Map)

> Current implementation (26 October 2026): the user approved keeping every spoken word and extending the video. Use the measured 940-frame / 31.3333-second timeline in `src/map-voiceover.json` rather than the original 900-frame examples below. Brand tokens come from `src/brand.ts`; shared components serve both compositions.

For any code agent (Codex, Claude Code, Cursor) inside a Remotion project.
Use it with `kordify-map-reel-script.md`.

**Goal:** 1080x1920, 30 fps, 900 frames (30 s), 10 scenes, in the same style as reel #1: dark cinematic look, mascot, word-by-word kinetic captions, floating 3D-tilted cards, scene HUD with progress bar, whoosh/pop sound design.

## 0. Two ways to start

**A. You already built reel #1 (recommended).** Add a second composition to the same project and reuse `Background`, `Hud`, `Caption`, `Mascot`, `FloatingCard` and `Scene`. Only the config and the new hero components are new.

**B. Fresh project.** Follow setup and style sections 1-5 of `kordify-reel-edit-guide.md` (reel #1) first, then come back here. The Codex steps are in `kordify-reel-codex-setup.md`.

Skills to use: `remotion-best-practices` and `reel-motion-explainer`.

## 1. Rules for the agent

- All animation uses `useCurrentFrame()`, `spring()`, `interpolate()`. No CSS transitions or animations.
- Register a new composition: `<Composition id="KordifyMapReel" width={1080} height={1920} fps={30} durationInFrames={900} />`.
- No `TransitionSeries`. Fade each scene's elements out over its last 6 frames and the next scene in over its first 6 frames, so the total stays exactly 900.
- One reusable `<Scene config={...}/>`, driven by `src/scenesMap.ts`. New heroes go in `src/components/heroesMap/`.
- Only claims from the script. No customer-tracking claims, no invented numbers, no real addresses or names in map mocks.

## 2. Image checklist (what you already have vs what is new)

You already have the images from reel #1. Only the rows marked **NEW** need to be added.

| File | Status | Used in scene | Notes |
|------|--------|---------------|-------|
| `public/assets/phone-1-jobs.webp` | Have (reel #1) | 4 | My jobs screen |
| `public/assets/phone-2-job.webp` | Have (reel #1) | 5, 6 | Main hero of this reel. For the "On my way" zoom in scene 6, crop with CSS scale/translate. No new file needed |
| `public/assets/app-icon.png` | Have (reel #1) | 10 | |
| `public/character/stressed.png`, `think.png`, `wave.png`, `cool.png`, `happy.png`, `point.png` | Have (reel #1) | all | No new poses needed |
| `public/assets/phone-5-map.webp` | **NEW** (was not in the reel #1 download list) | 7 | The technician's "day on the map" screen, shown as a small floating card |
| `public/assets/web-dispatch.png` | **NEW, optional** | 3 | Real screenshot of the web app dispatch board. If missing, the agent builds an illustrative mock |
| `public/assets/web-live-map.png` | **NEW, optional** | 7 | Real screenshot of the web app live technician map. If missing, the agent builds an illustrative mock |

Nothing else is needed: no new logo, no new mascot, no new audio images.

**Get the one new website image** (the path is taken from the page's image links, so save it manually if it fails):

```bash
cd public/assets
curl -fLO "https://www.getkordify.com/app/phone-5-map.webp" || echo "FAILED: save it manually from getkordify.com"
cd ../..
```

**How to capture the two optional web screenshots**
- Use a demo workspace with generic names (Tech 1, Tech 2, Job A). Do not show real customers, phone numbers or addresses.
- Capture in the same dark/light theme as the rest of the reel, at least 1600 px wide, as PNG.
- Crop to just the board or the map, with no browser bars or sidebars.
- Save with the exact filenames above.

If an image is missing, the agent must use a placeholder or an illustrative mock and list what is missing at the end of its reply.

## 3. Style tokens (add `warn`)

```ts
export const theme = {
  bg: "#07080d",
  text: "#f4f1ec",
  accent: "#ff7a3d",           // swap for the Kordify brand color
  mood: {
    problem: "#ff3b3b",        // scenes 1-2
    warm:    "#ff7a3d",        // scenes 3, 10
    fix:     "#3b82ff",        // scenes 4-7
    warn:    "#ffb020",        // scene 8
    success: "#22c55e",        // scene 9
  },
};
```

Fonts: JetBrains Mono (HUD/labels), Inter 800-900 (captions), Instrument Serif Italic (accent word). Safe zones: keep key content out of the top 250 px and bottom 340 px, except the HUD strip.

## 4. Scene config (`src/scenesMap.ts`)

```ts
export const scenesMap = [
  { id: 1,  from: 0,   dur: 75,  label: "WHERE IS HE",   mood: "problem", pose: "think",    hero: "questionMap",
    words: ["Where", "is", "your", "technician?"], accent: "Where" },
  { id: 2,  from: 75,  dur: 90,  label: "THE CALLS",     mood: "problem", pose: "stressed", hero: "callPile",
    words: ["Calls.", "Texts.", "\"Where are you?\""], accent: "\"Where are you?\"" },
  { id: 3,  from: 165, dur: 75,  label: "DISPATCH",      mood: "warm",    pose: "cool",     hero: "dispatchDrop",
    words: ["Dispatch", "the", "job"], accent: "Dispatch" },
  { id: 4,  from: 240, dur: 75,  label: "ON THEIR PHONE",mood: "fix",     pose: "wave",     hero: "phoneArrive",
    words: ["It", "lands", "on", "their", "phone"], accent: "phone" },
  { id: 5,  from: 315, dur: 90,  label: "THE JOB",       mood: "fix",     pose: "happy",    hero: "jobCallouts",
    words: ["Customer", "number.", "Site", "on", "a", "map."], accent: "on a map." },
  { id: 6,  from: 405, dur: 75,  label: "ON MY WAY",     mood: "fix",     pose: "point",    hero: "onMyWayTap",
    words: ["Tap", "\"On", "my", "way\""], accent: "\"On my way\"" },
  { id: 7,  from: 480, dur: 120, label: "LIVE MAP",      mood: "fix",     pose: "cool",     hero: "liveMap",
    words: ["See", "them", "on", "the", "live", "map"], accent: "live map" },
  { id: 8,  from: 600, dur: 105, label: "DEADLINE",      mood: "warn",    pose: "think",    hero: "deadlineWarn",
    words: ["Warned", "before", "a", "deadline", "slips"], accent: "before" },
  { id: 9,  from: 705, dur: 90,  label: "FEWER CALLS",   mood: "success", pose: "happy",    hero: "callsFade",
    words: ["Fewer", "\"where", "are", "you?\"", "calls"], accent: "Fewer" },
  { id: 10, from: 795, dur: 105, label: "TRY IT",        mood: "warm",    pose: "point",    hero: "cta",
    words: ["Try", "it", "free", "for", "14", "days"], accent: "free" },
] as const;
```

HUD label shows `NN / 10 - LABEL`. Total = 900 frames.

## 5. Hero effects, scene by scene (frames are relative to the scene start)

**1 questionMap (75):** Dark map mock fills the middle. A pin with a red `?` drops at f8 and bounces. A dotted route draws from the bottom and stops mid-map, ending nowhere. Slow camera push. SFX: whoosh f4, soft thud f10.

**2 callPile (90):** 5 tilted cards fly in with stagger (f0-f24): chat bubbles reading "Where are you?", "ETA?" and a "Missed call" card. They jitter and overlap, and the stack shakes slightly at f40. No real app logos. SFX: 4 quick pops, one error buzz.

**3 dispatchDrop (75):** Dispatch board mock with three lanes: Unassigned, Tech 1, Tech 2. A job card lifts at f10, drags into the Tech 1 lane by f30, and a blue "Assigned" chip pops at f34. Cursor icon follows the card. SFX: click at pick-up, pop on drop.

**4 phoneArrive (75):** `phone-1-jobs.webp` flies in tilted from the right (rotateY about -14 deg). A new job row pulses and glows at f30. A small notification-style chip `NEW JOB` pops above the phone. SFX: whoosh, pop.

**5 jobCallouts (90):** `phone-2-job.webp` is the big hero, slowly rotating. Three mono callout tags attach with thin lines at f20, f40, f60: `CUSTOMER'S NUMBER`, `SITE ON A MAP`, `ON MY WAY`. Each tag pops with a small ring. SFX: three clicks.

**6 onMyWayTap (75):** Zoom to the On my way button area of the phone (scale 1.0 to 1.5 on a crop). A finger/tap ripple at f20. A status chip changes from `SCHEDULED` to `ON THE WAY` with a flip at f26. Glow shifts brighter. SFX: tap, success blip.

**7 liveMap (120):** Full map mock (or `web-live-map.png`). Two pins move along dotted routes with pulse rings (f10-f100). Chips float on the pins: `ON THE WAY` and `ON SITE`. A small header tag reads `LIVE TECHNICIAN MAP`. A third pin appears at f60 and settles. A small floating `phone-5-map.webp` card tilts in at the left edge at f30 with a mono tag `TECH'S DAY MAP`. SFX: whoosh into the map, soft ping when each pin arrives.

**8 deadlineWarn (105):** A job card with a countdown ring that drains from green to amber. At f45 an amber chip `ABOUT TO MISS DEADLINE` slides in with a shake and a bell icon pings twice. Glow pulses amber. SFX: bell ping x2.

**9 callsFade (90):** The red chat bubbles from scene 2 reappear and fade out one by one (f10-f45). A green check circle pops in at f50 with overshoot. Mascot swaps to `happy`. Glow turns green. SFX: pop, success ding at f50.

**10 cta (105):** `app-icon.png` above, a pulsing `Start free trial` button, URL pill `getkordify.com`. Tiny text near the bottom, above the safe zone: `Android app on Google Play. iPhone coming soon. Early access.` Hold the last 10 frames static. SFX: riser then pop.

## 6. Audio

Files in `public/audio/`: `map-vo.mp3`, `music.mp3`, `whoosh.mp3`, `pop.mp3`, `click.mp3`, `error.mp3`, `success.mp3`, `bell.mp3`, `riser.mp3`.

1. Generate `map-vo.mp3` from the voiceover in `kordify-map-reel-script.md`. Target 27-29 s.
2. Get word timestamps (Whisper via `@remotion/install-whisper-cpp` or the TTS provider), save `src/map-vo-words.json`, and use `@remotion/captions` to set caption `start` frames.
3. Place SFX with `<Sequence from>` at the frames in section 5.
4. Music at about 0.15 volume, ducked a further 6-10 dB under the voice.
5. If the voice is shorter or longer than planned, adjust scene durations in `scenesMap.ts` and the total in `Root.tsx`. Don't speed up the voice.

## 7. Render

```bash
npx remotion still KordifyMapReel out/map-f120.png --frame=120     # spot checks
npx remotion render KordifyMapReel out/kordify-map-reel.mp4 --codec=h264
```

## 8. QA checklist

- [ ] 900 frames, 1080x1920, nothing important in the top 250 px / bottom 340 px (except the HUD)
- [ ] Colors: red (1-2), warm (3), blue (4-7), amber (8), green (9), warm (10)
- [ ] Something moves at least every 0.5 s
- [ ] Mascot in the same place every scene, new pose each scene
- [ ] Every scene readable with sound off
- [ ] No customer-tracking claim, no "exact", "24/7" or "always on"
- [ ] Map mocks use generic labels only
- [ ] Captions match the voice timing
- [ ] No CSS transitions

## 9. Staged prompts (paste one at a time)

**Prompt 1: setup**
```
Read docs/kordify-map-reel-edit-guide.md and docs/kordify-map-reel-script.md. Use
$remotion-best-practices and $reel-motion-explainer. Add the KordifyMapReel composition
(1080x1920, 30fps, 900 frames) to the existing project, add the warn mood color, and create
src/scenesMap.ts from section 4. Reuse the existing Scene, Background, Hud, Caption, Mascot and
FloatingCard. Render stills at frames 30 and 200 and show me.
```

**Prompt 2: scenes 1-4**
```
Build hero components questionMap, callPile, dispatchDrop and phoneArrive as described in
section 5. Use illustrative mocks with generic labels. Render a still in the middle of each scene.
```

**Prompt 3: scenes 5-7**
```
Build jobCallouts, onMyWayTap and liveMap from section 5, using phone-2-job.webp. For liveMap
use public/assets/web-live-map.png if it exists, otherwise build the illustrative map mock.
Check the pins move smoothly with spring/interpolate only.
```

**Prompt 4: scenes 8-10**
```
Build deadlineWarn, callsFade and cta from section 5. Keep the last 10 frames of scene 10 static.
Add the small print line above the bottom safe zone.
```

**Prompt 5: audio and polish**
```
Use $remotion-captions with public/audio/map-vo.mp3 to create src/map-vo-words.json and set the
caption timings. Add music and SFX at the frames in section 5. Then check everything against
section 8 and fix any issue. Report what you changed.
```
