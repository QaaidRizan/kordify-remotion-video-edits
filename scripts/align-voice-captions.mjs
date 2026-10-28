import { readFileSync, writeFileSync } from "node:fs";

const words = JSON.parse(readFileSync("public/audio/vo-words.json", "utf8"));
const scenes = [
  ...readFileSync("src/scenes.ts", "utf8").matchAll(
    /id: (\d+),\s+from: (\d+),\s+dur: (\d+),[\s\S]*?words: (\[[^\]]+\])/g,
  ),
].map((m) => ({
  id: Number(m[1]),
  from: Number(m[2]),
  dur: Number(m[3]),
  words: JSON.parse(m[4]).join(" ").split(" "),
}));
// These are the script's short editorial captions, not verbatim subtitles.
// Map each caption word to the measured spoken concept. The service reports
// Legacy Edge speech grouped "One place"; the new Whisper transcript splits it.
const anchors = [
  [6, 7, 9, 10],
  [0, 1, 2, 3, 4, 6],
  [0, 1, 2, 3],
  [2, 3, 4, 5],
  [0, 1],
  [0, 2, 3, 4, 5],
  [2, 3, 5, 9],
  [1, 3, 5],
  [0, 1, 3, 5, 8],
  [0, 1, 2, 3, 3],
  [0, 1, 2, 3],
];
const narration = JSON.parse(readFileSync("src/voiceover.json", "utf8"));
if (narration[0].voice.startsWith("Kokoro")) anchors[9] = [0, 1, 2, 3, 4];
if (scenes.length !== 11) throw new Error("Expected 11 scene configurations");
const captions = Object.fromEntries(
  scenes.map((scene, i) => {
    const spoken = words.filter((word) => word.scene === scene.id);
    if (scene.words.length !== anchors[i].length)
      throw new Error(`Check scene ${scene.id} caption mapping`);
    return [
      scene.id,
      scene.words.map((text, j) => {
        const anchor = spoken[anchors[i][j]];
        if (!anchor) throw new Error(`Missing spoken anchor ${scene.id}:${j}`);
        return {
          text,
          startMs: Math.max(0, anchor.startMs - (scene.from / 30) * 1000 - 65),
          endMs: anchor.endMs - (scene.from / 30) * 1000,
          timestampMs: null,
          confidence: null,
        };
      }),
    ];
  }),
);
writeFileSync(
  "src/caption-timings.json",
  JSON.stringify(captions, null, 2) + "\n",
);
console.log("Aligned all 11 scenes to measured speech boundaries.");
