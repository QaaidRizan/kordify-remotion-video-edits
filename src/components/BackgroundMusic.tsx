import { Audio } from "@remotion/media";
import {
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import narration from "../voiceover.json";
import cues from "../sfx-cues.json";
import sounds from "../sfx-assets.json";
import { scenes } from "../scenes";

const effectWindows = cues.map((cue) => {
  const scene = scenes.find((item) => item.id === cue.scene)!;
  return {
    from: scene.from + cue.offset,
    seconds: sounds[cue.sound as keyof typeof sounds].seconds,
  };
});
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const BackgroundMusic = ({
  volume,
  voiceActive,
  effectsActive,
}: {
  volume: number;
  voiceActive: boolean;
  effectsActive: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  // Slow recovery between sentences avoids a distracting volume pump.
  const speechDuck = voiceActive
    ? Math.min(
        1,
        ...narration.map((line) =>
          interpolate(
            ms,
            [
              line.startMs - 120,
              line.startMs,
              line.endMs + 60,
              line.endMs + 360,
            ],
            [1, 0.4, 0.4, 1],
            clamp,
          ),
        ),
      )
    : 1;
  const effectDuck = effectsActive
    ? Math.min(
        1,
        ...effectWindows.map((effect) =>
          interpolate(
            frame,
            [
              effect.from - 2,
              effect.from,
              effect.from + effect.seconds * fps,
              effect.from + effect.seconds * fps + 6,
            ],
            [1, 0.5, 0.5, 1],
            clamp,
          ),
        ),
      )
    : 1;
  return (
    <Audio
      name="Soft electronic music bed"
      src={staticFile("audio/music.wav")}
      volume={volume * speechDuck * effectDuck}
    />
  );
};
