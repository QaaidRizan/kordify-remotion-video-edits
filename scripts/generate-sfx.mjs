// Original, deterministic synthesized effects. No downloaded samples or voices.
// Run: node scripts/generate-sfx.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const directory = path.join(root, "public/audio");
mkdirSync(directory, { recursive: true });
const rate = 48000;
const tau = Math.PI * 2;
const sin = (phase) => Math.sin(tau * phase);
const fade = (t, duration, attack = 0.003, release = 0.025) =>
  Math.min(1, Math.max(0, t / attack)) *
  Math.min(1, Math.max(0, (duration - t) / release));
const chirp = (t, start, end, speed) =>
  sin(end * t + (start - end) * speed * (1 - Math.exp(-t / speed)));

function makeNoise(seed) {
  let state = seed;
  let low = 0;
  let bass = 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    const white = state / 2147483648 - 1;
    low += 0.24 * (white - low);
    bass += 0.025 * (low - bass);
    return low - bass;
  };
}

const sounds = {
  disconnect: {
    seconds: 0.34, peak: 0.65, seed: 111,
    fn: (t, d, noise) => {
      const pulse = (start, hz) => {
        const s = t - start;
        return s < 0 || s > 0.14 ? 0 : fade(s, 0.14, 0.004, 0.035) *
          (sin(hz * s) + 0.18 * sin(hz * 2 * s));
      };
      return pulse(0, 940) + pulse(0.16, 590) + noise * Math.exp(-t * 35) * 0.08;
    },
  },
  denied: {
    seconds: 0.46, peak: 0.64, seed: 112,
    fn: (t, d) => {
      const pulse = (start, hz) => {
        const s = t - start;
        return s < 0 || s > 0.21 ? 0 : fade(s, 0.21, 0.006, 0.05) *
          Math.exp(-s * 6) * (sin(hz * s) + 0.24 * sin(hz * 1.5 * s));
      };
      return pulse(0, 510) + pulse(0.20, 380);
    },
  },
  clockTick: {
    seconds: 0.105, peak: 0.65, seed: 113,
    fn: (t, d, noise) => fade(t, d, 0.0008, 0.018) *
      (noise * Math.exp(-t * 115) * 0.55 + sin(1480 * t) * Math.exp(-t * 75) * 0.7 +
        sin(2960 * t) * Math.exp(-t * 110) * 0.22),
  },
  clockTock: {
    seconds: 0.12, peak: 0.62, seed: 114,
    fn: (t, d, noise) => fade(t, d, 0.0008, 0.022) *
      (noise * Math.exp(-t * 100) * 0.5 + sin(970 * t) * Math.exp(-t * 65) * 0.75 +
        sin(1940 * t) * Math.exp(-t * 95) * 0.2),
  },
  location: {
    seconds: 0.48, peak: 0.64, seed: 115,
    fn: (t, d) => fade(t, d, 0.003, 0.07) *
      (chirp(t, 650, 1320, 0.035) * Math.exp(-t * 12) +
        sin(1760 * t) * Math.exp(-t * 10) * 0.2),
  },
  brandBridge: {
    seconds: 1.5, peak: 0.48, seed: 116,
    fn: (t, d, noise) => {
      const body = fade(t, d, 0.11, 0.22) *
        (0.55 + 0.45 * Math.sin(Math.PI * t / d));
      const chord = sin(261.63 * t) * 0.35 + sin(329.63 * t) * 0.25 +
        sin(392 * t) * 0.22 + sin(784 * t) * 0.08;
      const lift = Math.sin(Math.PI * t / d) ** 2;
      return body * chord + lift * (noise * 0.3 + chirp(t, 320, 1600, 0.6) * 0.06);
    },
  },
  whoosh: {
    seconds: 0.34,
    peak: 0.66,
    seed: 101,
    fn: (t, d, noise) => {
      const envelope = Math.sin((Math.PI * t) / d) ** 1.8;
      return envelope * (noise * 0.95 + chirp(t, 620, 110, 0.11) * 0.035);
    },
  },
  pop: {
    seconds: 0.16,
    peak: 0.64,
    seed: 102,
    fn: (t, d, noise) =>
      fade(t, d) *
      (chirp(t, 870, 190, 0.018) * Math.exp(-t * 35) +
        noise * 0.09 * Math.exp(-t * 70)),
  },
  click: {
    seconds: 0.075,
    peak: 0.62,
    seed: 103,
    fn: (t, d, noise) =>
      fade(t, d, 0.001, 0.012) *
      (noise * Math.exp(-t * 125) * 0.65 +
        sin(1800 * t) * Math.exp(-t * 160) * 0.25 +
        sin(640 * t) * Math.exp(-t * 90) * 0.3),
  },
  error: {
    seconds: 0.3,
    peak: 0.58,
    seed: 104,
    fn: (t, d) => {
      const envelope = fade(t, d, 0.008, 0.055) * Math.exp(-t * 5);
      return (
        envelope *
        (sin(165 * t) * 0.55 + sin(221 * t) * 0.24 + sin(330 * t) * 0.12) *
        (0.75 + 0.25 * sin(27 * t))
      );
    },
  },
  success: {
    seconds: 0.82,
    peak: 0.67,
    seed: 105,
    fn: (t, d) => {
      const note = (start, hz, level) => {
        const s = t - start;
        return s < 0
          ? 0
          : level *
              fade(s, d - start, 0.004, 0.075) *
              Math.exp(-s * 8) *
              (sin(hz * s) + 0.22 * sin(hz * 2 * s));
      };
      return (
        note(0, 880, 0.68) +
        note(0.105, 1108.73, 0.48) +
        note(0.21, 1318.51, 0.54)
      );
    },
  },
  riser: {
    seconds: 0.6,
    peak: 0.52,
    seed: 106,
    fn: (t, d, noise) => {
      const envelope =
        Math.sin(((Math.PI / 2) * t) / d) ** 2 * Math.min(1, (d - t) / 0.035);
      return envelope * (noise * 0.9 + sin(160 * t + 850 * t * t) * 0.13);
    },
  },
  stamp: {
    seconds: 0.24,
    peak: 0.72,
    seed: 107,
    fn: (t, d, noise) =>
      fade(t, d, 0.001, 0.04) *
      (chirp(t, 160, 62, 0.025) * Math.exp(-t * 25) * 0.8 +
        noise * Math.exp(-t * 55) * 0.55),
  },
  tick: {
    seconds: 0.055,
    peak: 0.54,
    seed: 108,
    fn: (t, d, noise) =>
      fade(t, d, 0.001, 0.01) *
      (sin(2300 * t) * Math.exp(-t * 220) * 0.4 + noise * Math.exp(-t * 160)),
  },
  bell: {
    seconds: 0.44,
    peak: 0.64,
    seed: 109,
    fn: (t, d) =>
      fade(t, d, 0.003, 0.065) *
      (sin(1174.66 * t) * Math.exp(-t * 11) +
        sin(2351 * t) * Math.exp(-t * 18) * 0.23 +
        sin(3230 * t) * Math.exp(-t * 24) * 0.08),
  },
  bass: {
    seconds: 0.48,
    peak: 0.72,
    seed: 110,
    fn: (t, d, noise) =>
      fade(t, d, 0.003, 0.07) *
      (chirp(t, 125, 52, 0.045) * Math.exp(-t * 10) * 0.8 +
        chirp(t, 250, 104, 0.045) * Math.exp(-t * 15) * 0.2 +
        noise * Math.exp(-t * 70) * 0.07),
  },
};

