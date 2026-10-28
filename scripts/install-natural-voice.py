"""Install the reviewed, normal-speed Kokoro take and its measured Whisper timings.

Run only after out/voice-review/assemble-audition.py and transcription finish.
Source clips and original project audio remain in out/voice-review.
"""
import json
from pathlib import Path
import re
import shutil
import subprocess

root = Path(__file__).resolve().parents[1]
review = root / 'out/voice-review'
manifest = json.loads((review / 'kokoro-manifest.json').read_text())
tokens = json.loads((review / 'kokoro-align.wav.captions.json').read_text())
backup = review / 'before-natural'
if not backup.exists():
    shutil.copytree(root / 'src', backup / 'src')
    for name in ['vo.wav', 'vo.mp3', 'vo-words.json', 'music.wav']:
        shutil.copy2(root / 'public/audio' / name, backup / name)

# Join Whisper subword tokens and punctuation into real words, retaining measured times.
words = []
for token in tokens:
    if token['text'].startswith(' ') or not words:
        words.append(dict(token))
    else:
        words[-1]['text'] += token['text']
        words[-1]['endMs'] = token['endMs']
for word in words:
    word['text'] = word['text'].strip().strip('.,?!')
    line = next(line for line in reversed(manifest) if line['fromFrame']/30*1000 <= word['startMs']+80)
    word['scene'] = line['scene']
    word['startMs'] = max(line['startMs'], word['startMs'])
    word['endMs'] = min(line['endMs'], word['endMs'])
    word['timestampMs'] = None

def find(scene, term):
    matches = [w for w in words if w['scene'] == scene and w['text'].lower() == term]
    if not matches:
        raise ValueError(f'Missing measured concept {scene}:{term}')
    return matches[0]

def frame(scene, term):
    return round(find(scene, term)['startMs'] * .03) - manifest[scene-1]['fromFrame']

beats = {
    'disconnect': frame(1, 'no'),
    'unknown': frame(1, 'status'),
    'sync': frame(7, 'syncs'),
    'synced': frame(7, 'back') - 12,
    'checklist': frame(8, 'checklists'),
    'photo': frame(8, 'photos'),
    'signature': frame(8, 'signature'),
    'reminder1': frame(9, 'reminders') - 14,
    'reminder2': frame(9, 'reminders') + 2,
    'paid': frame(9, 'payment'),
}
assert beats['reminder2'] < beats['paid'] - 6
scene_path = root / 'src/scenes.ts'
scene_text = scene_path.read_text(encoding='utf-8')
for line in manifest:
    pattern = rf'(id: {line["scene"]},\s+from: )\d+(,\s+dur: )\d+'
    scene_text, count = re.subn(pattern, lambda m: f'{m[1]}{line["fromFrame"]}{m[2]}{line["durationInFrames"]}', scene_text)
    assert count == 1

# Caption words remain the approved editorial copy, anchored to the new spoken words.
scene_matches = list(re.finditer(r'id: (\d+),\s+from: (\d+),\s+dur: (\d+),[\s\S]*?words: (\[[^\]]+\])', scene_text))
anchors = [[6,7,9,10],[0,1,2,3,4,6],[0,1,2,3],[2,3,4,5],[0,1],[0,2,3,4,5],[2,3,5,9],[1,3,5],[0,1,3,5,8],[0,1,2,3,4],[0,1,2,3]]
captions = {}
for i, m in enumerate(scene_matches):
    sid = int(m[1])
    spoken = [w for w in words if w['scene']==sid]
    display = ' '.join(json.loads(m[4])).split()
    assert len(display)==len(anchors[i])
    captions[str(sid)] = [dict(text=text, startMs=max(0,spoken[a]['startMs']-int(m[2])/30*1000-65),endMs=spoken[a]['endMs']-int(m[2])/30*1000,timestampMs=None,confidence=spoken[a]['confidence']) for text,a in zip(display,anchors[i])]

cues = json.loads((backup / 'src/sfx-cues.json').read_text())
offsets = {(1,14):beats['disconnect'],(1,22):beats['unknown'],(7,40):beats['sync'],(7,55):beats['synced'],(8,30):beats['checklist'],(8,45):beats['photo'],(8,60):beats['signature'],(9,20):beats['reminder1'],(9,36):beats['reminder2'],(9,44):beats['paid']-6,(9,50):beats['paid']}
for cue in cues:
    cue['offset'] = offsets.get((cue['scene'],cue['offset']), cue['offset'])
    if cue['sound']=='riser':
        cue['offset'] = manifest[cue['scene']-1]['durationInFrames']-14
    if cue['sound']=='brandBridge':
        cue['offset'] = round((manifest[4]['endMs']/1000)*30)-manifest[4]['fromFrame']-6
        cue['gain'] = .22
    assert 0 <= cue['offset'] < manifest[cue['scene']-1]['durationInFrames']

scene_path.write_text(scene_text, encoding='utf-8')

def save(relative, data):
    (root / relative).write_text(json.dumps(data, indent=2)+'\n',encoding='utf-8')
save('src/voice-beats.json',beats)
save('src/voiceover.json',manifest)
save('src/caption-timings.json',captions)
save('src/sfx-cues.json',cues)
save('public/audio/vo-words.json',words)
shutil.copy2(review / 'kokoro-natural.wav',root / 'public/audio/vo.wav')
subprocess.run([str(root/'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'),'-y','-hide_banner','-loglevel','error','-i',str(root/'public/audio/vo.wav'),'-c:a','libmp3lame','-b:a','192k',str(root/'public/audio/vo.mp3')],check=True)
print(json.dumps({'frames':sum(l['durationInFrames'] for l in manifest),'beats':beats,'transcript':' '.join(w['text'] for w in words)},indent=2))
