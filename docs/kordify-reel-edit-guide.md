> Approved pacing revision (25 October 2026): keep all script copy and extend the edit for clear, natural narration. Current duration: 1,028 frames / 34.2667 seconds. The original 30-second timing table below is retained as a reference; `src/scenes.ts` is the current timeline.

# Kordify 30s Reel: Remotion Edit Guide

For any code agent (Claude Code, Codex, Cursor, etc.) working inside a Remotion project.
Follow it together with `kordify-reel-script.md`. If the `reel-motion-explainer` and
`remotion-best-practices` skills are installed, read both first. This guide is
self-contained, so it still works without them.

**Goal:** 1080x1920, 30 fps, 900 frames (30 s), 11 scenes, dark cinematic look, mascot,
word-by-word kinetic captions, floating 3D-tilted cards, scene HUD with progress bar,
whoosh/pop sound design.

---

## 1. Setup

```bash
npx create-video@latest kordify-reel      # blank TypeScript template
cd kordify-reel
npx skills add remotion-dev/skills        # official Remotion agent skills
npm i zod @remotion/google-fonts @remotion/captions @remotion/media-utils
# optional: npm i @remotion/three three @react-three/fiber
npm run dev                               # Remotion Studio
```

Rules for the agent:
- Everything is driven by `useCurrentFrame()`, `spring()`, `interpolate()`. Never use CSS transitions or CSS animations.
- Each scene is a `<Sequence from durationInFrames>`. No `TransitionSeries`; instead fade each scene's elements out over its last 6 frames and fade the next scene in over its first 6 frames, so total length stays exactly 900.
- Load assets with `staticFile()`. Load fonts with `@remotion/google-fonts`.
- Build ONE reusable `<Scene config={...}/>` component and a `scenes.ts` array. Do not hand-write 11 separate scene files.

## 2. Project structure

```
src/
  Root.tsx              // <Composition id="KordifyReel" width=1080 height=1920 fps=30 durationInFrames=900/>
  scenes.ts             // scene config array (section 6)
  KordifyReel.tsx       // maps scenes -> <Sequence>, global audio, progress bar
  components/
    Scene.tsx           // background + HUD + mascot + caption + hero
    Background.tsx      // glow, grid floor, particles, vignette, grain
    Hud.tsx             // "NN / 11 - LABEL" + progress bar
    Caption.tsx         // word-by-word captions
    Mascot.tsx          // pose swap + idle bob
    FloatingCard.tsx    // 3D tilted card
    heroes/             // one file per hero type in section 7
public/
  assets/               // app screenshots, logo (section 3)
  character/            // mascot poses (section 3)
  audio/                // vo.mp3, music.mp3, sfx (section 8)
```

## 3. Assets required (exact filenames)

### Product screenshots (from getkordify.com, save into `public/assets/`)

The page links these files. If a direct path does not work, download them with the `_next/image` URLs listed on the page, or save them manually.

| File | Used in scene | What it shows |
|------|---------------|---------------|
| `phone-1-jobs` | 11 (and 6 optional) | My jobs list |
| `phone-2-job` | 6 | Job screen, map, "On my way" |
| `phone-3-checklist` | 8 | Required/optional checklist |
| `phone-4-evidence` | 8 | Photos as proof of work |
| `phone-6-offline` | 7 | Offline banner, saved jobs |
| `phone-7-signature` | 8 | Customer signature pad |
| `feature-graphic` | optional | Technician app overview |
| `app-icon` | 5, 11 | Kordify app icon |

