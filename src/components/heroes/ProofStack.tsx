import beats from "../../voice-beats.json";
import { FloatingCard } from "../FloatingCard";
import { assets } from "../../assets";
import { fonts, theme } from "../../theme";
import { Check, Chip, Label, Phone, Reveal } from "./shared";

export const ProofStack = () => (
  <>
    <div
      style={{
        position: "absolute",
        left: 135,
        top: 95,
        transform: "rotate(-9deg)",
      }}
    >
      <FloatingCard
        delay={0}
        tiltY={-12}
        color={theme.mood.fix}
        style={{
          width: 270,
          height: 540,
          padding: 23,
          boxSizing: "border-box",
          background: `${theme.text}`,
          border: `7px solid ${theme.surface}`,
          borderRadius: 32,
        }}
      >
        <Label
          style={{
            color: `${theme.surfaceRaised}`,
            fontSize: 19,
            letterSpacing: 0,
          }}
        >
          REQUIRED CHECKLIST
        </Label>
        <div
          style={{
            fontFamily: fonts.sans,
            color: `${theme.surface}`,
            fontSize: 27,
            margin: "35px 0 30px",
          }}
        >
          Before closing
          <br />
          the job
        </div>
        {["Complete work", "Add photos", "Get signature"].map((text, i) => (
          <div
            key={text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              marginTop: 26,
            }}
          >
            <Check
              delay={18 + i * 6}
              style={{
                width: 32,
                height: 32,
                fontSize: 22,
                borderWidth: 2,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: `${theme.surfaceRaised}`,
                fontFamily: fonts.mono,
                fontSize: 17,
              }}
            >
              {text}
            </span>
          </div>
        ))}
      </FloatingCard>
    </div>
    <Phone
      src={assets.evidence}
      left={398}
      top={35}
      width={282}
      delay={8}
      tiltY={0}
    />
    <Phone
      src={assets.signature}
      left={676}
      top={100}
      width={260}
      delay={16}
      tiltY={14}
      angle={9}
    />
    <Check
      delay={beats.checklist}
      style={{ position: "absolute", left: 250, top: 590 }}
    />
    <Check
      delay={beats.photo}
      style={{ position: "absolute", left: 505, top: 565 }}
    />
    <Check
      delay={beats.signature}
      style={{ position: "absolute", left: 820, top: 600 }}
    />
    <Reveal delay={32} style={{ position: "absolute", left: 245, top: 680 }}>
      <Chip color={`${theme.blueSoft}`} style={{ fontSize: 22 }}>
        TIME-STAMPED
      </Chip>
    </Reveal>
    <Reveal delay={40} style={{ position: "absolute", left: 585, top: 680 }}>
      <Chip color={`${theme.blueSoft}`} style={{ fontSize: 22 }}>
        REQUIRED
      </Chip>
    </Reveal>
  </>
);