const manifest = {};
for (const [name, spec] of Object.entries(sounds)) {
  const count = Math.round(rate * spec.seconds);
  const data = new Float64Array(count);
  const noise = makeNoise(spec.seed);
  let peak = 0;
  for (let i = 0; i < count; i++) {
    data[i] = spec.fn(i / rate, spec.seconds, noise());
    peak = Math.max(peak, Math.abs(data[i]));
  }
  // 16-bit stereo PCM; identical channels keep centered UI effects mono-safe.
  const wav = Buffer.alloc(44 + count * 4);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(wav.length - 8, 4);
  wav.write("WAVEfmt ", 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(2, 22);
  wav.writeUInt32LE(rate, 24);
  wav.writeUInt32LE(rate * 4, 28);
  wav.writeUInt16LE(4, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(count * 4, 40);
  for (let i = 0; i < count; i++) {
    const value = Math.round((data[i] / peak) * spec.peak * 32767);
    wav.writeInt16LE(value, 44 + i * 4);
    wav.writeInt16LE(value, 46 + i * 4);
  }
  writeFileSync(path.join(directory, `${name}.wav`), wav);
  manifest[name] = {
    path: `audio/${name}.wav`,
    durationInFrames: Math.ceil(spec.seconds * 30),
    seconds: spec.seconds,
    peakDbFS: Number((20 * Math.log10(spec.peak)).toFixed(2)),
  };
}
writeFileSync(
  path.join(root, "src/sfx-assets.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `Generated ${Object.keys(manifest).length} original effects at ${rate} Hz in public/audio.`,
);
