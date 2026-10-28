import {pathToFileURL} from 'node:url';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import path from 'node:path';
const toolsRoot=process.env.KORDIFY_VOICE_TOOLS??'D:/Personal/Kordify/kordify-reel/out/voice-tools';
const {KokoroTTS}=await import(pathToFileURL(path.join(toolsRoot,'node_modules/kokoro-js/dist/kokoro.js')).href);
const lines=JSON.parse(readFileSync('out/map-voice/source.json','utf8')).lines;
mkdirSync('out/map-kokoro',{recursive:true});
const tts=await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX',{dtype:'q8',device:'cpu'});
for(let i=0;i<lines.length;i++){
  const filename=`out/map-kokoro/${String(i+1).padStart(2,'0')}.wav`;
  if(!existsSync(filename)){
    const audio=await tts.generate(lines[i],{voice:'af_heart',speed:1});
    await audio.save(filename);
  }
  console.log('Generated scene',i+1);
}
writeFileSync('out/map-kokoro/source.json',JSON.stringify({provider:'Kokoro 82M v1.0',voice:'af_heart',speed:1,lines},null,2));
