"""Compare the rendered music mix with the saved, approved voice/SFX stem."""
import array
import json
import math
from pathlib import Path
import wave

ROOT = Path(__file__).resolve().parents[1]


def pcm(name):
    with wave.open(str(ROOT / name), "rb") as wav:
        assert wav.getsampwidth() == 2 and wav.getframerate() == 48000
        samples = array.array("h")
        samples.frombytes(wav.readframes(wav.getnframes()))
        return samples


def rms(samples):
    return math.sqrt(sum(s * s for s in samples) / len(samples))


full = pcm("out/kordify-voice-mix.wav")
reference = pcm("out/kordify-dialogue-sfx-reference.wav")
voice = pcm("public/audio/vo.wav")
lines = json.loads((ROOT / "src/voiceover.json").read_text())
assert len(full) == len(reference) == sum(line["durationInFrames"] for line in lines) * 1600 * 2
music = [a - b for a, b in zip(full, reference)]
assert rms(music) > 10, "Background music missing from rendered mix"
lines = json.loads((ROOT / "src/voiceover.json").read_text())
ratios = []
for line in lines:
    a, b = round(line["startMs"] * 48), round(line["endMs"] * 48)
    ratio = 20 * math.log10(rms(voice[a:b]) / max(0.01, rms(music[a * 2:b * 2])))
    assert ratio >= 18, f"Music too loud under speech in scene {line['scene']}"
    ratios.append(dict(scene=line["scene"], voiceAboveMusicDb=round(ratio, 2)))
# Measure the focused SFX transients against music over their first 100 ms.
starts = {line["scene"]: line["fromFrame"] for line in lines}
cues = json.loads((ROOT / "src/sfx-cues.json").read_text())
effects = []
for cue in cues:
    if cue["sound"] not in ["disconnect", "denied", "clockTick", "clockTock", "location"] and not (cue["scene"] == 2 and cue["sound"] == "pop"):
        continue
    a = (starts[cue["scene"]] + cue["offset"]) * 1600
    b = a + 4800
    sfx = [reference[i * 2] - voice[i] for i in range(a, b)]
    ratio = 20 * math.log10(rms(sfx) / max(0.01, rms(music[a * 2:b * 2])))
    effects.append(dict(cue=cue["label"], effectAboveMusicDb=round(ratio, 2)))
assert max(abs(s) for s in full) < 32767
report = {"musicRmsDbfs": round(20 * math.log10(rms(music) / 32768), 2),
          "voiceAboveMusic": ratios, "focusedEffectsAboveMusic": effects,
          "noClipping": True}
(ROOT / "out/music-audio-qa.json").write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))
assert all(effect["effectAboveMusicDb"] >= 6 for effect in effects), "Music masks a requested SFX; see measured ratios above"
