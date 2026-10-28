"""Checks the current scene timeline, captions, review hold and rendered audio."""
from pathlib import Path
import json,math,wave
import numpy as np
from PIL import Image,ImageChops
root=Path(__file__).resolve().parents[1]
scenes=json.loads((root/'src/map-voiceover.json').read_text(encoding='utf-8'))
words=json.loads((root/'src/map-caption-timings.json').read_text(encoding='utf-8'))
end=0
for scene in scenes:
    assert scene['from']==end and scene['dur']>0
    end+=scene['dur']
    row=words[str(scene['scene'])]
    assert all(0<=w['startMs']<scene['dur']/30*1000 for w in row)
    assert all(a['startMs']<=b['startMs'] for a,b in zip(row,row[1:]))
review=root/'out/map-review'
with wave.open(str(review/'full-mix.wav'),'rb') as audio:
    rate=audio.getframerate(); channels=audio.getnchannels(); count=audio.getnframes()
    samples=np.frombuffer(audio.readframes(count),dtype=np.int16).astype(float)/32768
peak=float(np.max(np.abs(samples)))
assert abs(count/rate-end/30)<.001
assert peak<1
hold=ImageChops.difference(Image.open(review/'hold-start.png').convert('RGB'),Image.open(review/'hold-end.png').convert('RGB')).getbbox() is None
assert hold
assert np.count_nonzero(np.array(Image.open(review/'hold-end.png').convert('L')) > 180) > 1000, 'Final hold is blank instead of the CTA'
result={'frames':end,'seconds':count/rate,'sampleRate':rate,'channels':channels,
        'peakDbFS':20*math.log10(peak),'clippedSamples':int(np.sum(np.abs(samples)>=1)),
        'finalHoldPixelIdentical':hold,'timelineAndCaptionBounds':'pass'}
(review/'audio-qa.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(json.dumps(result,indent=2))
