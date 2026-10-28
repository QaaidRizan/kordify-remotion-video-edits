# Remotion video

## Kordify reels

Open `npm run dev` and select **KordifyMapReel** for the Dispatch + Live Technician Map reel. **KordifyReel** remains the original product reel. Both use the shared brand theme in `src/brand.ts`.

The map reel keeps every approved voiceover line; its duration follows measured narration, as requested. Voice, music, effects and safe-zone overlays are adjustable in Studio.

- Preview: http://localhost:3000/KordifyMapReel
- Checks: `npm run lint`
- Scene stills: `npm run review:map`
- MP4 export: `npm run render:map`
- Production details and missing assets: [docs/production-status.md](docs/production-status.md)


<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i --loglevel=error
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
