"""Scene-aligned neural narration; only the public script is sent to Edge TTS.

Requires edge-tts 7.3.1. Speaking rate is chosen during synthesis; no recorded
speech is sped up or cut. Provider word boundaries drive caption anchors.
"""
import asyncio
import array
import json
from pathlib import Path
import re
import subprocess
import sys
import wave

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
FFMPEG = ROOT / "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe"
CACHE = ROOT / "out/vo-source"
VOICE = "en-US-AndrewNeural"
RATE = 48000
STARTS = [0, 90, 165, 240, 315, 375, 450, 540, 630, 720, 810]
DURATIONS = [90, 75, 75, 75, 60, 75, 90, 90, 90, 90, 90]


async def synthesize(index, text, rate):
    path = CACHE / f"scene-{index:02d}-{rate}.mp3"
    meta = path.with_suffix(".json")
    if path.exists() and meta.exists():
        return path, json.loads(meta.read_text())
    words = []
    tts = edge_tts.Communicate(text, VOICE, rate=f"+{rate}%", boundary="WordBoundary")
    with path.open("wb") as audio:
        async for chunk in tts.stream():
            if chunk["type"] == "audio":
                audio.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                start = chunk["offset"] / 10000
                end = (chunk["offset"] + chunk["duration"]) / 10000
                words.append(dict(text=chunk["text"], startMs=start, endMs=end,
                                  timestampMs=(start + end) / 2, confidence=None))
    if not words:
        raise RuntimeError(f"Missing provider word timing for scene {index}")
    meta.write_text(json.dumps(words, indent=2))
    return path, words


def decode(path):
    decoded = path.with_suffix(".wav")
    subprocess.run([str(FFMPEG), "-v", "error", "-y", "-i", str(path),
                    "-c:a", "pcm_s16le", "-ac", "1", "-ar", str(RATE), str(decoded)], check=True)
    with wave.open(str(decoded), "rb") as wav:
        raw = wav.readframes(wav.getnframes())
    pcm = array.array("h")
    pcm.frombytes(raw)
    return pcm


async def main():
    CACHE.mkdir(parents=True, exist_ok=True)
    script = (ROOT / "docs/kordify-reel-script.md").read_text(encoding="utf-8")
    lines = re.findall(r'^> (.+)$', script, re.MULTILINE)
    if len(lines) != 11:
        raise RuntimeError("Expected the exact 11 voiceover lines")
    mix = array.array("h", [0]) * (30 * RATE)
    all_words, manifest = [], []
    for index, (text, start, duration) in enumerate(zip(lines, STARTS, DURATIONS), 1):
        target = duration / 30 - (0.60 if index == 11 else 0.18)
        speed = 30
        for attempt in range(5):
            path, words = await synthesize(index, text, speed)
            pcm = decode(path)
            # Some responses add a long silent tail. Remove only that silence,
            # retaining 100 ms after provider speech boundaries and a release.
            threshold = max(abs(sample) for sample in pcm) * 0.002
            last_audible = next(i for i in range(len(pcm) - 1, -1, -1) if abs(pcm[i]) > threshold)
            safe_end = max(round((words[-1]["endMs"] / 1000 + 0.1) * RATE),
                           last_audible + round(0.07 * RATE))
            pcm = pcm[:safe_end]
            length = len(pcm) / RATE
            if length <= target:
                break
            speed = round((100 + speed) * length / target - 100) + 2
        else:
            raise RuntimeError(f"Scene {index} does not fit without cutting speech")
        offset_ms = (start / 30 + 0.08) * 1000
        for word in words:
            all_words.append({**word, "scene": index,
                              "startMs": round(word["startMs"] + offset_ms, 3),
                              "endMs": round(word["endMs"] + offset_ms, 3),
                              "timestampMs": round(word["timestampMs"] + offset_ms, 3)})
        offset = round(offset_ms / 1000 * RATE)
        mix[offset:offset + len(pcm)] = pcm
        manifest.append(dict(scene=index, text=text, voice=VOICE, synthesisRate=f"+{speed}%",
                             startMs=offset_ms, endMs=offset_ms + length * 1000))
        print(f"Scene {index}: {length:.3f}s, synthesis +{speed}%", flush=True)
    # Normalize the master with headroom for the existing SFX layer.
    peak = max(abs(s) for s in mix)
    gain = (32767 * 10 ** (-3 / 20)) / peak
    normalized = array.array("h", [round(sample * gain) for sample in mix])
    wav_path = ROOT / "public/audio/vo.wav"
    with wave.open(str(wav_path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(RATE)
        wav.writeframes(normalized.tobytes())
    # PCM master avoids encoder padding and is the playback source.
    subprocess.run([str(FFMPEG), "-v", "error", "-y", "-i", str(wav_path),
                    "-c:a", "libmp3lame", "-b:a", "192k", str(ROOT / "public/audio/vo.mp3")], check=True)
    (ROOT / "public/audio/vo-words.json").write_text(json.dumps(all_words, indent=2))
    (ROOT / "src/voiceover.json").write_text(json.dumps(manifest, indent=2))
    print(f"Master: 30 seconds, {len(all_words)} provider word boundaries, -3 dBFS peak")
    subprocess.run([sys.executable, str(ROOT / "scripts/fix-ending-pronunciation.py")], check=True)


if __name__ == "__main__":
    asyncio.run(main())
