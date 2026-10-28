# Kordify Reel #3: Remotion Edit Guide ("Prove the Job Was Done")

For any code agent (Codex, Claude Code, Cursor) inside the existing Remotion project.
Use it with `kordify-proof-reel-script.md`.

**Goal:** 1080x1920, 30 fps, 900 frames (30 s), 10 scenes, with the same components and the same theme the project already has (kinetic captions, HUD with progress bar, mascot, floating cards, sound design).

## 0. How to use

Add a third composition to the same project that holds reels #1 and #2. Reuse `Scene`, `Background`, `Hud`, `Caption`, `Mascot` and `FloatingCard`. Take every color and font from the project's existing theme (`src/brand.ts` / `theme`). Do not redefine or change the theme.

Skills: `remotion-best-practices` and `reel-motion-explainer`.

## 1. Rules for the agent

- All animation uses `useCurrentFrame()`, `spring()`, `interpolate()`. No CSS transitions or animations.
- Register: `<Composition id="KordifyProofReel" width={1080} height={1920} fps={30} durationInFrames={900} />`.
- No `TransitionSeries`. Fade each scene's elements out over its last 6 frames and the next scene in over its first 6 frames, so the total stays exactly 900.
- One reusable `<Scene config={...}/>`, driven by `src/scenesProof.ts`. New heroes go in `src/components/heroesProof/`.
- Only claims from the script. No invented numbers. No real customer names, faces, addresses or brands in any mock.
- Keep key content out of the top 250 px and bottom 340 px (platform UI), except the HUD strip.

## 2. Image checklist

You already have the phone screenshots and mascot from reels #1 and #2. Nothing new is required.

| File | Status | Used in scene | Notes |
|------|--------|---------------|-------|
| `public/assets/phone-3-checklist.webp` | Have | 4, 5 | Required and optional checklist steps |
| `public/assets/phone-4-evidence.webp` | Have | 6 | Photos screen |
| `public/assets/phone-7-signature.webp` | Have | 7 | Signature pad |
| `public/assets/phone-6-offline.webp` | Have | 9 | Offline banner |
| `public/assets/app-icon.png` | Have | 10 | |
| `public/character/stressed.png`, `think.png`, `wave.png`, `cool.png`, `happy.png`, `point.png` | Have | all | No new poses needed |
| `public/assets/before.jpg`, `public/assets/after.jpg` | **NEW, optional** | 6 | Two generic photos of the same spot, before and after (for example a dirty and a clean surface, or an AC unit before and after service). No people, no readable addresses, no customer logos. If missing, the agent uses neutral placeholder tiles and says so |

If any file is missing, use a placeholder and list what is missing at the end of the reply.

## 3. Scene config (`src/scenesProof.ts`)

Frames at 30 fps; `from` is the start in the full timeline.

