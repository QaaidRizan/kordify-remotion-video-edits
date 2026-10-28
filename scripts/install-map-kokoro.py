"""Map measured Whisper tokens to complete script words, then update caption inputs."""
import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[1]
tokens=json.loads((root/'out/map-kokoro/tokens.json').read_text(encoding='utf-8'))
lines=json.loads((root/'src/map-voiceover.json').read_text(encoding='utf-8'))
groups=[]
for token in tokens:
    if token['text'].startswith(' ') or not groups:
        groups.append(dict(token))
    else:
        groups[-1]['text']+=token['text'];groups[-1]['endMs']=token['endMs']
expanded=[]
for group in groups:
    if re.search(r'(?:k|c)ordify\.com',group['text'],re.I):
        start=group['timestampMs'] if group['timestampMs'] is not None else group['startMs']
        duration=max(150,group['endMs']-start)
        for i,text in enumerate(['Kordify','dot','com']):
            expanded.append({**group,'text':text,'startMs':start+i*duration/3,
                             'endMs':start+(i+1)*duration/3,'timestampMs':start+i*duration/3})
    else:
        expanded.append(group)
groups=expanded
normalize=lambda text: re.sub(r'[^a-z0-9]','',text.lower()).replace('fourteen','14').replace('cordify','kordify')
expected=[(line,word) for line in lines for word in line['text'].split()]
assert len(expected)==len(groups),(len(expected),len(groups))
result=[]
for (line,word),group in zip(expected,groups):
    assert normalize(word)==normalize(group['text']),(word,group['text'])
    at=group['timestampMs'] if group['timestampMs'] is not None else group['startMs']
    at=max(line['startMs'],min(line['endMs']-30,at))
    if result and result[-1]['scene']==line['scene']:
        at=max(at,result[-1]['startMs']+10)
    result.append({'text':word.strip('.,?!"'), 'startMs':at,
                   'endMs':min(line['endMs'],max(at+50,group['endMs'])),
                   'timestampMs':at,'confidence':group['confidence'],'scene':line['scene']})
(root/'src/map-vo-words.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
print(f'All {len(result)} spoken words match the approved script.')
