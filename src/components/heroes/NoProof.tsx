import { useCurrentFrame } from "remotion";
import { FloatingCard } from "../FloatingCard";
import { fonts, theme } from "../../theme";
import { Label, usePop } from "./shared";

export const NoProof = () => {
  const frame = useCurrentFrame();
  const pop = usePop(28);
  const shake = frame >= 20 && frame < 29 ? Math.sin(frame * 3) * 5 : 0;
  return (
    <>
      <div style={{ transform: `translateX(${shake}px)` }}>
        <FloatingCard
          delay={3}
          color={theme.mood.problem}
          style={{
            left: 140,
            top: 80,
            width: 360,
            height: 400,
            boxSizing: "border-box",
          }}
        >
          <Label>PHOTO EVIDENCE</Label>
          <div
            style={{
              marginTop: 32,
              height: 255,
              border: `3px dashed ${theme.accent}5c`,
              borderRadius: 18,
              display: "grid",
              placeItems: "center",
              fontFamily: fonts.serif,
              fontStyle: "italic",
              fontSize: 170,
              color: theme.mood.problem,
            }}
          >
            ?
          </div>
        </FloatingCard>
        <FloatingCard
          delay={9}
          tiltY={12}
          color={theme.mood.problem}
          style={{
            left: 550,
            top: 200,
            width: 350,
            height: 360,
            boxSizing: "border-box",
          }}
        >
          <Label style={{ fontSize: 23 }}>SIGNATURE</Label>
          <div
            style={{ height: 180, borderBottom: `3px solid ${theme.white}45` }}
          />
          <Label
            style={{
              fontSize: 21,
              marginTop: 18,
              color: `${theme.accentSoft}`,
            }}
          >
            UNSIGNED
          </Label>
        </FloatingCard>
      </div>
      <div
        style={{
          position: "absolute",
          left: 250,
          top: 555,
          padding: "15px 35px",
          border: `7px solid ${theme.mood.problem}`,
          borderRadius: 12,
          fontFamily: fonts.sans,
          fontSize: 82,
          fontWeight: 900,
          color: theme.mood.problem,
          background: `${theme.bg}ed`,
          boxShadow: `0 18px 50px ${theme.black}88`,
          transform: `rotate(-9deg) scale(${pop})`,
        }}
      >
        NO PROOF
      </div>
    </>
  );
};
