"""Assemble normal-speed Kokoro source clips; preserve speech, trim only silence."""
import array
import json
import math
from pathlib import Path
import subprocess
import wave

root = Path(__file__).resolve().parents[1]
folder = root / 'out/voice-review'
ffmpeg = root / 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
source = json.loads((folder / 'kokoro-source.json').read_text(encoding='utf-8'))
rate = 48000
master = array.array('h')
manifest = []
cursor = 0
for index, text in enumerate(source['lines'], 1):
    decoded = folder / f'kokoro-{index:02}-48k.wav'
    subprocess.run([str(ffmpeg), '-y', '-hide_banner', '-loglevel', 'error', '-i', str(folder / f'kokoro-{index:02}.wav'), '-ar', str(rate), '-ac', '1', '-c:a', 'pcm_s16le', str(decoded)], check=True)
    with wave.open(str(decoded), 'rb') as wav:
        samples = array.array('h', wav.readframes(wav.getnframes()))
    audible = [i for i,s in enumerate(samples) if abs(s) > 100]
    start = max(0, audible[0] - int(.035 * rate))
    end = min(len(samples), audible[-1] + int(.08 * rate))
    samples = samples[start:end]
    lead = round(.08 * rate)
    # A short breath between thoughts, not the old empty fixed-duration windows.
    tail = round((.35 if index == 11 else .16) * rate)
    frames = math.ceil((lead + len(samples) + tail) / rate * 30)
    # Keep the six deliberate clock beats and pre-reveal riser readable/audible.
    if index == 4:
        frames = max(frames, 72)
    count = frames * rate // 30
    master.extend([0] * lead)
    master.extend(samples)
    master.extend([0] * (count - lead - len(samples)))
    manifest.append(dict(scene=index, text=text, voice='Kokoro af_heart', synthesisRate='normal (1.0)', startMs=(cursor+lead)/rate*1000, endMs=(cursor+lead+len(samples))/rate*1000, fromFrame=cursor*30//rate, durationInFrames=frames))
    cursor += count
gain = (32767 * 10 ** (-3/20)) / max(abs(s) for s in master)
master = array.array('h', [round(s * gain) for s in master])
with wave.open(str(folder / 'kokoro-natural.wav'), 'wb') as wav:
    wav.setparams((1, 2, rate, len(master), 'NONE', 'not compressed'))
    wav.writeframes(master.tobytes())
(folder / 'kokoro-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
subprocess.run([str(ffmpeg), '-y', '-hide_banner', '-loglevel', 'error', '-i', str(folder / 'kokoro-natural.wav'), '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', str(folder / 'kokoro-align.wav')], check=True)
print(json.dumps({'seconds':len(master)/rate, 'frames':len(master)*30//rate,'scenes':manifest}, indent=2))
