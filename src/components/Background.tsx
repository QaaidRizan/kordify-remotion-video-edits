import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { fonts, theme } from "../theme";
import type { SceneData } from "../scenes";

const particles = Array.from({ length: 36 }, (_, i) => ({
  x: random(`x-${i}`) * 1080,
  y: random(`y-${i}`) * 1920,
  size: 2 + random(`size-${i}`) * 3,
  speed: 0.25 + random(`speed-${i}`) * 0.5,
}));

export const Background = ({
  config,
  previousMood,
}: {
  config: SceneData;
  previousMood: SceneData["mood"];
}) => {
  const frame = useCurrentFrame();
  const globalFrame = config.from + frame;
  const color = theme.mood[config.mood];
  const glow = (c: string) =>
    `radial-gradient(ellipse at 50% 58%, ${c}09 0%, ${c}03 30%, transparent 65%)`;
  return (
    <AbsoluteFill
      style={{
        background: config.id % 2 === 0 ? theme.bgAlt : theme.bg,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${theme.ink}12 0.8px, transparent 0.8px)`,
          backgroundSize: "28px 28px",
          maskImage:
            "linear-gradient(transparent, black 25%, black 80%, transparent)",
        }}
      />
      <AbsoluteFill
        style={{
          background: glow(theme.mood[previousMood]),
          opacity: interpolate(frame, [0, 8], [1, 0], {
            extrapolateRight: "clamp",
          }),
        }}
      />
      <AbsoluteFill
        style={{
          background: glow(color),
          opacity: interpolate(frame, [0, 8], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -200,
          right: -200,
          top: 1350,
          height: 1000,
          transform: "perspective(600px) rotateX(65deg)",
          transformOrigin: "center top",
          backgroundImage: `linear-gradient(${theme.ink}12 1px, transparent 1px), linear-gradient(90deg, ${theme.ink}12 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
          backgroundPositionY: globalFrame * 0.35,
          maskImage: "linear-gradient(transparent, black 30%, transparent 85%)",
        }}
      />
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x + Math.sin(globalFrame / 70 + i) * 12,
            top: (p.y - globalFrame * p.speed + 1920) % 1920,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: i % 4 === 0 ? color : theme.text,
            opacity: 0.03 + Math.sin(globalFrame / 30 + i) ** 2 * 0.04,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: config.layout?.ghostTop ?? 970,
          width: "100%",
          textAlign: "center",
          fontFamily: fonts.sans,
          fontWeight: 900,
          fontSize: config.accent.length > 9 ? 150 : 194,
          letterSpacing: -10,
          color: "transparent",
          WebkitTextStroke: `1.5px ${color}16`,
          whiteSpace: "nowrap",
          transform: `translateX(${Math.sin(globalFrame / 90) * 8}px)`,
        }}
      >
        {config.accent.replace(/[.,]/g, "").toUpperCase()}
      </div>
      <svg
        width="1080"
        height="1920"
        style={{
          position: "absolute",
          opacity: 0.025,
          mixBlendMode: "multiply",
        }}
      >
        <filter id={`grain-${config.id}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${config.id})`} />
      </svg>
    </AbsoluteFill>
  );
};
