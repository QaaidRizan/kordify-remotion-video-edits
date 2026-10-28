import { interpolate, useCurrentFrame } from "remotion";
import { fonts, theme } from "../../theme";
import { Chip, clamp, Label, Reveal, usePop } from "./shared";

export const BigOne = () => {
  const frame = useCurrentFrame();
  const pop = usePop(2);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: -55,
          textAlign: "center",
          transform: `scale(${pop})`,
          fontFamily: fonts.sans,
          fontSize: 530,
          fontWeight: 900,
          lineHeight: 1,
          color: theme.mood.warm,
          textShadow: `${Array.from({ length: 12 }, (_, i) => `${i + 1}px ${i + 1}px 0 ${theme.border}`).join(",")}, 0 0 100px ${theme.accent}55`,
        }}
      >
        1
      </div>
      <Label
        style={{
          position: "absolute",
          top: 465,
          width: "100%",
          textAlign: "center",
          fontSize: 42,
          letterSpacing: 18,
          color: theme.text,
        }}
      >
        PLACE
      </Label>
      <div
        style={{
          position: "absolute",
          left: 360,
          top: 535,
          width: 360,
          height: 5,
          background: theme.mood.warm,
          transform: `scaleX(${interpolate(frame, [12, 30], [0, 1], clamp)})`,
          transformOrigin: "left",
        }}
      />
      <Reveal delay={20} style={{ position: "absolute", top: 580, left: 355 }}>
        <Chip color={theme.mood.success} style={{ fontSize: 31 }}>
          14-DAY FREE TRIAL
        </Chip>
      </Reveal>
      <Reveal delay={28} style={{ position: "absolute", top: 678, left: 155 }}>
        <Chip color={`${theme.muted}`} style={{ fontSize: 22 }}>
          NO CREDIT CARD
        </Chip>
      </Reveal>
      <Reveal delay={36} style={{ position: "absolute", top: 678, left: 530 }}>
        <Chip color={`${theme.muted}`} style={{ fontSize: 22 }}>
          FREE IN EARLY ACCESS
        </Chip>
      </Reveal>
    </>
  );
};
