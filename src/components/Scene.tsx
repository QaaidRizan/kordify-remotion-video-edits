import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { SceneData } from "../scenes";
import { Background } from "./Background";
import { Caption } from "./Caption";
import { Mascot } from "./Mascot";
import { Hero } from "./heroes/Hero";
import { StoreAvailability } from "./StoreAvailability";
import { fonts, theme } from "../theme";
import type { Caption as CaptionData } from "@remotion/captions";

export const Scene = ({
  config,
  previousMood,
  final = config.id === 11,
  captions,
  showMascot = true,
}: {
  config: SceneData;
  previousMood: SceneData["mood"];
  final?: boolean;
  captions?: CaptionData[];
  showMascot?: boolean;
}) => {
  const frame = useCurrentFrame();
  const entrance = interpolate(frame, [0, 6], [0, 1], {
    extrapolateRight: "clamp",
  });
  const exit = final
    ? 1
    : interpolate(frame, [config.dur - 7, config.dur - 1], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  return (
    <AbsoluteFill>
      <Background config={config} previousMood={previousMood} />
      <AbsoluteFill
        style={{
          opacity: entrance * exit,
          transform: `scale(${interpolate(frame, [0, config.dur - 1], [1, 1.05])})`,
          transformOrigin: "50% 55%",
        }}
      >
        <Hero type={config.hero} layout={config.layout} />
        <Caption config={config} timings={captions} />
        {showMascot ? <Mascot config={config} /> : null}
      </AbsoluteFill>
      {final ? <StoreAvailability /> : null}
      {final ? (
        <div
          style={{
            position: "absolute",
            top: 1550,
            width: "100%",
            textAlign: "center",
            fontFamily: fonts.mono,
            fontSize: 17,
            color: theme.muted,
            opacity: entrance,
          }}
        >
          Android app on Google Play. iPhone coming soon. Early access.
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
