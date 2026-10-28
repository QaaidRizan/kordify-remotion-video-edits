import type { CSSProperties, ReactNode } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const FloatingCard = ({
  children,
  delay = 0,
  tiltX = 10,
  tiltY = -14,
  color = theme.accent,
  style,
}: {
  children: ReactNode;
  delay?: number;
  tiltX?: number;
  tiltY?: number;
  color?: string;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - delay);
  const entrance = spring({
    frame: local,
    fps,
    config: { damping: 15, stiffness: 150 },
  });
  return (
    <div
      style={{
        position: "absolute",
        borderRadius: 30,
        padding: 30,
        background: `linear-gradient(145deg, ${theme.surface}, ${theme.bg})`,
        border: `1.5px solid ${color}70`,
        boxShadow: `0 22px 45px ${theme.ink}18, 0 4px 10px ${theme.ink}0c`,
        ...style,
        opacity:
          frame < delay
            ? 0
            : interpolate(local, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
        transform: `perspective(1200px) translateY(${(1 - entrance) * 260 + Math.sin(frame / 26) * 7}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${0.9 + entrance * 0.1})`,
      }}
    >
      {children}
    </div>
  );
};
