import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {writeFileSync} from 'node:fs';
const toolsRoot=process.env.KORDIFY_VOICE_TOOLS??'D:/Personal/Kordify/kordify-reel/out/voice-tools';
const {transcribe,toCaptions}=await import(pathToFileURL(path.join(toolsRoot,'node_modules/@remotion/install-whisper-cpp/dist/index.js')).href);
const result=await transcribe({inputPath:path.resolve('out/map-kokoro/align.wav'),whisperPath:path.join(toolsRoot,'whisper'),whisperCppVersion:'1.6.0',model:'small.en',tokenLevelTimestamps:true,language:'en',printOutput:false,additionalArgs:['-t','4','--prompt','Kordify. Get Kordify dot com. Fewer where are you calls. Technician.']});
writeFileSync('out/map-kokoro/whisper.json',JSON.stringify(result,null,2));
writeFileSync('out/map-kokoro/tokens.json',JSON.stringify(toCaptions({whisperCppOutput:result}).captions,null,2));
console.log('Transcription complete');
