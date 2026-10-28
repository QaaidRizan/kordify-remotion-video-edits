"""Anchor approved summary captions and hero beats to TTS word boundaries."""
import json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
lines = json.loads((root/'src/map-voiceover.json').read_text())
words = json.loads((root/'src/map-vo-words.json').read_text())
captions = [
 ['Where','is','your','technician?'],
 ['Calls.','Texts.','“Where','are','you?”'],
 ['Dispatch','the','job'],
 ['It','lands','on','their','phone'],
 ['Customer','number.','Site','on','a','map.'],
 ['Tap','“On','my','way”'],
 ['See','them','on','the','live','map'],
 ['Warned','before','a','deadline','slips'],
 ['Fewer','“where','are','you?”','calls'],
 ['Try','it','free','for','14','days'],
]
anchors = [[0,1,2,3],[0,1,2,3,4],[0,1,2],[0,1,2,3,5],[0,1,3,4,5,6],
           [1,2,3,4],[0,1,2,3,4,5],[3,4,5,8,10],[0,1,2,3,4],[0,1,2,3,4,5]]
result = {}
for i,(texts,indices) in enumerate(zip(captions,anchors),1):
    row = [w for w in words if w['scene']==i]
    offset = lines[i-1]['from']/30*1000
    result[str(i)] = [{**{k:v for k,v in row[j].items() if k!='scene'}, 'text':text,
                       'startMs':row[j]['startMs']-offset,'endMs':row[j]['endMs']-offset,
                       'pageBreakAfter': (i==5 and n==1) or (i==7 and n==3) or (i==10 and n==2)}
                      for n,(text,j) in enumerate(zip(texts,indices))]
(root/'src/map-caption-timings.json').write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
def beat(scene,word,occurrence=0):
    matches=[w for w in words if w['scene']==scene and w['text'].lower()==word]
    return round(matches[occurrence]['startMs']*.03)-lines[scene-1]['from']
beats = dict(calls=beat(2,'calls'),texts=beat(2,'texts'),where=beat(2,'where'),
             dispatch=beat(3,'dispatch'),phone=beat(4,'phone'),number=beat(5,'number'),
             site=beat(5,'site'),map=beat(5,'map'),tap=beat(6,'tap'),way=beat(6,'way'),
             live=beat(7,'live'),onSite=beat(7,'site'),warn=beat(8,'warned'),
             deadline=beat(8,'deadline'),fewer=beat(9,'fewer'),free=beat(10,'free'))
(root/'src/map-voice-beats.json').write_text(json.dumps(beats,indent=2)+'\n')
print(beats)
