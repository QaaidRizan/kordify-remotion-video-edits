import type { CSSProperties, ReactNode } from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { assets } from "../../assets";
import { fonts, theme } from "../../theme";
import { FloatingCard } from "../FloatingCard";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
export const usePop = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 12, stiffness: 160 },
  });
};
export const Label = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <div
    style={{
      fontFamily: fonts.mono,
      fontSize: 24,
      letterSpacing: 2,
      color: theme.muted,
      ...style,
    }}
  >
    {children}
  </div>
);
export const Chip = ({
  children,
  color = theme.accentText,
  style,
}: {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: "18px 24px",
      borderRadius: 18,
      background: theme.surface,
      border: `1px solid ${color}88`,
      color,
      fontFamily: fonts.mono,
      fontSize: 26,
      fontWeight: 500,
      boxShadow: `0 8px 18px ${theme.ink}12`,
      ...style,
    }}
  >
    {children}
  </div>
);
export const Check = ({
  delay = 0,
  style,
}: {
  delay?: number;
  style?: CSSProperties;
}) => {
  const pop = usePop(delay);
  return (
    <div
      style={{
        width: 66,
        height: 66,
        background: theme.mood.success,
        color: `${theme.bg}`,
        border: `5px solid ${theme.bg}`,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        fontFamily: fonts.sans,
        fontSize: 42,
        transform: `scale(${pop})`,
        boxShadow: `0 10px 26px ${theme.ink}18`,
        ...style,
      }}
    >
      ✓
    </div>
  );
};
export const BrandMark = ({ width = 430 }: { width?: number }) => (
  <div
    style={{
      width,
      height: width * 0.43,
      background: "white",
      borderRadius: width * 0.09,
      overflow: "hidden",
      position: "relative",
    }}
  >
    <Img
      src={staticFile(assets.logo)}
      style={{
        position: "absolute",
        width,
        height: width,
        left: 0,
        top: -width * 0.293,
      }}
    />
  </div>
);
export const Phone = ({
  src,
  left,
  top = 0,
  width = 340,
  delay = 0,
  tiltY = -14,
  angle = 0,
  children,
}: {
  src: string;
  left: number;
  top?: number;
  width?: number;
  delay?: number;
  tiltY?: number;
  angle?: number;
  children?: ReactNode;
}) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width,
      transform: `rotate(${angle}deg)`,
    }}
  >
    <FloatingCard
      delay={delay}
      tiltX={8}
      tiltY={tiltY}
      color={theme.mood.fix}
      style={{
        width,
        height: width * 1.98,
        padding: 8,
        borderRadius: 36,
        boxSizing: "border-box",
        background: `${theme.bg}`,
        boxShadow: `10px 14px 0 ${theme.border}, 0 24px 45px ${theme.ink}18`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: 28,
          background: `${theme.text}`,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      {children}
    </FloatingCard>
  </div>
);
export const Lines = ({ color = theme.border }: { color?: string }) => (
  <div style={{ display: "grid", gap: 24 }}>
    {[100, 82, 92].map((width, i) => (
      <div
        key={i}
        style={{
          width: `${width}%`,
          height: 12,
          borderRadius: 10,
          background: color,
        }}
      />
    ))}
  </div>
);
export const Bell = ({ style }: { style?: CSSProperties }) => (
  <svg
    viewBox="0 0 64 64"
    width="64"
    height="64"
    fill="none"
    stroke="currentColor"
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d="M14 44h36l-5-8V25a13 13 0 0 0-26 0v11zM25 51a8 8 0 0 0 14 0M32 8V5" />
  </svg>
);
export const Reveal = ({
  delay = 0,
  children,
  style,
}: {
  delay?: number;
  children: ReactNode;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const pop = usePop(delay);
  return (
    <div
      style={{
        ...style,
        opacity: interpolate(frame, [delay, delay + 5], [0, 1], clamp),
        transform: `translateY(${(1 - pop) * 28}px) scale(${pop})`,
      }}
    >
      {children}
    </div>
  );
};
