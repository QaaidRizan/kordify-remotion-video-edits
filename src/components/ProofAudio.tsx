import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import narration from "../proof-voiceover.json";
import beats from "../proof-voice-beats.json";
import sharedSounds from "../sfx-assets.json";
import proofSounds from "../proof-sfx-assets.json";
const sounds = { ...sharedSounds, ...proofSounds };
import { proofDurationInFrames } from "../scenesProof";
import { clamp } from "./heroes/shared";

type Cue = {
  scene: number;
  offset: number;
  sound: keyof typeof sounds;
  gain: number;
};
export const proofCues: Cue[] = [
  { scene: 1, offset: 4, sound: "whoosh", gain: 0.55 },
  { scene: 1, offset: beats.prove, sound: "stamp", gain: 0.55 },
  ...[6, 14].map((offset) => ({
    scene: 2,
    offset,
    sound: "pop" as const,
    gain: 0.55,
  })),
  { scene: 2, offset: beats.same, sound: "click", gain: 0.6 },
  { scene: 3, offset: beats.customer, sound: "bass", gain: 0.4 },
  { scene: 3, offset: beats.dispute, sound: "error", gain: 0.35 },
  ...[0, 9, 18].map((offset) => ({
    scene: 4,
    offset: beats.mandatory + offset,
    sound: "stamp" as const,
    gain: 0.4,
  })),
  ...beats.checks.map((offset) => ({
    scene: 5,
    offset,
    sound: "tick" as const,
    gain: 0.6,
  })),
  { scene: 5, offset: beats.unlock, sound: "click", gain: 0.65 },
  { scene: 5, offset: beats.unlock + 2, sound: "success", gain: 0.4 },
  { scene: 6, offset: 12, sound: "shutter", gain: 0.5 },
  ...[beats.time, beats.place].map((offset) => ({
    scene: 6,
    offset,
    sound: "pop" as const,
    gain: 0.55,
  })),
  { scene: 7, offset: beats.sign, sound: "pen", gain: 0.25 },
  { scene: 7, offset: beats.sign + 35, sound: "success", gain: 0.5 },
  { scene: 8, offset: beats.fold, sound: "whoosh", gain: 0.5 },
  { scene: 8, offset: beats.lock, sound: "lock", gain: 0.55 },
  { scene: 8, offset: beats.immutable, sound: "stamp", gain: 0.5 },
  { scene: 9, offset: beats.noSignal, sound: "pop", gain: 0.55 },
  { scene: 9, offset: beats.synced, sound: "success", gain: 0.55 },
  { scene: 10, offset: 0, sound: "riser", gain: 0.5 },
  { scene: 10, offset: beats.free, sound: "pop", gain: 0.6 },
];
const scheduled = proofCues.map((cue) => ({
  ...cue,
  from: narration[cue.scene - 1].from + cue.offset,
}));
const duckAt = (frame: number) =>
  Math.min(
    1,
    ...narration.map((line) =>
      interpolate(
        (frame * 1000) / 30,
        [line.startMs - 100, line.startMs, line.endMs, line.endMs + 180],
        [1, 0.4, 0.4, 1],
        clamp,
      ),
    ),
  );

const Music = ({
  volume,
  voiceActive,
  effectsActive,
}: {
  volume: number;
  voiceActive: boolean;
  effectsActive: boolean;
}) => {
  const frame = useCurrentFrame();
  const effectDuck = effectsActive
    ? Math.min(
        1,
        ...scheduled.map((cue) =>
          interpolate(
            frame,
            [
              cue.from - 2,
              cue.from,
              cue.from + sounds[cue.sound].durationInFrames,
              cue.from + sounds[cue.sound].durationInFrames + 6,
            ],
            [1, 0.5, 0.5, 1],
            clamp,
          ),
        ),
      )
    : 1;
  return (
    <Audio
      src={staticFile("audio/proof-music.wav")}
      volume={volume * (voiceActive ? duckAt(frame) : 1) * effectDuck}
    />
  );
};
const Sound = ({
  cue,
  volume,
  voiceActive,
}: {
  cue: (typeof scheduled)[number];
  volume: number;
  voiceActive: boolean;
}) => {
  const frame = useCurrentFrame();
  return (
    <Audio
      src={staticFile(sounds[cue.sound].path)}
      volume={volume * cue.gain * (voiceActive ? duckAt(frame + cue.from) : 1)}
    />
  );
};
export const ProofAudio = ({
  voiceVolume,
  sfxVolume,
  musicVolume,
}: {
  voiceVolume: number;
  sfxVolume: number;
  musicVolume: number;
}) => (
  <>
    <Audio
      name="Proof narration · natural speed"
      src={staticFile("audio/proof-vo.wav")}
      volume={voiceVolume}
    />
    <Music
      volume={musicVolume}
      voiceActive={voiceVolume > 0}
      effectsActive={sfxVolume > 0}
    />
    {scheduled.map((cue, i) => (
      <Sequence
        key={i}
        name={`SFX ${cue.scene}: ${cue.sound}`}
        from={cue.from}
        durationInFrames={Math.min(
          sounds[cue.sound].durationInFrames,
          proofDurationInFrames - cue.from,
        )}
        layout="none"
      >
        <Sound cue={cue} volume={sfxVolume} voiceActive={voiceVolume > 0} />
      </Sequence>
    ))}
  </>
);
