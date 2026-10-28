import { interpolate, useCurrentFrame } from "remotion";
import { FloatingCard } from "../FloatingCard";
import { assets } from "../../assets";
import { fonts, theme } from "../../theme";
import { clamp, Label, Phone, Reveal } from "./shared";

export const DispatchBoard = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <FloatingCard
        color={theme.mood.fix}
        style={{ left: 105, top: 40, width: 770, height: 480, padding: 30 }}
      >
        <Label style={{ color: theme.text, marginBottom: 30 }}>
          DISPATCH BOARD <span style={{ color: theme.mood.fix }}>●</span>
        </Label>
        <div style={{ display: "flex", gap: 16 }}>
          {["Scheduled", "On the way", "Completed"].map((title) => (
            <div
              key={title}
              style={{
                width: 246,
                height: 350,
                background: `${theme.bg}55`,
                borderRadius: 16,
                border: `1px solid ${theme.white}12`,
                boxSizing: "border-box",
                padding: "22px 12px",
                fontFamily: fonts.mono,
                fontSize: 22,
                color: `${theme.muted}`,
              }}
            >
              {title}
            </div>
          ))}
        </div>
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 180 + i * 115,
              left:
                45 +
                interpolate(frame, [10 + i * 8, 32 + i * 8], [0, 262], clamp),
              width: 206,
              background: `${theme.border}`,
              border: `1px solid ${theme.blueSoft}77`,
              borderRadius: 14,
              padding: 17,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 24,
                color: theme.text,
              }}
            >
              {i ? "Service visit" : "Work order"}
            </div>
            <Label
              style={{ fontSize: 17, color: `${theme.muted}`, marginTop: 10 }}
            >
              TECHNICIAN {i ? "B" : "A"}
            </Label>
          </div>
        ))}
      </FloatingCard>
      <Phone
        src={assets.job}
        left={665}
        top={280}
        width={255}
        delay={20}
        tiltY={-18}
      />
      <Reveal delay={45} style={{ position: "absolute", left: 155, top: 600 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative", width: 80, height: 80 }}>
            <div
              style={{
                position: "absolute",
                inset: -12,
                border: `2px solid ${theme.mood.fix}`,
                borderRadius: "50%",
                opacity: 0.7 - (frame % 20) / 30,
                transform: `scale(${1 + (frame % 20) / 30})`,
              }}
            />
            <svg viewBox="0 0 64 64" width="80" fill={theme.mood.fix}>
              <path d="M32 3C16 3 8 14 8 27c0 17 24 35 24 35s24-18 24-35C56 14 48 3 32 3m0 14a10 10 0 1 1 0 20 10 10 0 0 1 0-20" />
            </svg>
          </div>
          <Label style={{ color: `${theme.blueSoft}`, fontSize: 26 }}>
            LIVE TECHNICIAN
            <br />
            MAP
          </Label>
        </div>
      </Reveal>
    </>
  );
};
