import {KokoroTTS} from '../out/voice-tools/node_modules/kokoro-js/dist/kokoro.js';
import {readFileSync, writeFileSync} from 'node:fs';
const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX',{dtype:'q8',device:'cpu',progress_callback:p=>{if(p.status==='done') console.log('Loaded',p.file);}});
const lines = readFileSync('out/voice-review/natural-full-script.txt','utf8').trim().split(/\r?\n\s*\r?\n/);
console.log('Generating', lines.length, 'lines at normal speed');
for(let i=0;i<lines.length;i++){
 const audio=await tts.generate(lines[i], {voice:'af_heart',speed:1});
 await audio.save(`out/voice-review/kokoro-${String(i+1).padStart(2,'0')}.wav`);
 console.log('Generated line',i+1);
}
writeFileSync('out/voice-review/kokoro-source.json', JSON.stringify({provider:'Kokoro',model:'onnx-community/Kokoro-82M-v1.0-ONNX',voice:'af_heart',speed:1,lines},null,2));

