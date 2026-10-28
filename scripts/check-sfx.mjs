// Check the exported PCM mix against the authored cue schedule, sample by sample.
// For an isolated SFX export, pass --props with voiceoverVolume: 0 to Remotion.
// The current narration + ducked SFX mix is checked by check-voice-mix.py.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const readJSON = (name) =>
  JSON.parse(readFileSync(path.join(root, name), "utf8"));
function readWav(name) {
  const wav = readFileSync(path.join(root, name));
  let format;
  let pcm;
  for (let offset = 12; offset + 8 <= wav.length; ) {
    const type = wav.toString("ascii", offset, offset + 4);
    const length = wav.readUInt32LE(offset + 4);
    const start = offset + 8;
    if (type === "fmt ")
      format = {
        encoding: wav.readUInt16LE(start),
        channels: wav.readUInt16LE(start + 2),
        rate: wav.readUInt32LE(start + 4),
        bits: wav.readUInt16LE(start + 14),
      };
    if (type === "data") pcm = wav.subarray(start, start + length);
    offset = start + length + (length % 2);
  }
  if (
    !format ||
    !pcm ||
    format.encoding !== 1 ||
    format.bits !== 16 ||
    format.channels !== 2 ||
    format.rate !== 48000
  ) {
    throw new Error(`Expected 48kHz stereo PCM16: ${name}`);
  }
  return { ...format, pcm, samples: pcm.length / 2 };
}

const cues = readJSON("src/sfx-cues.json");
const assets = readJSON("src/sfx-assets.json");
const source = readFileSync(path.join(root, "src/scenes.ts"), "utf8");
const starts = new Map(
  [...source.matchAll(/\bid:\s*(\d+),\s*from:\s*(\d+),/g)].map((m) => [
    Number(m[1]),
    Number(m[2]),
  ]),
);
if (starts.size !== 11) throw new Error("Could not read the 11 scene starts");
const mix = readWav("out/kordify-sfx.wav");
const expected = new Float64Array(mix.samples);
for (const cue of cues) {
  const sound = readWav(`public/${assets[cue.sound].path}`);
  const start = (starts.get(cue.scene) + cue.offset) * 1600 * 2;
  if (!Number.isFinite(start) || start + sound.samples > expected.length)
    throw new Error(`Cue outside reel: ${cue.label}`);
  for (let i = 0; i < sound.samples; i++)
    expected[start + i] +=
      (sound.pcm.readInt16LE(i * 2) / 32768) * cue.gain * 0.85;
}
let peak = 0;
let squareSum = 0;
let clipped = 0;
let maxMixError = 0;
let finalNonSilentSample = 0;
for (let i = 0; i < mix.samples; i++) {
  const integer = mix.pcm.readInt16LE(i * 2);
  const value = integer / 32768;
  peak = Math.max(peak, Math.abs(value));
  squareSum += value * value;
  if (Math.abs(integer) >= 32767) clipped++;
  if (Math.abs(integer) > 2) finalNonSilentSample = i;
  maxMixError = Math.max(maxMixError, Math.abs(value - expected[i]));
}
const report = {
  duration: mix.samples / 2 / mix.rate,
  sampleRate: mix.rate,
  channels: mix.channels,
  cueCount: cues.length,
  scenesWithSound: new Set(cues.map((cue) => cue.scene)).size,
  samplePeakDbFS: Number((20 * Math.log10(peak)).toFixed(2)),
  rmsDbFS: Number(
    (20 * Math.log10(Math.sqrt(squareSum / mix.samples))).toFixed(2),
  ),
  clippedSamples: clipped,
  maximumScheduleError: Number(maxMixError.toFixed(7)),
  lastAudibleTime: Number((finalNonSilentSample / 2 / mix.rate).toFixed(3)),
};
writeFileSync(
  path.join(root, "out/audio-qa.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
if (report.duration !== 30 || clipped || maxMixError > 0.001)
  throw new Error("Audio QA failed");
