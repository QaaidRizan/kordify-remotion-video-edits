import { interpolate, useCurrentFrame } from "remotion";
import { BrandMark, clamp, Label, usePop } from "./shared";
import { theme } from "../../theme";

export const LogoReveal = () => {
  const frame = useCurrentFrame();
  const pop = usePop(4);
  const pulse = interpolate(frame, [4, 35], [0.4, 1.5], clamp);
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: -300,
          background: "white",
          opacity: interpolate(frame, [0, 1, 3], [0.45, 0.22, 0], clamp),
        }}
      />
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 225,
            top: 70,
            width: 630,
            height: 630,
            borderRadius: "50%",
            border: `2px solid ${theme.mood.warm}`,
            opacity: interpolate(
              frame,
              [4 + i * 6, 45 + i * 6],
              [0.65, 0],
              clamp,
            ),
            transform: `scale(${pulse - i * 0.12})`,
          }}
        />
      ))}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const distance = interpolate(frame, [4, 40], [50, 380], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 + Math.cos(a) * distance,
              top: 380 + Math.sin(a) * distance * 0.72,
              width: 7,
              height: 18,
              borderRadius: 4,
              background: i % 2 ? theme.accent : `${theme.accentSoft}`,
              transform: `rotate(${i * 24}deg)`,
              opacity: interpolate(frame, [4, 10, 40], [0, 1, 0], clamp),
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 260,
          top: 265,
          transform: `scale(${0.4 + pop * 0.6})`,
          opacity: interpolate(frame, [3, 7], [0, 1], clamp),
          boxShadow: `0 0 150px ${theme.accent}33`,
          borderRadius: 50,
        }}
      >
        <BrandMark width={560} />
      </div>
      <Label
        style={{
          position: "absolute",
          top: 590,
          width: "100%",
          textAlign: "center",
          fontSize: 26,
          color: `${theme.accentSoft}`,
          letterSpacing: 6,
        }}
      >
        REQUEST TO PAID.
      </Label>
    </>
  );
};
