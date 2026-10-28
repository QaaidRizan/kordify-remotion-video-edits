import { bundle } from "@remotion/bundler";
import {
  openBrowser,
  selectComposition,
  renderStill,
} from "@remotion/renderer";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
mkdirSync("out/map-review", { recursive: true });
const serveUrl = await bundle({
  entryPoint: path.resolve("src/index.ts"),
  outDir: path.resolve("out/map-bundle"),
  rspack: true,
});
const browser = await openBrowser("chrome");
try {
  const composition = await selectComposition({
    serveUrl,
    id: "KordifyMapReel",
    puppeteerInstance: browser,
    port: 3104,
  });
  const timeline = JSON.parse(readFileSync("src/map-voiceover.json", "utf8"));
  const shots = timeline.map((line) => ({
    name: `scene-${String(line.scene).padStart(2, "0")}`,
    frame: line.from + line.dur - 14,
  }));
  shots.push(
    { name: "job-number", frame: timeline[4].from + 38 },
    { name: "map-moving", frame: timeline[6].from + 67 },
    { name: "tap-before", frame: timeline[5].from + 23 },
    { name: "tap-after", frame: timeline[5].from + 40 },
    { name: "hold-start", frame: composition.durationInFrames - 10 },
    { name: "hold-end", frame: composition.durationInFrames - 1 },
  );
  for (const shot of shots) {
    await renderStill({
      serveUrl,
      composition,
      puppeteerInstance: browser,
      port: 3104,
      frame: shot.frame,
      output: `out/map-review/${shot.name}.png`,
      scale: 0.5,
    });
    console.log(shot.name, shot.frame);
  }
  const original = await selectComposition({
    serveUrl,
    id: "KordifyReel",
    puppeteerInstance: browser,
    port: 3104,
  });
  for (const frame of [125, 385, 1007]) {
    await renderStill({
      serveUrl,
      composition: original,
      puppeteerInstance: browser,
      port: 3104,
      frame,
      output: `out/map-review/reel-one-${frame}.png`,
      scale: 0.5,
    });
    console.log("reel-one", frame);
  }
  writeFileSync(
    "out/map-review/manifest.json",
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
