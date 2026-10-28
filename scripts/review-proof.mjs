import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  selectComposition,
  renderStill,
} from "@remotion/renderer";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
mkdirSync("out/proof-review", { recursive: true });
const serveUrl = await bundle({
  entryPoint: path.resolve("src/index.ts"),
  outDir: path.resolve("out/proof-bundle"),
  rspack: true,
});
const browser = await openBrowser("chrome");
try {
  const composition = await selectComposition({
    serveUrl,
    id: "KordifyProofReel",
    puppeteerInstance: browser,
    port: 3106,
  });
  const timeline = JSON.parse(readFileSync("src/proof-voiceover.json", "utf8"));
  const shots = timeline.map((line) => ({
    name: `scene-${String(line.scene).padStart(2, "0")}`,
    frame: line.from + line.dur - 14,
  }));
  shots.push(
    {name: 'opening-page-one', frame: 25},
    {name: 'locked', frame: timeline[4].from + 20},
    {name: 'unlocked', frame: timeline[4].from + 65},
    {name: 'photos-page-one', frame: timeline[5].from + 30},
    {name: 'signature-drawing', frame: timeline[6].from + 35},
    {name: 'evidence-before', frame: timeline[7].from + 15},
    {name: 'offline-before', frame: timeline[8].from + 30},
    {name: 'hold-start', frame: composition.durationInFrames - 10},
    {name: 'hold-end', frame: composition.durationInFrames - 1},
  );
  for (const shot of shots) {
    await renderStill({
      serveUrl,
      composition,
      puppeteerInstance: browser,
      port: 3106,
      frame: shot.frame,
      output: `out/proof-review/${shot.name}.png`,
      scale: 0.5,
    });
    console.log(shot.name, shot.frame);
  }
  for (const [id, frame] of [['KordifyReel', 125], ['KordifyMapReel', 120]]) {
    const reference = await selectComposition({serveUrl,id,puppeteerInstance:browser,port:3106});
    await renderStill({serveUrl,composition:reference,puppeteerInstance:browser,port:3106,frame,output:`out/proof-review/${id}.png`,scale:.5});
  }
  writeFileSync(
    "out/proof-review/manifest.json",
    JSON.stringify(
      {
        width: composition.width,
        height: composition.height,
        fps: composition.fps,
        durationInFrames: composition.durationInFrames,
        shots,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close({ silent: true });
}
