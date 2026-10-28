# Kordify Reel Project

Remotion project (TypeScript) for a 30s 1080x1920 30fps Kordify product reel.

## Always
- Read docs/kordify-reel-edit-guide.md and docs/kordify-reel-script.md before changing anything.
- Use the remotion-best-practices skill and the reel-motion-explainer skill.
- All animation uses useCurrentFrame(), spring(), interpolate(). Never CSS transitions or animations.
- One reusable <Scene> component driven by src/scenes.ts. Do not duplicate scene files.
- Only make claims that are in the script. No AI features, no invented stats.
- If an asset file is missing, use a placeholder and list it at the end of your reply.

## Commands
- Preview: npm run dev
- Check a frame: npx remotion still KordifyReel --frame=<n> out/frame-<n>.png
- Render: npx remotion render KordifyReel out/kordify-reel.mp4 --codec=h264