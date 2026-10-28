import { interpolate, useCurrentFrame } from "remotion";
import beats from "../../voice-beats.json";
import { FloatingCard } from "../FloatingCard";
import { fonts, theme } from "../../theme";
import { clamp, Label, Lines } from "./shared";

export const NoSignal = () => {
  const frame = useCurrentFrame();
  const shake =
    frame >= beats.disconnect && frame < beats.disconnect + 9
      ? Math.sin((frame - beats.disconnect) * 3) *
        8 *
        (1 - (frame - beats.disconnect) / 9)
      : 0;
  return (
    <div style={{ transform: `translateX(${shake}px)` }}>
      <FloatingCard
        delay={4}
        color={theme.mood.problem}
        style={{
          left: 290,
          top: 30,
          width: 430,
          height: 610,
          boxSizing: "border-box",
          borderRadius: 50,
          padding: 42,
        }}
      >
        <div
          style={{
            width: 100,
            height: 8,
            background: `${theme.white}25`,
            borderRadius: 9,
            margin: "0 auto 48px",
          }}
        />
        <Label>TECHNICIAN APP</Label>
        <div
          style={{
            position: "relative",
            width: 230,
            height: 190,
            margin: "55px auto 40px",
            display: "flex",
            alignItems: "end",
            gap: 18,
          }}
        >
          {[55, 90, 130, 175].map((height, i) => (
            <div
              key={i}
              style={{
                width: 40,
                height,
                background:
                  frame < beats.disconnect
                    ? `${theme.muted}`
                    : `${theme.surfaceRaised}`,
                borderRadius: "10px 10px 4px 4px",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              left: -12,
              top: 104,
              height: 10,
              width: 265,
              background: theme.mood.problem,
              transform: `rotate(-42deg) scaleX(${interpolate(frame, [beats.disconnect, beats.disconnect + 5], [0, 1], clamp)})`,
              transformOrigin: "left",
              borderRadius: 8,
              boxShadow: `0 0 30px ${theme.mood.problem}66`,
            }}
          />
        </div>
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 45,
            color: theme.text,
            textAlign: "center",
            marginBottom: 38,
          }}
        >
          No signal
        </div>
        <Lines />
      </FloatingCard>
      <FloatingCard
        delay={beats.unknown}
        tiltY={10}
        color={theme.mood.problem}
        style={{
          left: 380,
          top: 530,
          width: 430,
          padding: "26px 34px",
          background: `${theme.surface}`,
        }}
      >
        <Label style={{ color: `${theme.accentSoft}` }}>JOB STATUS:</Label>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 104,
            letterSpacing: 12,
            color: theme.mood.problem,
            transform: `scale(${1 + Math.sin(frame / 5) * 0.035})`,
            lineHeight: 1.2,
          }}
        >
          ???
        </div>
      </FloatingCard>
    </div>
  );
};
