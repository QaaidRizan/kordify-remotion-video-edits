import { AbsoluteFill, Freeze, Sequence } from "remotion";
import { scenes, type ReelProps } from "./scenes";
import { Scene } from "./components/Scene";
import { Hud } from "./components/Hud";
import { SoundDesign } from "./components/SoundDesign";
import { Voiceover } from "./components/Voiceover";
import { BackgroundMusic } from "./components/BackgroundMusic";
import { theme } from "./theme";

export const KordifyReel = ({
  showSafeZones,
  sfxVolume = 0.85,
  voiceoverVolume = 1,
  musicVolume = 0.12,
}: ReelProps) => (
  <AbsoluteFill style={{ backgroundColor: theme.bg }}>
    {scenes.map((config, i) => (
      <Sequence
        key={config.id}
        name={`${String(config.id).padStart(2, "0")} · ${config.label}`}
        from={config.from}
        durationInFrames={config.dur}
      >
        <Freeze
          frame={config.dur - 10}
          active={(frame) => config.id === 11 && frame >= config.dur - 10}
        >
          <Scene
            config={config}
            previousMood={scenes[Math.max(0, i - 1)].mood}
          />
        </Freeze>
      </Sequence>
    ))}
    <Hud />
    <Voiceover volume={voiceoverVolume} />
    <BackgroundMusic
      volume={musicVolume}
      voiceActive={voiceoverVolume > 0}
      effectsActive={sfxVolume > 0}
    />
    <SoundDesign volume={sfxVolume} duckUnderVoice={voiceoverVolume > 0} />
    {showSafeZones ? (
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: 250,
            background: `${theme.mood.problem}22`,
            borderBottom: `2px dashed ${theme.mood.problem}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: 340,
            background: `${theme.mood.problem}22`,
            borderTop: `2px dashed ${theme.mood.problem}`,
          }}
        />
      </AbsoluteFill>
    ) : null}
  </AbsoluteFill>
);
