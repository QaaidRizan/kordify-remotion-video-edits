"""Generate the complete approved script at natural speed, with provider word timings.

Requires edge-tts. Only writes reel #2 assets; never changes reel #1 narration.
"""
import asyncio
import array
import json
import math
from pathlib import Path
import subprocess
import wave
import edge_tts

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'out/map-voice'
OUT.mkdir(parents=True, exist_ok=True)
FFMPEG = ROOT / 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
LINES = [
    'Where is your technician right now?',
    'Calls. Texts. "Where are you?" All day.',
    'Dispatch the job from the web app.',
    "It lands on your technician's phone.",
    "Customer's number. The site on a map.",
    'They tap On my way when they set off.',
    "In the office, the live map shows them on the way, or on site.",
    'And you get warned when a job is about to miss its deadline.',
    'Fewer "where are you?" calls.',
    'Try Kordify free for fourteen days. Get Kordify dot com.',
]

async def main():
    master = array.array('h')
    manifest, words = [], []
    rate = 48000
    for index, text in enumerate(LINES, 1):
        mp3 = OUT / f'{index:02}.mp3'
        timing = OUT / f'{index:02}.json'
        if not (mp3.exists() and timing.exists()):
            boundaries = []
            voice = edge_tts.Communicate(text, 'en-US-JennyNeural', rate='+0%', boundary='WordBoundary')
            with mp3.open('wb') as stream:
                async for chunk in voice.stream():
                    if chunk['type'] == 'audio':
                        stream.write(chunk['data'])
                    elif chunk['type'] == 'WordBoundary':
                        boundaries.append(dict(text=chunk['text'], startMs=chunk['offset']/10000,
                                               endMs=(chunk['offset']+chunk['duration'])/10000,
                                               timestampMs=None, confidence=None))
            timing.write_text(json.dumps(boundaries, indent=2))
        boundaries = json.loads(timing.read_text())
        wav = OUT / f'{index:02}.wav'
        subprocess.run([str(FFMPEG), '-y', '-v', 'error', '-i', str(mp3), '-ar', str(rate), '-ac', '1', '-c:a', 'pcm_s16le', str(wav)], check=True)
        with wave.open(str(wav), 'rb') as audio:
            samples = array.array('h', audio.readframes(audio.getnframes()))
        # Preserve full spoken waveform; remove only provider trailing silence.
        audible = [i for i, sample in enumerate(samples) if abs(sample) > 80]
        end = min(len(samples), audible[-1] + round(rate * .12))
        samples = samples[:end]
        lead = round(rate * .10)
        frames = math.ceil((lead + len(samples))/rate * 30) + (18 if index == 10 else 8)
        start_frame = len(master) * 30 // rate
        start_ms = len(master)/rate*1000
        manifest.append({'scene':index, 'text':text, 'from':start_frame, 'dur':frames,
                         'startMs':start_ms+100, 'endMs':start_ms+100+len(samples)/rate*1000})
        for word in boundaries:
            words.append({**word, 'scene':index, 'startMs':word['startMs']+start_ms+100,
                          'endMs':word['endMs']+start_ms+100})
        master.extend([0] * lead)
        master.extend(samples)
        master.extend([0] * (frames * rate // 30 - lead - len(samples)))
        print(f'Scene {index}: {frames/30:.2f}s', flush=True)
    gain = (32767 * 10**(-3/20)) / max(abs(s) for s in master)
    master = array.array('h', (round(s*gain) for s in master))
    with wave.open(str(ROOT / 'public/audio/map-vo.wav'), 'wb') as audio:
        audio.setparams((1,2,rate,len(master),'NONE','not compressed'))
        audio.writeframes(master.tobytes())
    (ROOT / 'src/map-voiceover.json').write_text(json.dumps(manifest, indent=2)+'\n')
    (ROOT / 'src/map-vo-words.json').write_text(json.dumps(words, indent=2)+'\n')
    (OUT / 'source.json').write_text(json.dumps(dict(provider='Microsoft Edge TTS',voice='en-US-JennyNeural',rate='+0%',lines=LINES),indent=2))
    print(f'Total: {len(master)/rate:.2f}s; {len(master)*30//rate} frames', flush=True)

asyncio.run(main())