Likely source path (taken from the page's image URLs, so check it): `https://www.getkordify.com/app/<filename>`

Optional, only if you already have real web app screenshots: `web-dispatch.png` (scene 6) and `web-invoice.png` (scene 9). If you do not have them, build simple illustrative UI mocks in React and keep them generic (no fake customer data or real numbers).

### Mascot (generate once, transparent PNGs, same character and style in all poses)

Save to `public/character/`: `stressed.png`, `think.png`, `wave.png`, `cool.png`, `happy.png`, `point.png`. Size about 900x1400.

Image-generation prompt (use once to get a consistent sheet):
> Chibi cartoon field-service technician mascot, hard hat, work vest with tool belt, big expressive eyes, clean flat shading with soft rim light, full body, front view, transparent background. Poses: stressed (hands on head), thinking (hand on chin), waving, cool (sunglasses, thumbs up), happy (closed-eye smile), pointing down at the viewer. Same character in every pose.

(You can use the Kordify logo as the hero instead of a mascot. Then drop the mascot and give the logo the idle bob.)

## 4. Style tokens

Sample the real brand colors from `app-icon.png` and the website. Fall back to these:

```ts
export const theme = {
  bg: "#07080d",
  text: "#f4f1ec",
  accent: "#ff7a3d",          // swap for Kordify brand color
  mood: {
    problem: "#ff3b3b",       // scenes 1-4
    warm:    "#ff7a3d",       // scenes 5, 9, 11
    fix:     "#3b82ff",       // scenes 6-8
    success: "#22c55e",       // scene 10
  },
};
```

Fonts (via `@remotion/google-fonts`):
- HUD and UI labels: `JetBrains Mono`
- Caption words: `Inter` weight 800-900
- Accent word: `Instrument Serif` italic

Safe zones: keep key content out of the top 250 px and bottom 340 px (platform UI), except the HUD strip at the very top.

## 5. Shared components (behavior)

- **Background:** `bg` color, radial glow behind the mascot that crossfades to the scene's mood color over 8 frames, faint perspective grid floor, 30-40 drifting particles, vignette, subtle grain (low-opacity noise PNG or SVG filter), giant outlined low-opacity "ghost word" behind the caption.
- **Hud:** top-left `NN / 11 - LABEL` in mono small caps with an orange dot; a thin progress bar across the top filling by `frame / 900` for the whole reel.
- **Caption:** at about y = 62% of the height. Words appear one by one (spring pop, rise 10 px, blur 6 px to 0). Accent word is an orange filled pill or orange italic serif. Max 5 words on screen. Word start frames are distributed evenly across the first 70% of the scene unless `vo-words.json` timings exist (section 8).
- **Mascot:** bottom center, same position every scene. Idle bob (sin wave, 5 px) plus 1.5 deg sway. On scene start, swap the pose with a scale pop 0.9 to 1.05 to 1.
- **FloatingCard:** rounded dark card, 1 px border in the mood color, soft glow, `perspective: 1200px`, `rotateX/rotateY` between 8 and 20 deg, slow drift, spring entrance from off-screen with 4-6 frame stagger.
- **Camera push:** wrap each scene in a slow scale 1.00 to 1.05.

## 6. Scene config (`scenes.ts`)

Create exactly this data (frames at 30 fps, `from` is the start in the full timeline):

```ts
export const scenes = [
  { id: 1,  from: 0,   dur: 90, label: "THE CHAOS",   mood: "problem", pose: "stressed", hero: "noSignal",
    words: ["No signal.", "Status:", "unknown."], accent: "unknown." },
  { id: 2,  from: 90,  dur: 75, label: "THE MESS",    mood: "problem", pose: "think",    hero: "messyPile",
    words: ["Jobs", "lost", "in", "texts,", "notes,", "sheets"], accent: "lost" },
  { id: 3,  from: 165, dur: 75, label: "NO PROOF",    mood: "problem", pose: "stressed", hero: "noProof",
    words: ["No", "proof", "of", "work"], accent: "proof" },
  { id: 4,  from: 240, dur: 75, label: "LATE PAY",    mood: "problem", pose: "think",    hero: "lateInvoice",
    words: ["Invoices", "go", "out", "late"], accent: "late" },
  { id: 5,  from: 315, dur: 60, label: "MEET KORDIFY",mood: "warm",    pose: "wave",     hero: "logoReveal",
    words: ["Meet", "Kordify"], accent: "Kordify" },
  { id: 6,  from: 375, dur: 75, label: "DISPATCH",    mood: "fix",     pose: "cool",     hero: "dispatchBoard",
    words: ["Dispatch", "from", "the", "web", "app"], accent: "Dispatch" },
  { id: 7,  from: 450, dur: 90, label: "OFFLINE",     mood: "fix",     pose: "happy",    hero: "offlinePhone",
    words: ["Works", "offline,", "syncs", "later"], accent: "offline," },
  { id: 8,  from: 540, dur: 90, label: "PROOF",       mood: "fix",     pose: "cool",     hero: "proofStack",
    words: ["Checklist.", "Photos.", "Signature."], accent: "Signature." },
  { id: 9,  from: 630, dur: 90, label: "GET PAID",    mood: "warm",    pose: "happy",    hero: "invoicePaid",
    words: ["Job", "done,", "invoice", "sent,", "paid"], accent: "paid" },
  { id: 10, from: 720, dur: 90, label: "ONE PLACE",   mood: "success", pose: "cool",     hero: "bigOne",
    words: ["Request", "to", "paid.", "One", "place."], accent: "One place." },
  { id: 11, from: 810, dur: 90, label: "TRY IT",      mood: "warm",    pose: "point",    hero: "cta",
    words: ["Start", "your", "free", "trial"], accent: "free trial" },
] as const;
```

HUD label shows `NN / 11 - LABEL`.

## 7. Hero effects, scene by scene (frames are relative to the scene start)

**1 noSignal (0-90):** A tilted phone card enters at f4 with a signal-bars icon that gets a red diagonal strike at f14. A red card reading `JOB STATUS: ???` pops at f22 and its question marks pulse. Subtle screen shake at f14. SFX: whoosh f4, error buzz f14.

**2 messyPile (90-165):** 5 tilted cards fly in with stagger (f0-f20): a sticky note, a spreadsheet card, a "missed call" card, a chat-bubble card, and a "who has this job?" note. Cards jitter slightly and overlap. Keep the text generic and do not use any real brand logos. SFX: 3 quick pops.

**3 noProof (165-240):** Left: empty photo frame with a dashed outline and a red `?`. Right: an empty signature line. Both shake lightly at f20. A red "NO PROOF" stamp slams in at f28 with a scale overshoot. SFX: stamp thud.

**4 lateInvoice (240-315):** An invoice card with an `OVERDUE` chip. A red timer (mono font) counts up quickly. Two more invoice cards stack behind it. Red glow pulses. SFX: ticking, error.

**5 logoReveal (315-375):** The red glow flips to warm orange. White flash for 3 frames. `app-icon.png` springs in from scale 0.4 with overshoot, a ring pulse expands, small particles burst. The mascot swaps to `wave`. SFX: riser into pop.

**6 dispatchBoard (375-450):** A dark web-app mock (real `web-dispatch.png` if available). Three columns: Scheduled, On the way, Completed. Job cards slide from Scheduled into technician lanes (f10-f40). A small live-map pin with a pulse ring appears at f45. Use `phone-2-job.webp` as a floating tilted card on the right at f20. SFX: soft clicks on each card move.

**7 offlinePhone (450-540):** `phone-6-offline.webp` as a big tilted phone (rotateY about -14 deg) with a floating `OFFLINE` chip. At f40 a progress ring runs on the phone, and at f55 a green `Synced` check pops with a small spark. SFX: pop on offline chip, success ding at f55.

**8 proofStack (540-630):** Three phones fan out in 3D: `phone-3-checklist.webp` (left), `phone-4-evidence.webp` (center), `phone-7-signature.webp` (right), staggered 8 frames. Green check badges tick onto each at f30, f45, f60. Mono tags `TIME-STAMPED` and `REQUIRED` hang off the middle card. SFX: click for each check.

**9 invoicePaid (630-720):** An invoice card (`web-invoice.png` or an illustrative mock with placeholder values) slides in. Status chip `OVERDUE` (red) flips to `PAID` (green) at f50 with a flip animation. A bell icon pings twice before the flip to show reminders. SFX: bell ping x2, success ding at f50.

**10 bigOne (720-810):** A huge extruded orange `1` (stacked text-shadows or `@remotion/three`) with a label `PLACE` under it, glow and underline wipe. Chips fly in: `14-DAY FREE TRIAL`, `NO CREDIT CARD`, `FREE IN EARLY ACCESS`. SFX: bass hit on the 1, pops on chips.

**11 cta (810-900):** `phone-1-jobs.webp` tilted on the left, `app-icon.png` above, a large button `Start free trial` that pulses, URL pill `getkordify.com` below it. Tiny text at the bottom (above the safe zone): `Android app on Google Play. iPhone coming soon. Early access.` Mascot points at the button. Last 10 frames: hold, no fade, so the loop restarts cleanly. SFX: riser then pop.

## 8. Audio

Files in `public/audio/`: `vo.mp3`, `music.mp3`, `whoosh.mp3`, `pop.mp3`, `click.mp3`, `error.mp3`, `success.mp3`, `riser.mp3`.

1. Generate `vo.mp3` from the voiceover in `kordify-reel-script.md` (ElevenLabs or your own recording). Target 28-29 s so it fits.
2. Get word timings (Whisper via `@remotion/install-whisper-cpp`, or the TTS provider's timestamps) and save `vo-words.json`. Convert to frames with `@remotion/captions` and use them for caption `start` frames instead of even spacing.
3. Place each SFX with `<Sequence from>` at the frames named in section 7.
4. Music at about 0.15 volume, ducked a further 6-10 dB under the voice. Use royalty-free music.

## 9. Render

```bash
npx remotion render KordifyReel out/kordify-reel.mp4 --codec=h264
```

## 10. QA checklist

- [ ] Exactly 900 frames, 1080x1920, nothing important in the unsafe top/bottom zones
- [ ] Something moves at least every 0.5 s
- [ ] Every scene readable with the sound off
- [ ] Colors shift red (1-4), warm (5), blue (6-8), warm (9), green (10), warm (11)
- [ ] Mascot sits in the same place in every scene and changes pose each scene
- [ ] Only true claims on screen (offline Android app, checklist/photo/signature, invoices, reminders, 14-day trial). No AI claims
- [ ] Captions match the voiceover timing
- [ ] No CSS transitions used anywhere

## 11. Master prompt (paste this into the code agent)

```
Use the Remotion best practices skill (and the reel-motion-explainer skill if installed).
Build the 30-second 1080x1920 30fps Remotion reel described in kordify-reel-edit-guide.md,
using the script in kordify-reel-script.md. Create the project structure from section 2,
the scenes.ts from section 6, one reusable Scene component, and a hero component for each
scene from section 7. Use placeholder assets if a file is missing and list what is missing.
Do not use CSS transitions. Render a draft preview after each group of 3 scenes and let me
review before you continue. Ask me one question at a time if anything is unclear.
```
