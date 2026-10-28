import { AbsoluteFill, Freeze, Sequence } from "remotion";
import type { ReelProps } from "./scenes";
import { scenesProof, proofDurationInFrames } from "./scenesProof";
import captions from "./proof-caption-timings.json";
import { Scene } from "./components/Scene";
import { Hud } from "./components/Hud";
import { ProofAudio } from "./components/ProofAudio";
import { theme } from "./theme";

export const KordifyProofReel = ({
  showSafeZones,
  voiceoverVolume = 1,
  sfxVolume = 0.85,
  musicVolume = 0.12,
}: ReelProps) => (
  <AbsoluteFill
    style={{ background: theme.bg }}
    durationInFrames={proofDurationInFrames}
  >
    {scenesProof.map((config, i) => (
      <Sequence
        key={config.id}
        name={`${config.id} · ${config.label}`}
        from={config.from}
        durationInFrames={config.dur}
      >
        <Freeze
          frame={config.dur - 10}
          active={(frame) =>
            i === scenesProof.length - 1 && frame >= config.dur - 10
          }
        >
          <Scene
            config={config}
            previousMood={scenesProof[Math.max(0, i - 1)].mood}
            final={i === scenesProof.length - 1}
            showMascot
            captions={captions[String(config.id) as keyof typeof captions]}
          />
        </Freeze>
      </Sequence>
    ))}
    <Hud timeline={scenesProof} />
    <ProofAudio
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
