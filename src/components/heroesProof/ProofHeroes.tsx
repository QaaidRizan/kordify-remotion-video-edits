import type { CSSProperties, ReactNode } from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { proofAssets } from "../../assets";
import { fonts, theme } from "../../theme";
import beats from "../../proof-voice-beats.json";
import { FloatingCard } from "../FloatingCard";
import {
  Check,
  Chip,
  Label,
  Lines,
  Phone,
  Reveal,
  clamp,
  usePop,
} from "../heroes/shared";

const title: CSSProperties = {
  fontFamily: fonts.sans,
  fontWeight: 900,
  fontSize: 48,
  letterSpacing: -2,
  color: theme.text,
};
const center: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const Lock = ({
  open = false,
  size = 88,
}: {
  open?: boolean;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
  >
    <path
      d={open ? "M27 34V22a14 14 0 0 1 27 0" : "M25 34V22a15 15 0 0 1 30 0v12"}
    />
    <rect
      x="15"
      y="34"
      width="50"
      height="36"
      rx="10"
      fill="currentColor"
      fillOpacity="0.08"
    />
    <path d="M40 47v10" />
  </svg>
);
const Icon = ({
  name,
  size = 60,
}: {
  name: "clean" | "cold" | "clock" | "pin" | "photo";
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {name === "clean" ? (
      <>
        <path d="M20 22h20v8l5 9v18H15V39l5-9zM22 22V9h21v7H30v6M42 10h9M47 19l6 4" />
        <path d="M16 40h28" />
      </>
    ) : null}
    {name === "cold" ? (
      <>
        <path d="M32 5v54M9 18l46 28M9 46l46-28M24 10l8 8 8-8M24 54l8-8 8 8M9 28l11-3-1-12M45 51l-1-12 11-3M9 36l11 3-1 12M45 13l-1 12 11 3" />
      </>
    ) : null}
    {name === "clock" ? (
      <>
        <circle cx="32" cy="32" r="24" />
        <path d="M32 16v17l11 7" />
      </>
    ) : null}
    {name === "pin" ? (
      <>
        <path d="M32 58S13 37 13 24a19 19 0 0 1 38 0c0 13-19 34-19 34z" />
        <circle cx="32" cy="24" r="6" />
      </>
    ) : null}
    {name === "photo" ? (
      <>
        <rect x="7" y="10" width="50" height="44" rx="7" />
        <circle cx="23" cy="24" r="5" />
        <path d="m9 48 15-12 9 7 9-16 13 21" />
      </>
    ) : null}
  </svg>
);
const Stamp = ({
  children,
  delay,
  color = theme.mood.problem,
  style,
}: {
  children: ReactNode;
  delay: number;
  color?: string;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const pop = usePop(delay);
  return (
    <div
      style={{
        position: "absolute",
        fontFamily: fonts.sans,
        fontWeight: 900,
        fontSize: 56,
        color,
        border: `5px solid ${color}`,
        borderRadius: 18,
        padding: "14px 25px",
        background: theme.bg,
        opacity: frame >= delay ? 1 : 0,
        transform: `rotate(-8deg) scale(${1.55 - pop * 0.55})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const DisputeBubble = () => {
  const frame = useCurrentFrame();
  const shake = frame > 6 && frame < 22 ? Math.sin(frame * 2) * 5 : 0;
  return (
    <>
      <FloatingCard
        delay={6}
        tiltY={8}
        color={theme.mood.problem}
        style={{
          left: 130 + shake,
          top: 65,
          width: 760,
          boxSizing: "border-box",
          padding: 48,
        }}
      >
        <Label style={{ color: theme.mood.problem, marginBottom: 25 }}>
          CUSTOMER
        </Label>
        <div style={{ ...title, fontSize: 70, lineHeight: 1.12 }}>
          “You didn’t
          <br />
          do that.”
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -18,
            left: 90,
            width: 34,
            height: 34,
            transform: "rotate(45deg)",
            background: theme.bg,
            borderRight: `1px solid ${theme.mood.problem}`,
            borderBottom: `1px solid ${theme.mood.problem}`,
          }}
        />
      </FloatingCard>
      <FloatingCard
        delay={16}
        tiltY={-10}
        style={{ left: 245, top: 430, width: 530, height: 190 }}
      >
        <Label style={{ marginBottom: 34 }}>JOB FILE</Label>
        <Lines />
      </FloatingCard>
      <Stamp
        delay={beats.prove}
        style={{ left: 675, top: 430, fontSize: 130, padding: "0 32px" }}
      >
        ?
      </Stamp>
    </>
  );
};

export const TradeChips = () => {
  const frame = useCurrentFrame();
  const movement = interpolate(frame, [6, 25], [160, 0], clamp);
  return (
    <>
      {(["CLEANING", "HVAC"] as const).map((text, i) => (
        <FloatingCard
          key={text}
          delay={6 + i * 8}
          tiltY={i ? -12 : 12}
          color={theme.mood.problem}
          style={{
            left: (i ? 620 : 100) + (i ? movement : -movement),
            top: 150 + i * 60,
            width: 300,
            height: 315,
            boxSizing: "border-box",
            textAlign: "center",
            padding: "48px 20px",
          }}
        >
          <div style={{ color: theme.mood.problem, marginBottom: 30 }}>
            <Icon name={i ? "cold" : "clean"} size={112} />
          </div>
          <div style={{ ...title, fontSize: 35, letterSpacing: -1 }}>
            {text}
          </div>
        </FloatingCard>
      ))}
      <Reveal
        delay={beats.same}
        style={{
          position: "absolute",
          left: 464,
          top: 280,
          ...title,
          fontSize: 100,
          color: theme.accentText,
        }}
      >
        =
      </Reveal>
      <Reveal
        delay={beats.same}
        style={{
          position: "absolute",
          top: 620,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Chip color={theme.mood.problem}>SAME ARGUMENT</Chip>
      </Reveal>
    </>
  );
};

export const JobDispute = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [15, 30], [100, 0], clamp);
  const jitter = frame >= 30 && frame < 70 ? Math.sin(frame * 1.7) * 3 : 0;
  return (
    <>
      <FloatingCard
        delay={4}
        tiltY={10}
        color={theme.mood.success}
        style={{
          left: 100 - push + jitter,
          top: 160,
          width: 380,
          height: 340,
          boxSizing: "border-box",
        }}
      >
        <Label>JOB</Label>
        <div style={{ marginTop: 50 }}>
          <Check delay={10} />
        </div>
        <div style={{ ...title, marginTop: 35, color: theme.mood.success }}>
          DONE
        </div>
      </FloatingCard>
      <FloatingCard
        delay={beats.customer}
        tiltY={-12}
        color={theme.mood.problem}
        style={{
          left: 565 + push + jitter,
          top: 220,
          width: 395,
          height: 340,
          boxSizing: "border-box",
        }}
      >
        <Label>CUSTOMER</Label>
        <div
          style={{
            ...title,
            fontSize: 85,
            color: theme.mood.problem,
            marginTop: 12,
          }}
        >
          ×
        </div>
        <div style={{ ...title, fontSize: 43 }}>“Not done.”</div>
      </FloatingCard>
      <Stamp
        delay={beats.dispute}
        style={{ left: 450, top: 560, fontSize: 92 }}
      >
        ?
      </Stamp>
    </>
  );
};

export const RequiredChecklist = () => (
  <>
    <FloatingCard
      delay={4}
      tiltY={-10}
      color={theme.mood.fix}
      style={{
        left: 220,
        top: 5,
        width: 640,
        height: 740,
        padding: 38,
        boxSizing: "border-box",
        borderRadius: 42,
      }}
    >
      <Label style={{ color: theme.mood.fix }}>JOB CHECKLIST</Label>
      <div style={{ ...title, fontSize: 46, margin: "25px 0 37px" }}>
        You set the rules.
      </div>
      {["Checklist steps", "Photos", "Signature", "Additional notes"].map(
        (text, i) => (
          <div
            key={text}
            style={{
              position: "relative",
              height: 108,
              borderTop: `1px solid ${theme.border}`,
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                border: `2px solid ${theme.border}`,
                borderRadius: 7,
              }}
            />
            <div style={{ ...title, fontSize: 29, letterSpacing: -1 }}>
              {text}
            </div>
            <Reveal
              delay={beats.mandatory + i * 9}
              style={{ position: "absolute", right: -72, top: 23 }}
            >
              <Chip
                color={i === 3 ? theme.muted : theme.mood.fix}
                style={{ fontSize: 19, padding: "12px 15px" }}
              >
                {i === 3 ? "OPTIONAL" : "REQUIRED"}
              </Chip>
            </Reveal>
          </div>
        ),
      )}
      <Label style={{ fontSize: 17, marginTop: 18 }}>ILLUSTRATIVE</Label>
    </FloatingCard>
  </>
);

export const LockedClose = () => {
  const frame = useCurrentFrame();
  const ready = frame >= beats.unlock;
  const color = ready ? theme.mood.success : theme.muted;
  return (
    <FloatingCard
      delay={3}
      tiltY={-9}
      color={color}
      style={{
        left: 180,
        top: 55,
        width: 720,
        height: 655,
        boxSizing: "border-box",
        padding: 50,
      }}
    >
      <Label>BEFORE YOU CLOSE THE JOB</Label>
      {["Checklist", "Photos", "Signature"].map((text, i) => (
        <div
          key={text}
          style={{
            ...title,
            fontSize: 38,
            marginTop: 32,
            display: "flex",
            alignItems: "center",
            gap: 25,
          }}
        >
          <div
            style={{
              position: "relative",
              width: 56,
              height: 56,
              border: `2px solid ${theme.border}`,
              borderRadius: "50%",
            }}
          >
            <Check
              delay={beats.checks[i]}
              style={{ position: "absolute", left: -6, top: -6 }}
            />
          </div>
          {text}
        </div>
      ))}
      <div
        style={{
          ...center,
          gap: 20,
          height: 112,
          marginTop: 40,
          background: ready ? theme.mood.success : theme.surfaceRaised,
          borderRadius: 24,
          color: ready ? theme.white : theme.muted,
          boxShadow: ready
            ? `0 0 ${18 + Math.sin(frame / 7) * 8}px ${color}35`
            : "none",
        }}
      >
        <div
          style={{
            transform: `rotate(${interpolate(frame, [beats.unlock, beats.unlock + 7], [-12, 0], clamp)}deg)`,
          }}
        >
          <Lock size={58} open={ready} />
        </div>
        <div style={{ fontFamily: fonts.sans, fontSize: 38, fontWeight: 800 }}>
          Complete job
        </div>
      </div>
      <Label style={{ textAlign: "center", fontSize: 17, marginTop: 30 }}>
        ILLUSTRATIVE
      </Label>
    </FloatingCard>
  );
};

const PhotoTile = ({ after }: { after: boolean }) => (
  <FloatingCard
    delay={after ? 14 : 6}
    tiltY={8}
    color={theme.mood.fix}
    style={{
      left: 555,
      top: after ? 395 : 40,
      width: 360,
      height: 330,
      padding: 22,
      boxSizing: "border-box",
    }}
  >
    <Label style={{ fontSize: 22, color: theme.text }}>
      {after ? "AFTER" : "BEFORE"}
    </Label>
    <div
      style={{
        height: 175,
        marginTop: 12,
        borderRadius: 14,
        background: theme.bgAlt,
        overflow: "hidden",
        border: `1px solid ${theme.border}`,
      }}
    >
      <Img
        src={staticFile(after ? proofAssets.after : proofAssets.before)}
        alt={
          after
            ? "Demo washbasin after cleaning"
            : "Demo washbasin before cleaning"
        }
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
    <Reveal
      delay={after ? beats.place : beats.time}
      style={{
        display: "flex",
        gap: 16,
        marginTop: 17,
        color: theme.mood.fix,
        fontFamily: fonts.mono,
        fontSize: 18,
      }}
    >
      <span style={{ ...center, gap: 6 }}>
        <Icon name="clock" size={26} />
        TIME
      </span>
      <span style={{ ...center, gap: 6 }}>
        <Icon name="pin" size={26} />
        PLACE
      </span>
    </Reveal>
  </FloatingCard>
);
export const StampedPhotos = () => (
  <>
    <Phone src={proofAssets.evidence} left={120} width={350} top={25} />
    <PhotoTile after={false} />
    <PhotoTile after />
  </>
);

export const SignatureDraw = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [beats.sign, beats.sign + 30],
    [0, 1],
    clamp,
  );
  return (
    <>
      <Phone
        src={proofAssets.signature}
        left={330}
        width={390}
        top={0}
        tiltY={-10}
      >
        <svg
          viewBox="0 0 280 120"
          style={{
            position: "absolute",
            left: "9%",
            top: "37%",
            width: "82%",
            height: "20%",
          }}
        >
          <path
            d="M18 92C40 60 69 15 57 30S25 108 53 87S101 27 90 43S53 114 90 91S122 53 119 75S136 96 148 76S156 100 170 79S194 72 201 80M58 105Q149 92 260 95"
            fill="none"
            stroke={theme.ink}
            strokeWidth="3"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - progress}
          />
        </svg>
        <Check
          delay={beats.sign + 35}
          style={{ position: "absolute", right: -26, bottom: 100 }}
        />
      </Phone>
      <Reveal
        delay={beats.sign + 35}
        style={{ position: "absolute", left: 110, top: 610 }}
      >
        <Chip color={theme.mood.success}>SAVED WITH THE JOB</Chip>
      </Reveal>
    </>
  );
};

export const EvidenceLock = () => {
  const frame = useCurrentFrame();
  const fold = interpolate(frame, [beats.fold, beats.fold + 25], [0, 1], clamp);
  return (
    <>
      {["CHECKLIST", "PHOTOS", "SIGNATURE"].map((text, i) => (
        <div
          key={text}
          style={{
            position: "absolute",
            left: 100 + i * 310 + (1 - i) * fold * 310,
            top: 70 + fold * 190,
            opacity: 1 - fold,
            transform: `scale(${1 - fold * 0.3})`,
          }}
        >
          <Reveal delay={i * 6}>
            <Chip
              style={{
                width: 220,
                justifyContent: "center",
                padding: "30px 15px",
                fontSize: 23,
              }}
            >
              {text}
            </Chip>
          </Reveal>
        </div>
      ))}
      <FloatingCard
        delay={beats.fold + 10}
        tiltY={-8}
        color={theme.mood.success}
        style={{
          left: 250,
          top: 240,
          width: 580,
          height: 385,
          boxSizing: "border-box",
          padding: 38,
        }}
      >
        <Label style={{ color: theme.mood.success }}>JOB FILE</Label>
        <div style={{ marginTop: 38, width: 300 }}>
          <Lines />
        </div>
        <div
          style={{
            position: "absolute",
            right: 38,
            top: 105,
            color: theme.mood.success,
          }}
        >
          <Lock open={frame < beats.lock} size={110} />
        </div>
        <Reveal delay={beats.lock} style={{ marginTop: 40 }}>
          <Chip color={theme.mood.success} style={{ fontSize: 21 }}>
            EVIDENCE SAVED
          </Chip>
        </Reveal>
      </FloatingCard>
      <Stamp
        delay={beats.immutable}
        color={theme.mood.success}
        style={{
          left: 140,
          top: 655,
          fontSize: 27,
          width: 740,
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        CAN’T BE EDITED AFTERWARDS
      </Stamp>
    </>
  );
};

export const OfflineSync = () => {
  const frame = useCurrentFrame();
  const syncing = frame >= beats.sync && frame < beats.synced;
  return (
    <>
      <Phone src={proofAssets.offline} left={325} top={0} width={390}>
        {frame >= beats.synced ? (
          <div
            style={{
              position: "absolute",
              left: "6%",
              top: "10%",
              width: "88%",
              height: "12%",
              boxSizing: "border-box",
              borderRadius: 10,
              background: theme.bg,
              border: `2px dashed ${theme.mood.success}`,
              color: theme.mood.success,
              fontFamily: fonts.mono,
              fontSize: 21,
              ...center,
            }}
          >
            ✓ Synced
          </div>
        ) : null}
      </Phone>
      <Reveal
        delay={beats.noSignal}
        style={{ position: "absolute", left: 110, top: 95 }}
      >
        <Chip
          color={theme.mood.problem}
          style={{
            opacity:
              (0.78 + Math.sin(frame / 7) * 0.22) *
              interpolate(frame, [beats.sync, beats.sync + 6], [1, 0], clamp),
          }}
        >
          NO SIGNAL
        </Chip>
      </Reveal>
      {syncing ? (
        <div
          style={{
            position: "absolute",
            left: 410,
            top: 300,
            transform: `rotate(${(frame - beats.sync) * 12}deg)`,
          }}
        >
          <svg width="210" height="210" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill={`${theme.bg}dd`}
              stroke={theme.mood.fix}
              strokeWidth="5"
              strokeDasharray="190 90"
            />
          </svg>
        </div>
      ) : null}
      <Reveal
        delay={beats.synced}
        style={{ position: "absolute", left: 600, top: 580 }}
      >
        <Chip color={theme.mood.success}>
          <Check delay={beats.synced} />
          Synced
        </Chip>
      </Reveal>
    </>
  );
};

export const ProofCta = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Reveal delay={3} style={{ position: "absolute", left: 430, top: 5 }}>
        <Img
          src={staticFile(proofAssets.appIcon)}
          style={{
            width: 220,
            height: 220,
            borderRadius: 42,
            boxShadow: `0 18px 38px ${theme.ink}18`,
          }}
        />
      </Reveal>
      <Reveal delay={12} style={{ position: "absolute", left: 200, top: 275 }}>
        <div
          style={{
            ...center,
            width: 680,
            height: 140,
            borderRadius: 30,
            background: theme.accent,
            color: theme.white,
            fontFamily: fonts.sans,
            fontSize: 54,
            fontWeight: 900,
            letterSpacing: -2,
            transform: `scale(${1 + Math.sin(frame / 15) * 0.012})`,
            boxShadow: `0 15px 38px ${theme.accent}30`,
          }}
        >
          Start free trial <span style={{ marginLeft: 25 }}>↗</span>
        </div>
      </Reveal>
      <Reveal
        delay={20}
        style={{
          position: "absolute",
          top: 455,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Chip style={{ fontSize: 40, padding: "20px 45px" }}>
          getkordify.com
        </Chip>
      </Reveal>
      <div
        style={{
          position: "absolute",
          left: 155,
          top: 590,
          display: "flex",
          gap: 22,
        }}
      >
        <Reveal delay={beats.free}>
          <Chip style={{ fontSize: 23 }}>14-DAY FREE TRIAL</Chip>
        </Reveal>
        <Reveal delay={beats.free + 7}>
          <Chip style={{ fontSize: 23 }}>NO CREDIT CARD</Chip>
        </Reveal>
      </div>
    </>
  );
};
