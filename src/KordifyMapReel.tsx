import { AbsoluteFill, Freeze, Sequence } from "remotion";
import type { ReelProps } from "./scenes";
import { scenesMap, mapDurationInFrames } from "./scenesMap";
import captions from "./map-caption-timings.json";
import { Scene } from "./components/Scene";
import { Hud } from "./components/Hud";
import { MapAudio } from "./components/MapAudio";
import { theme } from "./theme";

export const KordifyMapReel = ({
  showSafeZones,
  voiceoverVolume = 1,
  sfxVolume = 0.85,
  musicVolume = 0.12,
}: ReelProps) => (
  <AbsoluteFill
    style={{ background: theme.bg }}
    durationInFrames={mapDurationInFrames}
  >
    {scenesMap.map((config, i) => (
      <Sequence
        key={config.id}
        name={`${config.id} · ${config.label}`}
        from={config.from}
        durationInFrames={config.dur}
      >
        <Freeze
          frame={config.dur - 10}
          active={(frame) =>
            i === scenesMap.length - 1 && frame >= config.dur - 10
          }
        >
          <Scene
            config={config}
            previousMood={scenesMap[Math.max(0, i - 1)].mood}
            final={i === scenesMap.length - 1}
            showMascot={i === scenesMap.length - 1}
            captions={captions[String(config.id) as keyof typeof captions]}
          />
        </Freeze>
      </Sequence>
    ))}
    <Hud timeline={scenesMap} />
    <MapAudio
      voiceVolume={voiceoverVolume}
      sfxVolume={sfxVolume}
      musicVolume={musicVolume}
    />
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
