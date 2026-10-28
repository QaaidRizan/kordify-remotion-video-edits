# Local rendering

Run `npm run dev` for Studio and `npm run render` to export the reel to
`out/kordify-reel.mp4`. The Render button in Studio uses the same renderer setting.

`remotion.config.ts` reserves port 3000 for Studio and port 3102 for the renderer.
This avoids the observed localhost collision where rendering loaded Studio's
startup HTML and reported that `window.getStaticCompositions` was undefined.

Restart Studio after changing these port settings; they are read at startup.
Do not pass `--port=3000` to a render command, since CLI flags override the config.
For a second simultaneous CLI render, choose another free port such as
`--port=3103`.

Verified with Studio running: a 30-frame H.264/AAC render completed without a
port override. ESLint and TypeScript also passed. The test output is
`out/render-port-check.mp4`; the full reel remains `out/kordify-reel.mp4`.

Remotion's supported port settings:
https://www.remotion.dev/docs/config#setrendererport
