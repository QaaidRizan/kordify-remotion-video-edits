import { Audio } from "@remotion/media";
import {
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { scenes, reelDurationInFrames } from "../scenes";
import sounds from "../sfx-assets.json";
import cues from "../sfx-cues.json";
import narration from "../voiceover.json";

const scheduledCues = cues.map((cue) => {
  const scene = scenes.find((item) => item.id === cue.scene);
  const sound = sounds[cue.sound as keyof typeof sounds];
  if (!scene || !sound || cue.offset < 0 || cue.offset >= scene.dur) {
    throw new Error(`Invalid SFX cue: ${cue.label}`);
  }
  return { ...cue, sound, from: scene.from + cue.offset };
});

// Kept outside each scene's visual Freeze, so effect tails play naturally.
// Risers may bridge a scene boundary; tails stay within the composition.
const DuckedSound = ({
  cue,
  volume,
  duckUnderVoice,
}: {
  cue: (typeof scheduledCues)[number];
  volume: number;
  duckUnderVoice: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const globalMs = ((frame + cue.from) / fps) * 1000;
  const duck = duckUnderVoice
    ? Math.min(
        1,
        ...narration.map((line) =>
          interpolate(
            globalMs,
            [line.startMs - 80, line.startMs, line.endMs, line.endMs + 160],
            [1, 0.4, 0.4, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        ),
      )
    : 1;
  return (
    <Audio src={staticFile(cue.sound.path)} volume={volume * cue.gain * duck} />
  );
};

export const SoundDesign = ({
  volume,
  duckUnderVoice,
}: {
  volume: number;
  duckUnderVoice: boolean;
}) => (
  <>
    {scheduledCues.map((cue, i) => (
      <Sequence
        key={`${cue.scene}-${cue.offset}-${i}`}
        name={`SFX ${cue.scene}: ${cue.label}`}
        from={cue.from}
        durationInFrames={Math.min(
          cue.sound.durationInFrames,
          reelDurationInFrames - cue.from,
        )}
        layout="none"
      >
        <DuckedSound
          cue={cue}
          volume={volume}
          duckUnderVoice={duckUnderVoice}
        />
      </Sequence>
    ))}
  </>
);
