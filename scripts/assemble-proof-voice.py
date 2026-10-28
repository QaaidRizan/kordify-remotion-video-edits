"""Assemble full normal-speed Kokoro lines, preserving speech and measuring duration."""
import array,json,math,subprocess,wave
from pathlib import Path
root=Path(__file__).resolve().parents[1]
folder=root/'out/proof-voice'
ffmpeg=root/'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
source=json.loads((folder/'source.json').read_text(encoding='utf-8'))
rate=48000
master=array.array('h')
manifest=[]
for index,text in enumerate(source['lines'],1):
    decoded=folder/f'{index:02}-48k.wav'
    subprocess.run([str(ffmpeg),'-y','-v','error','-i',str(folder/f'{index:02}.wav'),'-ar',str(rate),'-ac','1','-c:a','pcm_s16le',str(decoded)],check=True)
    with wave.open(str(decoded),'rb') as wav:
        samples=array.array('h',wav.readframes(wav.getnframes()))
    audible=[i for i,s in enumerate(samples) if abs(s)>100]
    start=max(0,audible[0]-round(.035*rate))
    end=min(len(samples),audible[-1]+round(.10*rate))
    samples=samples[start:end]
    lead=round(.10*rate)
    frames=math.ceil((lead+len(samples))/rate*30)+(18 if index==10 else 8)
    # Preserve the brief's reading time; extend only when full speech needs it.
    frames=max(frames,[75,75,90,90,75,90,75,90,105,135][index-1])
    from_frame=len(master)*30//rate
    manifest.append({'scene':index,'text':text,'from':from_frame,'dur':frames,
                     'startMs':len(master)/rate*1000+100,'endMs':(len(master)+lead+len(samples))/rate*1000})
    master.extend([0]*lead);master.extend(samples)
    master.extend([0]*(frames*rate//30-lead-len(samples)))
gain=32767*10**(-3/20)/max(abs(s) for s in master)
master=array.array('h',(round(s*gain) for s in master))
with wave.open(str(root/'public/audio/proof-vo.wav'),'wb') as wav:
    wav.setparams((1,2,rate,len(master),'NONE','not compressed'));wav.writeframes(master.tobytes())
(root/'src/proof-voiceover.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
subprocess.run([str(ffmpeg),'-y','-v','error','-i',str(root/'public/audio/proof-vo.wav'),'-ar','16000','-ac','1',str(folder/'align.wav')],check=True)
print(json.dumps({'frames':len(master)*30//rate,'seconds':len(master)/rate,'scenes':manifest},indent=2))
