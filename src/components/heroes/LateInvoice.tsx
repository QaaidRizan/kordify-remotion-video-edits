import { useCurrentFrame } from "remotion";
import { FloatingCard } from "../FloatingCard";
import { fonts, theme } from "../../theme";
import { Chip, Label, Lines } from "./shared";

export const LateInvoice = () => {
  const frame = useCurrentFrame();
  const ticks = Math.floor(frame * 3.5);
  return (
    <>
      {[2, 1].map((i) => (
        <FloatingCard
          key={i}
          delay={i * 4}
          color={theme.mood.problem}
          tiltY={-7}
          style={{
            left: 225 + i * 30,
            top: 65 - i * 22,
            width: 550,
            height: 540,
            opacity: 0.5,
          }}
        >
          <Lines />
        </FloatingCard>
      ))}
      <FloatingCard
        delay={8}
        color={theme.mood.problem}
        style={{ left: 200, top: 110, width: 550, height: 510, padding: 40 }}
      >
        <Label>INVOICE</Label>
        <div
          style={{
            fontFamily: fonts.sans,
            color: theme.text,
            fontSize: 58,
            margin: "26px 0 35px",
            letterSpacing: -2,
          }}
        >
          Still waiting.
        </div>
        <Lines />
        <Chip color={theme.mood.problem} style={{ marginTop: 48 }}>
          OVERDUE
        </Chip>
      </FloatingCard>
      <div
        style={{
          position: "absolute",
          left: 305,
          top: 620,
          borderRadius: 22,
          border: `1px solid ${theme.mood.problem}77`,
          background: `${theme.bg}`,
          padding: "22px 32px",
          boxShadow: `0 0 ${30 + Math.sin(frame / 5) * 12}px ${theme.mood.problem}33`,
        }}
      >
        <Label style={{ fontSize: 20 }}>TIME KEEPS RUNNING</Label>
        <div
          style={{
            fontFamily: fonts.mono,
            color: theme.mood.problem,
            fontSize: 62,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          +{String(Math.floor(ticks / 60)).padStart(2, "0")}:
          {String(ticks % 60).padStart(2, "0")}
        </div>
      </div>
    </>
  );
};
