# Hero effects pass

This records the visual pass. Sound effects have now been added; see
[sound-status.md](sound-status.md). The current video is `out/kordify-reel.mp4`.

All 11 hero components are wired through `components/heroes/Hero.tsx` into the
single reusable `Scene`. The timeline remains 1080 × 1920, 30 fps, 900 frames.
The approved caption, HUD and mood treatment is preserved.

## Implemented

1. Tilted no-signal phone, animated strike, pulsing unknown status and impact shake.
2. Five staggered messy cards: notes, spreadsheet, missed call, message and reminder.
3. Empty proof frame, unsigned line and spring-loaded NO PROOF stamp.
4. Stacked invoices, OVERDUE badge and an illustrative elapsed-time counter.
5. Kordify wordmark burst, warm glow, expanding rings and short flash.
6. Illustrative dispatch board, moving work orders, live-map pin and job screen.
7. Real offline screenshot, sync ring, online state and Synced check.
8. Three-screen proof fan, checklist mock, actual evidence/signature screens,
   three timed checks, REQUIRED and TIME-STAMPED tags.
9. Supplied invoice.png, two reminder bell motions, OVERDUE → PAID flip.
   The invoice preview gives way to a payment-state graphic so its original
   remaining-balance figure does not contradict the final PAID status.
10. Extruded glowing 1 and all three trial/early-access chips.
11. Jobs screen, wordmark, pulsing trial button, URL and exact platform small print.

All animation derives from Remotion frames. The final ten frames remain frozen.
The recurring logo was raised 25 px to clear the CTA small print above y=1580.

## Assets and remaining placeholders

Original user files remain untouched. `invoice.png` is mapped as the invoice asset.
The previous content-based mapping of the mislabeled JPEGs remains in `src/assets.ts`.

- Mascot poses and a separate app icon are still absent: approved wordmark fallback.
- Actual checklist and dispatch screenshots are absent: illustrative React UI.
- No voiceover, music, SFX or word timing files were found in public/.
  The preview is silent; captions retain evenly distributed draft timings.
- No new product screenshots were downloaded.

## Review

- Studio: http://localhost:3000/KordifyReel
- Draft MP4: out/kordify-hero-draft.mp4
- Full-resolution review frames: out/hero-qa/
- Contact sheet: out/hero-contact-sheet.png

ESLint and TypeScript pass. Review frames cover every scene, both offline states,
both invoice states and the final hold. FFprobe verifies the delivered MP4 is H.264,
1080 × 1920, 30 fps, exactly 900 frames and 30.000 seconds (10,209,098 bytes).
There is no audio stream, as expected for this silent visual draft.

Frames 890 and 899 look static with the scene frozen at local frame 80 and the
HUD held. A pixel comparison found 460 differing edge pixels around the tilted
phone in the full-resolution PNGs; these appear to be renderer resampling differences,
so the images are not claimed to be byte-identical.
