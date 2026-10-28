// Original instrumental score; synthesized locally, no external samples.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
const rate = 48000;
const narration = JSON.parse(readFileSync("src/voiceover.json", "utf8"));
const duration =
  narration.reduce((sum, line) => sum + line.durationInFrames, 0) / 30;
const revealTime = narration[4].fromFrame / 30;
const invoiceStart = narration[3].fromFrame / 30;
const size = Math.round(rate * duration);
const left = new Float64Array(size);
const right = new Float64Array(size);
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
const sine = (cycles) => Math.sin(2 * Math.PI * cycles);
const envelope = (t, d, a, r) => Math.max(0, Math.min(1, t / a, (d - t) / r));
function add(start, seconds, level, pan, sample) {
  const from = Math.round(start * rate);
  const count = Math.min(Math.round(seconds * rate), size - from);
  const l = Math.sqrt((1 - pan) / 2);
  const r = Math.sqrt((1 + pan) / 2);
  for (let i = 0; i < count; i++) {
    const value = sample(i / rate, seconds) * level;
    left[from + i] += value * l;
    right[from + i] += value * r;
  }
}
// 120 BPM. Restrained A-minor opening; C-major colors at the brand reveal.
const chords = [
  [[57, 60, 64, 71], 33],
  [[53, 57, 60, 64], 29],
  [[57, 60, 64, 67], 33],
  [[53, 57, 60, 64], 29],
  [[60, 64, 67, 71], 36],
  [[55, 59, 62, 69], 31],
  [[57, 60, 64, 71], 33],
  [[53, 57, 60, 67], 29],
  [[60, 64, 67, 74], 36],
  [[55, 59, 62, 69], 31],
  [[60, 64, 67, 71], 36],
];
const harmony = narration.map((line, i) => [
  line.fromFrame / 30,
  line.durationInFrames / 30,
  ...chords[i],
]);
for (const [start, length, notes, bass] of harmony) {
  notes.forEach((midi, i) => {
    const frequency = hz(midi);
    add(
      start,
      length + 0.55,
      0.105,
      (i - 1.5) * 0.32,
      (t, d) =>
        envelope(t, d, 0.32, 0.65) *
        (0.75 + 0.05 * sine(t * 0.4)) *
        (sine(frequency * t) * 0.68 +
          sine(frequency * 1.002 * t) * 0.2 +
          sine(frequency * 2 * t) * 0.07),
    );
  });
  // Soft bass pulse, with space where invoice ticking is the focus.
  for (let offset = 0; offset < length - 0.15; offset += 0.5) {
    add(
      start + offset,
      0.36,
      start < revealTime ? 0.13 : 0.17,
      0,
      (t, d) =>
        envelope(t, d, 0.012, 0.12) *
        Math.exp(-t * 5) *
        (sine(hz(bass) * t) + 0.15 * sine(hz(bass) * 2 * t)),
    );
  }
  // Sparse rounded plucks; delay echoes create width without sharp percussion.
  const pattern = start < revealTime ? [0, 2] : [0, 2, 1, 3];
  pattern.forEach((noteIndex, i) => {
    const at = start + 0.25 + i * 0.5;
    if (at >= start + length - 0.2 || at > duration - 1.3) return;
    const frequency = hz(notes[noteIndex] + 12);
    for (let echo = 0; echo < 3; echo++) {
      add(
        at + echo * 0.375,
        1.05,
        (start < revealTime ? 0.055 : 0.075) * 0.3 ** echo,
        (i % 2 ? 0.35 : -0.35) * (echo % 2 ? -1 : 1),
        (t, d) =>
          envelope(t, d, 0.008, 0.2) *
          Math.exp(-t * 5) *
          (sine(frequency * t) + 0.12 * sine(frequency * 2 * t)),
      );
    }
  });
}
// Very gentle heartbeat, deliberately absent during the invoice's tick-tock.
for (let start = 0; start < duration - 2; start += 1) {
  if (start >= invoiceStart && start < revealTime) continue;
  add(
    start,
    0.22,
    0.07,
    0,
    (t, d) =>
      envelope(t, d, 0.006, 0.06) *
      Math.exp(-t * 22) *
      sine(52 * t + 2.8 * (1 - Math.exp(-t / 0.018))),
  );
}
let peak = 0;
let sum = 0;
for (let i = 0; i < size; i++) {
  const fade = envelope(i / rate, duration, 0.45, 1.15);
  left[i] *= fade;
  right[i] *= fade;
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
  sum += left[i] ** 2 + right[i] ** 2;
}
const rms = Math.sqrt(sum / (size * 2));
const gain = Math.min(0.86 / peak, 0.23 / rms);
const wav = Buffer.alloc(44 + size * 4);
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
wav.writeUInt32LE(size * 4, 40);
for (let i = 0; i < size; i++) {
  wav.writeInt16LE(Math.round(left[i] * gain * 32767), 44 + i * 4);
  wav.writeInt16LE(Math.round(right[i] * gain * 32767), 46 + i * 4);
}
mkdirSync("public/audio", { recursive: true });
writeFileSync("public/audio/music.wav", wav);
console.log(
  `Original ${duration.toFixed(2)}s stereo score: 120 BPM, RMS ${(20 * Math.log10(rms * gain)).toFixed(2)} dBFS; peak ${(20 * Math.log10(peak * gain)).toFixed(2)} dBFS.`,
);
