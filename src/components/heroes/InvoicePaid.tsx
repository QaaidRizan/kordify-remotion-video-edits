import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import beats from "../../voice-beats.json";
import { assets } from "../../assets";
import { fonts, theme } from "../../theme";
import { FloatingCard } from "../FloatingCard";
import { Bell, Check, Chip, clamp, Label, Reveal } from "./shared";

export const InvoicePaid = () => {
  const frame = useCurrentFrame();
  const paid = frame >= beats.paid;
  const flip = interpolate(
    frame,
    [beats.paid - 6, beats.paid, beats.paid + 6],
    [0, 90, 0],
    clamp,
  );
  const ringing =
    (frame >= beats.reminder1 && frame < beats.reminder1 + 10) ||
    (frame >= beats.reminder2 && frame < beats.reminder2 + 10);
  return (
    <>
      <FloatingCard
        delay={3}
        color={theme.mood.warm}
        tiltY={-8}
        style={{ left: 170, top: 30, width: 680, padding: 25 }}
      >
        <Label style={{ color: `${theme.accentSoft}`, marginBottom: 22 }}>
          {paid ? "PAYMENT STATUS" : "INVOICE PREVIEW"}
        </Label>
        <div
          style={{
            position: "relative",
            width: 680,
            height: 520,
            overflow: "hidden",
            borderRadius: 20,
            background: `${theme.white}`,
          }}
        >
          <Img
            src={staticFile(assets.webInvoice)}
            style={{
              position: "absolute",
              width: 1370,
              maxWidth: "none",
              left: -360,
              top: -140,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(145deg, ${theme.surface}, ${theme.bg})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 32,
              opacity: interpolate(
                frame,
                [beats.paid - 6, beats.paid],
                [0, 1],
                clamp,
              ),
            }}
          >
            <Check
              delay={beats.paid}
              style={{ width: 120, height: 120, fontSize: 76 }}
            />
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 76,
                fontWeight: 900,
                color: theme.text,
              }}
            >
              Job done.
            </div>
            <Label style={{ color: `${theme.muted}`, fontSize: 28 }}>
              INVOICE SENT → PAID
            </Label>
          </div>
        </div>
      </FloatingCard>
      <div
        style={{
          opacity: interpolate(
            frame,
            [beats.paid - 2, beats.paid + 6],
            [1, 0],
            clamp,
          ),
        }}
      >
        <Reveal
          delay={beats.reminder1 - 2}
          style={{ position: "absolute", left: 110, top: 490 }}
        >
          <Chip color={`${theme.accentSoft}`}>
            <Bell
              style={{
                transform: `rotate(${ringing ? Math.sin(frame * 1.7) * 20 : 0}deg)`,
              }}
            />
            <span style={{ fontSize: 23 }}>
              PAYMENT
              <br />
              REMINDER
            </span>
          </Chip>
        </Reveal>
      </div>
      <div
        style={{
          position: "absolute",
          left: 490,
          top: 610,
          transform: `perspective(900px) rotateX(${flip}deg)`,
        }}
      >
        <Chip
          color={paid ? theme.mood.success : theme.mood.problem}
          style={{
            fontFamily: fonts.sans,
            fontWeight: 900,
            fontSize: 65,
            padding: "22px 35px",
          }}
        >
          {paid ? "✓ PAID" : "OVERDUE"}
        </Chip>
      </div>
    </>
  );
};
