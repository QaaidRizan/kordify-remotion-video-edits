import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import narration from "../map-voiceover.json";
import beats from "../map-voice-beats.json";
import sounds from "../sfx-assets.json";
import { mapDurationInFrames } from "../scenesMap";
import { clamp } from "./heroes/shared";

type Cue = {
  scene: number;
  offset: number;
  sound: keyof typeof sounds;
  gain: number;
};
export const mapCues: Cue[] = [
  { scene: 1, offset: 4, sound: "whoosh", gain: 0.6 },
  { scene: 1, offset: 10, sound: "bass", gain: 0.35 },
  ...[
    beats.calls,
    beats.texts,
    beats.texts + 12,
    beats.where,
    beats.where + 18,
  ].map((offset) => ({ scene: 2, offset, sound: "pop" as const, gain: 0.55 })),
  { scene: 2, offset: beats.where + 6, sound: "error", gain: 0.3 },
  { scene: 3, offset: 10, sound: "click", gain: 0.65 },
  { scene: 3, offset: 34, sound: "pop", gain: 0.6 },
  { scene: 4, offset: 4, sound: "whoosh", gain: 0.65 },
  { scene: 4, offset: beats.phone, sound: "pop", gain: 0.6 },
  ...[beats.number, beats.site, beats.map + 5].map((offset) => ({
    scene: 5,
    offset,
    sound: "click" as const,
    gain: 0.6,
  })),
  { scene: 6, offset: beats.way, sound: "click", gain: 0.7 },
  { scene: 6, offset: beats.way + 6, sound: "success", gain: 0.4 },
  { scene: 7, offset: 4, sound: "whoosh", gain: 0.5 },
  ...[beats.live, 60, beats.onSite].map((offset) => ({
    scene: 7,
    offset,
    sound: "location" as const,
    gain: 0.45,
  })),
  ...[beats.warn, beats.warn + 17].map((offset) => ({
    scene: 8,
    offset,
    sound: "bell" as const,
    gain: 0.5,
  })),
  { scene: 9, offset: 42, sound: "success", gain: 0.6 },
  { scene: 10, offset: 0, sound: "riser", gain: 0.5 },
  { scene: 10, offset: beats.free, sound: "pop", gain: 0.65 },
];
const scheduled = mapCues.map((cue) => ({
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
      src={staticFile("audio/map-music.wav")}
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
export const MapAudio = ({
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
      name="Dispatch narration · natural speed"
      src={staticFile("audio/map-vo.wav")}
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
          mapDurationInFrames - cue.from,
        )}
        layout="none"
      >
        <Sound cue={cue} volume={sfxVolume} voiceActive={voiceVolume > 0} />
      </Sequence>
    ))}
  </>
);
