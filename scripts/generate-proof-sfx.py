"""Original deterministic Foley accents, no external samples."""
import array,json,math,random,wave
from pathlib import Path
root=Path(__file__).resolve().parents[1]
rate=48000
rng=random.Random(73)
manifest={}
for name,seconds in [('lock',.22),('shutter',.30),('pen',1.0)]:
    samples=[]
    for i in range(round(seconds*rate)):
        t=i/rate
        noise=rng.uniform(-1,1)
        if name=='lock':
            value=(noise*.35+math.sin(2*math.pi*1200*t)*.25)*math.exp(-t*42)
            if t>.07: value+=noise*.55*math.exp(-(t-.07)*65)
        elif name=='shutter':
            value=noise*.55*math.exp(-t*55)
            if t>.10: value+=noise*.4*math.exp(-(t-.10)*38)
        else:
            value=noise*.09*(.5+.5*math.sin(t*37))*min(1,t/.04,(seconds-t)/.15)
        samples.append(value)
    gain=.55/max(abs(v) for v in samples)
    pcm=array.array('h',(round(v*gain*32767) for v in samples))
    path=root/f'public/audio/proof-{name}.wav'
    with wave.open(str(path),'wb') as w:
        w.setparams((1,2,rate,len(pcm),'NONE','not compressed'));w.writeframes(pcm.tobytes())
    manifest[name]={'path':f'audio/proof-{name}.wav','durationInFrames':math.ceil(seconds*30),'seconds':seconds}
(root/'src/proof-sfx-assets.json').write_text(json.dumps(manifest,indent=2))
