import { useCurrentFrame, useVideoConfig } from "remotion";
import { scenes, type SceneData } from "../scenes";
import { fonts, theme } from "../theme";

export const Hud = ({
  timeline = scenes,
}: {
  timeline?: readonly SceneData[];
}) => {
  const { durationInFrames } = useVideoConfig();
  const holdFrame = durationInFrames - 10;
  const frame = Math.min(useCurrentFrame(), holdFrame);
  const scene =
    timeline.find((s) => frame >= s.from && frame < s.from + s.dur) ??
    timeline[0];
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 80,
          right: 80,
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: fonts.mono,
          fontSize: 23,
          letterSpacing: 2,
          color: theme.text,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            background: theme.accent,
            borderRadius: "50%",
            boxShadow: `0 0 12px ${theme.accent}22`,
          }}
        />
        <span>
          {String(scene.id).padStart(2, "0")}{" "}
          <span style={{ color: theme.muted }}>/ {timeline.length} —</span>{" "}
          {scene.label}
        </span>
        <span style={{ marginLeft: "auto", color: theme.muted, fontSize: 19 }}>
          KORDIFY
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 132,
          height: 3,
          background: theme.border,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${frame >= holdFrame ? 100 : (frame / durationInFrames) * 100}%`,
            background: theme.accent,
            boxShadow: `0 0 10px ${theme.accent}22`,
          }}
        />
      </div>
    </>
  );
};
