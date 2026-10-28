"""Reuse the introduction's exact Kordify audio in 'get Kordify dot com'."""
import array
import asyncio
import json
import math
from pathlib import Path
import subprocess
import wave

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
FFMPEG = ROOT / "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe"
RATE = 48000


def read_pcm(path):
    with wave.open(str(path), "rb") as wav:
        assert wav.getframerate() == RATE and wav.getnchannels() == 1
        pcm = array.array("h")
        pcm.frombytes(wav.readframes(wav.getnframes()))
        return pcm


def slice_ms(pcm, start, end):
    return pcm[round(start * 48):round(end * 48)]


def rms(pcm):
    return math.sqrt(sum(s * s for s in pcm) / len(pcm))


def soften(pcm):
    result = array.array("h", pcm)
    for i in range(144):  # Only 3 ms at each join; no rate/pitch changes.
        result[i] = round(result[i] * i / 144)
        result[-i - 1] = round(result[-i - 1] * i / 144)
    return result


async def main():
    source = ROOT / "out/vo-source/url-spoken-30.mp3"
    metadata = source.with_suffix(".json")
    if not source.exists() or not metadata.exists():
        source.parent.mkdir(parents=True, exist_ok=True)
        boundaries = []
        with source.open("wb") as audio:
            async for chunk in edge_tts.Communicate(
                "get Kordify dot com.", "en-US-AndrewNeural", rate="+30%", boundary="WordBoundary"
            ).stream():
                if chunk["type"] == "audio":
                    audio.write(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    boundaries.append(dict(text=chunk["text"], startMs=chunk["offset"] / 10000,
                                           endMs=(chunk["offset"] + chunk["duration"]) / 10000))
        metadata.write_text(json.dumps(boundaries, indent=2))
    boundaries = json.loads(metadata.read_text())
    assert [w["text"] for w in boundaries] == ["get", "Kordify", "dot", "com"]
    decoded = source.with_suffix(".wav")
    subprocess.run([str(FFMPEG), "-v", "error", "-y", "-i", str(source),
                    "-c:a", "pcm_s16le", "-ac", "1", "-ar", str(RATE), str(decoded)], check=True)
    url = read_pcm(decoded)
    master_path = ROOT / "public/audio/vo.wav"
    master = read_pcm(master_path)
    words_path = ROOT / "public/audio/vo-words.json"
    words = json.loads(words_path.read_text())
    intro = next(w for w in words if w["scene"] == 5 and w["text"] == "Kordify")
    prefix = [w for w in words if w["scene"] == 11][:5]
    assert prefix[-1]["text"] == "at"
    insert_ms = prefix[-1]["endMs"] + 9.625
    brand_start, brand_end = intro["startMs"] - 5, intro["endMs"] + 65
    brand = slice_ms(master, brand_start, brand_end)
    raw_brand = slice_ms(url, boundaries[1]["startMs"], boundaries[1]["endMs"])
    gain = min(rms(slice_ms(master, intro["startMs"], intro["endMs"])) / rms(raw_brand),
               23197 / max(abs(s) for s in url))
    url = array.array("h", [round(s * gain) for s in url])
    get_start, get_end = boundaries[0]["startMs"] - 30, boundaries[1]["startMs"] - 5
    dot_start, dot_end = boundaries[2]["startMs"] - 5, boundaries[-1]["endMs"] + 100
    parts = [slice_ms(url, get_start, get_end), brand, slice_ms(url, dot_start, dot_end)]
    starts, assembled = [], array.array("h")
    for part in parts:
        starts.append(insert_ms + len(assembled) / 48)
        assembled.extend(soften(part))
        assembled.extend(array.array("h", [0]) * 720)  # 15 ms word spacing.
    end_ms = insert_ms + len(assembled) / 48
    assert end_ms < 29700, "CTA pronunciation must finish before the final visual hold"
    start_sample = round(insert_ms * 48)
    master[start_sample:] = array.array("h", [0]) * (len(master) - start_sample)
    master[start_sample:start_sample + len(assembled)] = assembled
    with wave.open(str(master_path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(RATE)
        wav.writeframes(master.tobytes())
    new_words = []
    for word, source_start, destination_start in [
        (boundaries[0], get_start, starts[0]), (intro, brand_start, starts[1]),
        (boundaries[2], dot_start, starts[2]), (boundaries[3], dot_start, starts[2]),
    ]:
        start = word["startMs"] - source_start + destination_start
        end = word["endMs"] - source_start + destination_start
        new_words.append(dict(text=word["text"], scene=11, startMs=start, endMs=end,
                              timestampMs=(start + end) / 2, confidence=None))
    words_path.write_text(json.dumps([w for w in words if w["scene"] != 11] + prefix + new_words, indent=2))
    manifest_path = ROOT / "src/voiceover.json"
    manifest = json.loads(manifest_path.read_text())
    manifest[-1].update(endMs=end_ms, spokenText="Start your free trial at get Kordify dot com.",
                        pronunciationSource="Scene 5 Kordify audio reused at original pitch and speed",
                        reusedBrandStartMs=starts[1], reusedBrandSourceStartMs=brand_start,
                        reusedBrandSamples=len(brand))
    manifest_path.write_text(json.dumps(manifest, indent=2))
    subprocess.run([str(FFMPEG), "-v", "error", "-y", "-i", str(master_path),
                    "-c:a", "libmp3lame", "-b:a", "192k", str(ROOT / "public/audio/vo.mp3")], check=True)
    print(f"Exact introduction pronunciation reused; dot com spoken explicitly; CTA ends {end_ms / 1000:.3f}s")


if __name__ == "__main__":
    asyncio.run(main())
