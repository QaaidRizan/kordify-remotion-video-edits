import {pathToFileURL} from 'node:url';
import {writeFileSync,mkdirSync,existsSync} from 'node:fs';
import path from 'node:path';
const toolsRoot=process.env.KORDIFY_VOICE_TOOLS??'D:/Personal/Kordify/kordify-reel/out/voice-tools';
const {KokoroTTS}=await import(pathToFileURL(path.join(toolsRoot,'node_modules/kokoro-js/dist/kokoro.js')).href);
const lines=[
  "You didn't do that. Prove it.",
  'Cleaning crew. H V A C technician. Same argument.',
  "The job's done. The customer says it isn't.",
  "In Kordify, you decide what's mandatory.",
  "A job can't be closed until it's done.",
  'Before and after photos, stamped with the time and place.',
  'The customer signs on the screen.',
  "Saved with the job. The evidence can't be edited afterwards.",
  'Even in a basement with no signal. It syncs later.',
  'Try Kordify free for fourteen days. No credit card. Get Kordify dot com.',
];
mkdirSync('out/proof-voice',{recursive:true});
const tts=await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX',{dtype:'q8',device:'cpu'});
for(let i=0;i<lines.length;i++){
  const filename=`out/proof-voice/${String(i+1).padStart(2,'0')}.wav`;
  if(!existsSync(filename)){
    const audio=await tts.generate(lines[i],{voice:'af_heart',speed:1});
    await audio.save(filename);
  }
  console.log('Generated proof scene',i+1);
}
writeFileSync('out/proof-voice/source.json',JSON.stringify({provider:'Kokoro 82M v1.0',voice:'af_heart',speed:1,lines},null,2));
