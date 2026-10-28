import { Composition } from "remotion";
import { KordifyReel } from "./KordifyReel";
import { reelSchema, reelDurationInFrames } from "./scenes";
import { KordifyMapReel } from "./KordifyMapReel";
import { mapDurationInFrames } from "./scenesMap";
import { KordifyProofReel } from "./KordifyProofReel";
import { proofDurationInFrames } from "./scenesProof";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="KordifyProofReel"
        component={KordifyProofReel}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={proofDurationInFrames}
        schema={reelSchema}
        defaultProps={{
          showSafeZones: false,
          sfxVolume: 0.85,
          voiceoverVolume: 1,
          musicVolume: 0.12,
        }}
      />
      <Composition
        id="KordifyMapReel"
        component={KordifyMapReel}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={mapDurationInFrames}
        schema={reelSchema}
        defaultProps={{
          showSafeZones: false,
          sfxVolume: 0.85,
          voiceoverVolume: 1,
          musicVolume: 0.12,
        }}
      />
      <Composition
        id="KordifyReel"
        component={KordifyReel}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={reelDurationInFrames}
        schema={reelSchema}
        defaultProps={{
          showSafeZones: false,
          sfxVolume: 0.85,
          voiceoverVolume: 1,
          musicVolume: 0.12,
        }}
      />
    </>
  );
};
