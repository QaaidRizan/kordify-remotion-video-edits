import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { assets, mascotAssets } from "../assets";
import type { SceneData } from "../scenes";
import { theme } from "../theme";

export const Mascot = ({ config }: { config: SceneData }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 160 } });
  const pose = mascotAssets[config.pose];
  return (
    <div
      style={{
        position: "absolute",
        top: 1385,
        left: 380,
        width: 320,
        height: 135,
        transform: `translateY(${Math.sin((config.from + frame) / 15) * 5}px) rotate(${Math.sin((config.from + frame) / 26) * 1.5}deg) scale(${interpolate(pop, [0, 1], [0.9, 1])})`,
      }}
    >
      {pose ? (
        <Img
          src={staticFile(pose)}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 28,
            overflow: "hidden",
            position: "relative",
            background: `${theme.white}`,
            border: `1px solid ${theme.white}44`,
            boxShadow: `0 10px 60px ${theme.mood[config.mood]}22`,
          }}
        >
          <Img
            src={staticFile(assets.logo)}
            style={{
              position: "absolute",
              width: 320,
              height: 320,
              top: -94,
              left: 0,
            }}
          />
        </div>
      )}
    </div>
  );
};