```ts
export const scenesProof = [
  { id: 1,  from: 0,   dur: 75,  label: "PROVE IT",     mood: "problem", pose: "stressed", hero: "disputeBubble",
    words: ["\"You", "didn't", "do", "that.\"", "Prove", "it."], accent: "Prove it." },
  { id: 2,  from: 75,  dur: 75,  label: "SAME ARGUMENT",mood: "problem", pose: "think",    hero: "tradeChips",
    words: ["Cleaning.", "HVAC.", "Same", "argument."], accent: "Same argument." },
  { id: 3,  from: 150, dur: 90,  label: "THE DISPUTE",  mood: "problem", pose: "stressed", hero: "jobDispute",
    words: ["Job", "done.", "Customer", "says", "no."], accent: "no." },
  { id: 4,  from: 240, dur: 90,  label: "MANDATORY",    mood: "fix",     pose: "cool",     hero: "requiredChecklist",
    words: ["You", "decide", "what's", "mandatory"], accent: "mandatory" },
  { id: 5,  from: 330, dur: 75,  label: "LOCKED",       mood: "fix",     pose: "point",    hero: "lockedClose",
    words: ["Can't", "close", "the", "job", "until", "it's", "done"], accent: "until it's done" },
  { id: 6,  from: 405, dur: 90,  label: "PHOTOS",       mood: "fix",     pose: "happy",    hero: "stampedPhotos",
    words: ["Before", "+", "after", "photos,", "time", "and", "place", "stamped"], accent: "time and place" },
  { id: 7,  from: 495, dur: 75,  label: "SIGNATURE",    mood: "fix",     pose: "wave",     hero: "signatureDraw",
    words: ["Customer", "signs", "on", "the", "screen"], accent: "signs" },
  { id: 8,  from: 570, dur: 90,  label: "EVIDENCE",     mood: "success", pose: "cool",     hero: "evidenceLock",
    words: ["Evidence", "can't", "be", "edited"], accent: "can't be edited" },
  { id: 9,  from: 660, dur: 105, label: "OFFLINE",      mood: "fix",     pose: "happy",    hero: "offlineSync",
    words: ["Even", "with", "no", "signal"], accent: "no signal" },
  { id: 10, from: 765, dur: 135, label: "TRY IT",       mood: "warm",    pose: "point",    hero: "cta",
    words: ["Try", "it", "free", "for", "14", "days"], accent: "free" },
] as const;
```

HUD label shows `NN / 10 - LABEL`. Total = 900 frames.

## 4. Hero effects, scene by scene (frames are relative to the scene start)

**1 disputeBubble (75):** A customer speech bubble `"You didn't do that."` pops in at f6 with a slight shake. A job card sits below it. A large `?` stamps over the job card at f30. SFX: whoosh f4, thud f30.

**2 tradeChips (75):** Two tag cards `CLEANING` and `HVAC` (each with a simple icon, such as a spray bottle and a snowflake) slide in from opposite sides at f6-f20 and meet in the middle. An `=` sign pops between them at f34. Mascot swaps to `think`. SFX: two quick pops, small click on the `=`.

**3 jobDispute (90):** A job card with a `DONE` chip slides in from the left. A customer card with a red cross and the words `"Not done."` slides from the right. They push against each other and jitter (f30-f70). A "?" appears above them at f60. SFX: bump, error buzz.

**4 requiredChecklist (90):** `phone-3-checklist.webp` is the hero, tilted slightly. Over the steps, `REQUIRED` tags stamp on one by one (f20, f34, f48) and one step gets an `OPTIONAL` tag at f60. SFX: stamp thud for each REQUIRED tag.

**5 lockedClose (75):** A `Complete job` button mock sits at the center with a padlock icon and a greyed state. Three small check items above it tick one by one (f12, f26, f40). At f48 the padlock opens with a small turn, the button becomes active, and a green pulse runs through it. Label under it: `ILLUSTRATIVE`. SFX: ticks, unlock click at f48.

**6 stampedPhotos (90):** `phone-4-evidence.webp` on the left or center, with two photo tiles `BEFORE` and `AFTER` (use `before.jpg`, `after.jpg` or placeholders) floating next to it. A clock icon and a map pin icon drop onto each tile at f30 and f42 with a `TIME` and `PLACE` mono tag. SFX: camera shutter, two pops.

**7 signatureDraw (75):** `phone-7-signature.webp` as the hero. A signature line draws itself across the signature pad area using an animated SVG stroke (`strokeDashoffset`) from f10 to f40. A green check circle pops at f48. SFX: soft pen scratch, success ding at f48.

**8 evidenceLock (90):** Three small cards (`CHECKLIST`, `PHOTOS`, `SIGNATURE`) slide in and fold into one `JOB FILE` card (f10-f40). A padlock snaps shut on it at f50, and a tag `CAN'T BE EDITED AFTERWARDS` stamps on at f60. Mascot swaps to `cool`. SFX: whoosh, lock click, stamp.

**9 offlineSync (105):** `phone-6-offline.webp` tilted in. A small `NO SIGNAL` chip pulses at f15. At f50 a sync ring runs around the phone, and at f65 a green `Synced` check pops with a small spark. SFX: pop, success ding at f65.

