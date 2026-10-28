> Approved theme revision, 26 October 2026: use the light website palette instead of the dark treatment. Main background: `#fdfbf7`; alternate background: `#f6f2ed`. Use dark ink captions and lighter card shadows. `src/brand.ts` is the current source of truth; this user direction overrides the dark-video guidance below.

# Kordify Brand Theme for the Reels

Goal: every reel uses the exact colors (and font, if possible) of getkordify.com instead of the placeholder orange in the guides.

The hex values in the earlier guides (`#ff7a3d`, `#07080d`, etc.) are placeholders, not Kordify's real colors. Replace them using this file.

---

## Step 1. Get the real colors (pick one way, 2 minutes)

### Way A: copy the CSS variables from the website (best)

1. Open https://www.getkordify.com in Chrome.
2. Press F12, open the **Console** tab, paste this and press Enter:

```js
const cs = getComputedStyle(document.documentElement);
console.log([...document.styleSheets].flatMap(s => { try { return [...s.cssRules]; } catch { return []; } })
  .filter(r => r.selectorText === ':root' || r.selectorText === '.dark')
  .flatMap(r => [...r.style].filter(n => n.startsWith('--')).map(n => `${r.selectorText} ${n}: ${r.style.getPropertyValue(n).trim()}`))
  .join('\n'));
```

3. Then paste this to get the main button colors and the page background/text:

```js
const b = [...document.querySelectorAll('a,button')].find(e => /start free trial/i.test(e.textContent));
const c = getComputedStyle(b), body = getComputedStyle(document.body);
console.log({ buttonBg: c.backgroundColor, buttonText: c.color, pageBg: body.backgroundColor, pageText: body.color, font: body.fontFamily });
```

4. Copy both outputs and send them to your code agent (or to me).

If the first command prints nothing, the site doesn't use CSS variables. Use Way B.

### Way B: eyedropper

Open `app-icon.png` and the website, and use the Chrome DevTools color picker (click any color swatch in the Styles panel, then the eyedropper) on:
- the main button
- the page background
- card/section background
- headline text and muted text
- any second accent color

### Way C: send me a screenshot

Upload a full-page screenshot of getkordify.com and the app icon here. I'll read the palette from the image and fill in `src/brand.ts` for you.

---

## Step 2. Create `src/brand.ts` (single source of truth)

```ts
// src/brand.ts
// Fill every value from Step 1. Do not leave any "TODO".
export const brand = {
  primary: "TODO",        // main brand color (buttons, logo)
  primarySoft: "TODO",    // lighter or darker tint of primary, used for glows
  secondary: "TODO",      // second brand color; if the site has none, derive a complementary tint of primary
  background: "TODO",     // base page background (use the dark variant if the site has one)
  surface: "TODO",        // card / panel background
  border: "TODO",
  text: "TODO",
  textMuted: "TODO",
  font: "TODO",           // site font family, if it is a Google Font
};

export const theme = {
  bg: brand.background,
  surface: brand.surface,
  border: brand.border,
  text: brand.text,
  muted: brand.textMuted,
  accent: brand.primary,
  mood: {
    problem: "#ef4444",         // semantic red, scenes about pain
    warm: brand.primary,        // reveal, CTA
    fix: brand.secondary,       // solution scenes
    warn: "#f59e0b",            // semantic amber
    success: "#22c55e",         // semantic green
  },
};
```

## Step 3. How the brand colors map to the video

| Video element | Color from the brand |
|---------------|----------------------|
| Background | `brand.background` (a dark base, not pure black) |
| Cards and phones' frames | `brand.surface` with a 1 px `brand.border` |
| Caption text | `brand.text` |
| Accent word, pills, progress bar, CTA button | `brand.primary` |
| Glow behind the mascot in "warm" scenes | `brand.primary` at about 30% opacity |
| Glow in "fix" scenes | `brand.secondary` at about 30% opacity |
| HUD labels, muted tags | `brand.textMuted` |
| Problem / warning / success scenes | Keep red, amber, green (they carry meaning), but tint them slightly toward the brand so they don't clash |

**If the website is light-themed:** keep the video dark for contrast on social, and use the brand's primary as the accent. If you want a light video instead, tell the agent so and flip `background`/`text`, but keep text contrast high.

**Rules**
- Never hardcode a hex color in a component. Always import from `src/theme`/`src/brand`.
- Caption text must have contrast of at least 4.5:1 against the background.
- If the app icon color differs from the website primary, use the website primary for UI and show the icon as it is.
- Match the site's font too if it is on Google Fonts (`@remotion/google-fonts`). Otherwise keep Inter for captions.

---

## Step 4. Prompt for Codex (paste after the reel is scaffolded)

```
Read docs/kordify-brand-theme.md. Use these brand values: <paste the output from Step 1 here>.
Create src/brand.ts from them (no TODO left), derive any missing value sensibly and tell me which
ones you derived. Replace every hardcoded color in src/ with tokens from theme. Update the Background
glow, Hud progress bar, Caption accent pill, FloatingCard border, and CTA button to use the brand
tokens. Render stills of scene 1, scene 5 and the last scene for both compositions so I can compare
them with the website. Do not change layouts or timings.
```

If the agent can't reach getkordify.com, paste the Step 1 output into the prompt instead.

## Checklist

- [ ] Real values collected from Step 1
- [ ] `src/brand.ts` has no "TODO"
- [ ] No hardcoded hex colors left in `src/` (search for `#` in components)
- [ ] Stills of both reels look like the website (same primary, same dark base)
- [ ] Caption contrast is readable on a phone in daylight
