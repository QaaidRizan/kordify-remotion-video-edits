"""Map measured Whisper word anchors to the approved editorial captions.

Whisper's timestampMs anchor is more precise than its broad token intervals.
HVAC / syncs spelling and the merged spoken URL are normalized explicitly;
the raw transcript is preserved in out/proof-voice for review.
"""
import json,re
from pathlib import Path
root=Path(__file__).resolve().parents[1]
lines=json.loads((root/'src/proof-voiceover.json').read_text())
tokens=json.loads((root/'out/proof-voice/tokens.json').read_text())
groups=[]
for token in tokens:
    if token['text'].startswith(' ') or not groups:
        groups.append(dict(token))
    else:
        groups[-1]['text']+=token['text'];groups[-1]['endMs']=token['endMs']
expanded=[]
for group in groups:
    if 'getkordify.com' in group['text'].lower():
        start=group['timestampMs']
        for i,text in enumerate(['Get','Kordify','dot','com']):
            at=start+i*(lines[-1]['endMs']-start)/4
            expanded.append({**group,'text':text,'timestampMs':at,'confidence':None})
    else:
        expanded.append(group)
normalize=lambda text: re.sub(r'[^a-z0-9]','',text.lower()).replace('fourteen','14').replace('hvsc','hvac').replace('sinks','syncs').replace('cordify','kordify')
expected=[(line,word) for line in lines for word in line['text'].replace('H V A C','HVAC').split()]
assert len(expected)==len(expanded),(len(expected),len(expanded))
words=[]
for (line,text),group in zip(expected,expanded):
    assert normalize(text)==normalize(group['text']),(text,group['text'])
    at=max(line['startMs'],min(line['endMs']-30,group['timestampMs']))
    words.append(dict(text=text.strip('.,?!"'),startMs=at,endMs=min(line['endMs'],max(at+50,group['endMs'])),timestampMs=at,confidence=group['confidence'],scene=line['scene']))
(root/'src/proof-vo-words.json').write_text(json.dumps(words,indent=2)+'\n')
(root/'public/audio/proof-vo-words.json').write_text(json.dumps(words,indent=2)+'\n')
def word(scene,text,occurrence=0):
    return [w for w in words if w['scene']==scene and w['text'].lower()==text][occurrence]
def frame(scene,text,occurrence=0):
    return round(word(scene,text,occurrence)['startMs']*.03)-lines[scene-1]['from']
def ms(scene,text,occurrence=0):
    return word(scene,text,occurrence)['startMs']-lines[scene-1]['from']/30*1000
rows=[
    ['"You',"didn't",'do','that."','Prove','it.'],
    ['Cleaning.','HVAC.','Same','argument.'],
    ['Job','done.','Customer','says','no.'],
    ['You','decide',"what's",'mandatory'],
    ["Can't",'close','the','job','until',"it's",'done'],
    ['Before','+','after','photos,','time','and','place','stamped'],
    ['Customer','signs','on','the','screen'],
    ['Evidence',"can't",'be','edited'],
    ['Even','with','no','signal'],
    ['Try','it','free','for','14','days'],
]
anchors=[['you',"didn't",'do','that','prove','it'],['cleaning','hvac','same','argument'],["job's",'done','customer','says',"isn't"],['you','decide',"what's",'mandatory'],None,None,['customer','signs','on','the','screen'],['evidence',"can't",'be','edited'],['even','with','no','signal'],['try','kordify','free','for','fourteen','days']]
captions={}
for i,texts in enumerate(rows,1):
    if i==5:
        # Editorial order differs from VO: "A job can't be closed...".
        at=ms(i,"can't");end=ms(i,'closed')
        starts=[at,at+(end-at)*.35,at+(end-at)*.65,end,ms(i,'until'),ms(i,"it's"),ms(i,'done')]
    elif i==6:
        # Second page summarizes the entire spoken stamping clause.
        start=ms(i,'stamped');end=ms(i,'place')
        starts=[ms(i,'before'),ms(i,'and'),ms(i,'after'),ms(i,'photos'),start,start+(end-start)*.3,start+(end-start)*.6,start+(end-start)*.75]
    else:
        starts=[ms(i,w,1 if i==7 and w=='the' else 0) for w in anchors[i-1]]
    assert starts==sorted(starts),(i,starts)
    captions[str(i)]=[dict(text=text,startMs=at,endMs=starts[j+1] if j+1<len(starts) else lines[i-1]['dur']/30*1000-200,timestampMs=at,confidence=None,pageBreakAfter=(i in [1,5,6] and j==3) or (i==10 and j==2)) for j,(text,at) in enumerate(zip(texts,starts))]
(root/'src/proof-caption-timings.json').write_text(json.dumps(captions,indent=2)+'\n')
beats=dict(prove=frame(1,'prove'),same=frame(2,'same'),customer=frame(3,'customer'),dispute=frame(3,"isn't"),mandatory=frame(4,'you'),checks=[12,26,40],unlock=frame(5,'until')+5,time=frame(6,'time'),place=frame(6,'place'),sign=max(10,frame(7,'signs')-9),fold=frame(8,'job'),lock=frame(8,"can't"),immutable=frame(8,'edited'),noSignal=frame(9,'no'),sync=frame(9,'syncs')-8,synced=frame(9,'later')-2,free=frame(10,'free'))
(root/'src/proof-voice-beats.json').write_text(json.dumps(beats,indent=2)+'\n')
print(json.dumps({'words':len(words),'beats':beats},indent=2))