**10 cta (135):** `app-icon.png` above, a pulsing `Start free trial` button, URL pill `getkordify.com`, and two chips: `14-DAY FREE TRIAL` and `NO CREDIT CARD`. Tiny text near the bottom (above the safe zone): `Android app on Google Play. iPhone coming soon. Early access.` Hold the last 10 frames static. SFX: riser then pop.

## 5. Audio

Files in `public/audio/`: `proof-vo.mp3`, `music.mp3`, `whoosh.mp3`, `pop.mp3`, `click.mp3`, `error.mp3`, `success.mp3`, `stamp.mp3`, `lock.mp3`, `shutter.mp3`, `riser.mp3`.

1. Generate `proof-vo.mp3` from the voiceover in `kordify-proof-reel-script.md`. Target 27-29 s.
2. Get word timestamps (Whisper via `@remotion/install-whisper-cpp` or the TTS provider), save `src/proof-vo-words.json`, and use `@remotion/captions` to set caption `start` frames.
3. Place SFX with `<Sequence from>` at the frames in section 4.
4. Music at about 0.15 volume, ducked a further 6-10 dB under the voice.
5. If the voice length differs from plan, adjust scene durations in `scenesProof.ts` and the total in `Root.tsx`. Don't speed up the voice.

## 6. Render

```bash
npx remotion still KordifyProofReel out/proof-f120.png --frame=120     # spot checks
npx remotion render KordifyProofReel out/kordify-proof-reel.mp4 --codec=h264
```

## 7. QA checklist

- [ ] 900 frames, 1080x1920, nothing important in the top 250 px / bottom 340 px (except the HUD)
- [ ] Something moves at least every 0.5 s
- [ ] Every scene readable with the sound off
- [ ] Mascot in the same place every scene, new pose each scene
- [ ] Theme and fonts come from the project's existing theme, with no hardcoded colors
- [ ] Only true claims: mandatory checklist/photos/signature, time-and-place stamps, evidence can't be edited afterwards, offline sync, 14-day trial, no card
- [ ] No "legally binding", no stats, no recurring-schedule or HVAC-specific feature claims
- [ ] Mocks contain no real names, faces, addresses or brands
- [ ] Captions match the voice timing
- [ ] No CSS transitions

## 8. Staged prompts (paste one at a time)

**Prompt 1: setup**
```
Read docs/kordify-proof-reel-edit-guide.md and docs/kordify-proof-reel-script.md. Use
$remotion-best-practices and $reel-motion-explainer. Add the KordifyProofReel composition
(1080x1920, 30fps, 900 frames) to the existing project and create src/scenesProof.ts from
section 3. Reuse the existing Scene, Background, Hud, Caption, Mascot and FloatingCard and the
project's existing theme. Render stills at frames 30 and 200 and show me.
```

**Prompt 2: scenes 1-4**
```
Build hero components disputeBubble, tradeChips, jobDispute and requiredChecklist as described in
section 4, using phone-3-checklist.webp. Render a still in the middle of each scene.
```

**Prompt 3: scenes 5-8**
```
Build lockedClose, stampedPhotos, signatureDraw and evidenceLock from section 4, using
phone-4-evidence.webp and phone-7-signature.webp. Use public/assets/before.jpg and after.jpg if
they exist, otherwise neutral placeholder tiles. The signature must draw with an animated SVG stroke.
```

**Prompt 4: scenes 9-10**
```
Build offlineSync and cta from section 4, using phone-6-offline.webp and app-icon.png. Keep the
last 10 frames of scene 10 static. Add the small print line above the bottom safe zone.
```

**Prompt 5: audio and polish**
```
Use $remotion-captions with public/audio/proof-vo.mp3 to create src/proof-vo-words.json and set
the caption timings. Add music and SFX at the frames in section 4. Then check everything against
section 7 and fix any issue. Report what you changed.
```
