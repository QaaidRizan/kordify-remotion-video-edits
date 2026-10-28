import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { mapAssets } from "../../assets";
import { fonts, theme } from "../../theme";
import beats from "../../map-voice-beats.json";
import { FloatingCard } from "../FloatingCard";
import { Bell, Check, Chip, Label, Reveal, clamp } from "../heroes/shared";
import { MapCanvas, MapPin } from "./MapCanvas";

const CardHeading = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontFamily: fonts.sans,
      fontWeight: 900,
      fontSize: 48,
      color: theme.text,
      margin: "18px 0",
    }}
  >
    {children}
  </div>
);

export const QuestionMap = () => (
  <>
    <FloatingCard
      style={{
        left: 135,
        top: 70,
        width: 750,
        height: 570,
        padding: 0,
        overflow: "hidden",
      }}
      color={theme.mood.problem}
    >
      <MapCanvas question />
      <MapPin x={465} y={230} color={theme.mood.problem} delay={8} question />
      <Chip
        color={theme.mood.problem}
        style={{ position: "absolute", left: 35, top: 35, fontSize: 21 }}
      >
        TECHNICIAN STATUS: ?
      </Chip>
    </FloatingCard>
    <Reveal delay={12} style={{ position: "absolute", left: 260, top: 680 }}>
      <Label>JOB DISPATCHED. WHERE ARE THEY?</Label>
    </Reveal>
  </>
);

const messages = [
  "Where are you?",
  "Missed call",
  "ETA?",
  "Where are you?",
  "Calling technician…",
];
const positions = [
  [150, 55, -5],
  [400, 185, 6],
  [120, 310, -7],
  [370, 445, 5],
  [220, 590, -3],
];
export const CallPile = ({ fade = false }: { fade?: boolean }) => {
  const frame = useCurrentFrame();
  const delays = fade
    ? [0, 0, 0, 0, 0]
    : [
        beats.calls,
        beats.texts,
        beats.texts + 12,
        beats.where,
        beats.where + 18,
      ];
  return (
    <>
      {messages.map((message, i) => (
        <div
          key={message + i}
          style={{
            opacity: fade
              ? interpolate(frame, [10 + i * 6, 30 + i * 6], [0.8, 0], clamp)
              : 1,
            transform: `translateX(${Math.sin(frame * 1.6 + i) * 2}px)`,
          }}
        >
          <FloatingCard
            delay={delays[i]}
            tiltX={8}
            tiltY={positions[i][2]}
            color={theme.mood.problem}
            style={{
              left: positions[i][0],
              top: positions[i][1],
              width: 410,
              padding: 28,
            }}
          >
            <Label style={{ fontSize: 19, color: theme.accentSoft }}>
              {i === 1 ? "PHONE" : "DISPATCHER"}
            </Label>
            <CardHeading>{message}</CardHeading>
          </FloatingCard>
        </div>
      ))}
      {fade ? (
        <Reveal
          delay={42}
          style={{ position: "absolute", left: 390, top: 250 }}
        >
          <Check
            style={{ width: 290, height: 290, fontSize: 170, borderWidth: 12 }}
          />
        </Reveal>
      ) : null}
    </>
  );
};

export const DispatchDrop = () => {
  const frame = useCurrentFrame();
  const drag = interpolate(frame, [10, 30], [0, 1], clamp);
  return (
    <FloatingCard
      style={{ left: 105, top: 100, width: 810, height: 560, padding: 30 }}
    >
      <Label>WEB APP / DISPATCH</Label>
      <CardHeading>Assign the job.</CardHeading>
      <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
        {["UNASSIGNED", "TECH 1", "TECH 2"].map((name, i) => (
          <div
            key={name}
            style={{
              height: 330,
              width: 252,
              borderRadius: 18,
              background:
                i === 1 && frame > 30 ? `${theme.mood.fix}28` : theme.bg,
              border: `1px solid ${theme.border}`,
            }}
          >
            <Label style={{ fontSize: 20, textAlign: "center", padding: 20 }}>
              {name}
            </Label>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 46 + 268 * drag,
          top: 248 - Math.sin(drag * Math.PI) * 55,
          width: 212,
          padding: 20,
          boxSizing: "border-box",
          background: theme.surfaceRaised,
          border: `2px solid ${theme.accent}`,
          borderRadius: 18,
          transform: `rotate(${Math.sin(drag * Math.PI) * -7}deg)`,
          boxShadow: `0 20px 40px ${theme.black}55`,
        }}
      >
        <Label style={{ fontSize: 18 }}>WORK ORDER</Label>
        <CardHeading>Job A</CardHeading>
        <Label style={{ fontSize: 18 }}>Site A</Label>
      </div>
      {frame < 34 ? (
        <svg
          width="48"
          height="60"
          viewBox="0 0 40 50"
          style={{
            position: "absolute",
            left: 220 + 268 * drag,
            top: 360 - Math.sin(drag * Math.PI) * 55,
          }}
        >
          <path
            d="M3 2L35 28L20 30L13 46Z"
            fill={theme.text}
            stroke={theme.bg}
            strokeWidth="3"
          />
        </svg>
      ) : null}
      <Reveal delay={34} style={{ position: "absolute", left: 327, top: 448 }}>
        <Chip color={theme.blueSoft} style={{ fontSize: 20 }}>
          ASSIGNED ✓
        </Chip>
      </Reveal>
      <Label
        style={{ position: "absolute", bottom: 20, right: 25, fontSize: 15 }}
      >
        ILLUSTRATIVE BOARD
      </Label>
    </FloatingCard>
  );
};

export const MapPhone = ({
  src = mapAssets.job,
  left = 330,
  top = 0,
  width = 390,
  delay = 0,
  children,
}: {
  src?: string;
  left?: number;
  top?: number;
  width?: number;
  delay?: number;
  children?: React.ReactNode;
}) => (
  <FloatingCard
    delay={delay}
    style={{
      left,
      top,
      width,
      height: (width * 960) / 540,
      padding: 8,
      borderRadius: 34,
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 25,
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
    {children}
  </FloatingCard>
);

export const PhoneArrive = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entry = spring({ frame, fps, config: { damping: 17, stiffness: 120 } });
  return (
    <div style={{ transform: `translateX(${(1 - entry) * 700}px)` }}>
      <MapPhone src={mapAssets.jobs}>
        <div
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            top: 392,
            height: 160,
            border: `3px solid ${theme.accent}`,
            borderRadius: 18,
            opacity: frame > beats.phone ? 0.6 + Math.sin(frame / 5) * 0.3 : 0,
            boxShadow: `0 0 40px ${theme.accent}55`,
          }}
        />
      </MapPhone>
      <Reveal
        delay={beats.phone}
        style={{ position: "absolute", left: 570, top: 35 }}
      >
        <Chip color={theme.accentText}>NEW JOB ↙</Chip>
      </Reveal>
    </div>
  );
};

export const JobCallouts = () => (
  <>
    <MapPhone left={320} width={390} />
    <Reveal
      delay={beats.number}
      style={{ position: "absolute", left: 140, top: 308 }}
    >
      <Chip color={theme.blueSoft} style={{ fontSize: 22 }}>
        CUSTOMER’S NUMBER ↗
      </Chip>
    </Reveal>
    <Reveal
      delay={beats.site}
      style={{ position: "absolute", left: 590, top: 510 }}
    >
      <Chip color={theme.blueSoft} style={{ fontSize: 22 }}>
        ↙ SITE ON A MAP
      </Chip>
    </Reveal>
    <Reveal
      delay={beats.map + 5}
      style={{ position: "absolute", left: 370, top: 744 }}
    >
      <Chip color={theme.accentText} style={{ fontSize: 22 }}>
        ↑ ON MY WAY
      </Chip>
    </Reveal>
  </>
);

export const OnMyWayTap = () => {
  const frame = useCurrentFrame();
  const tap = beats.way;
  const ripple = interpolate(frame, [tap, tap + 25], [0, 1], clamp);
  return (
    <>
      <FloatingCard
        style={{
          left: 160,
          top: 90,
          width: 700,
          height: 430,
          padding: 0,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile(mapAssets.job)}
          style={{
            position: "absolute",
            width: 700,
            height: 1244,
            left: 0,
            bottom: 0,
            transform: `scale(${interpolate(frame, [0, 25], [1, 1.12], clamp)})`,
            transformOrigin: "45% 90%",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 195,
            top: 340,
            width: 80,
            height: 80,
            border: `6px solid ${theme.accent}`,
            borderRadius: "50%",
            transform: `translate(-50%,-50%) scale(${1 + ripple * 2})`,
            opacity: frame < tap ? 0 : 1 - ripple,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 181,
            top: 326,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: theme.white,
            opacity: frame >= tap && frame < tap + 9 ? 1 : 0,
          }}
        />
      </FloatingCard>
      <Reveal delay={6} style={{ position: "absolute", left: 340, top: 615 }}>
        <Chip
          color={frame < tap + 6 ? theme.muted : theme.blueSoft}
          style={{
            fontSize: 33,
            transform: `rotateX(${interpolate(frame, [tap + 3, tap + 6, tap + 9], [0, 90, 0], clamp)}deg)`,
          }}
        >
          {frame < tap + 6 ? "SCHEDULED" : "ON THE WAY →"}
        </Chip>
      </Reveal>
    </>
  );
};

export const LiveMap = () => {
  const frame = useCurrentFrame();
  const travel = interpolate(frame, [beats.live, beats.onSite], [0, 1], clamp);
  return (
    <>
      <FloatingCard
        style={{
          left: 130,
          top: 80,
          width: 800,
          height: 610,
          padding: 0,
          overflow: "hidden",
        }}
        color={theme.mood.fix}
      >
        <MapCanvas />
        <Chip
          color={theme.blueSoft}
          style={{ position: "absolute", left: 30, top: 25, fontSize: 20 }}
        >
          OFFICE / LIVE TECHNICIAN MAP
        </Chip>
        <MapPin
          x={320 + travel * 170}
          y={390 - travel * 135}
          label="ON THE WAY"
          color={theme.blueSoft}
          delay={beats.live}
        />
        <MapPin
          x={660}
          y={405}
          label="ON SITE"
          color={theme.mood.success}
          delay={beats.onSite}
        />
        <MapPin x={640} y={160} color={theme.accent} delay={60} />
      </FloatingCard>
      <MapPhone
        src={mapAssets.dayMap}
        left={90}
        top={350}
        width={195}
        delay={30}
      />
      <Reveal delay={34} style={{ position: "absolute", left: 100, top: 730 }}>
        <Label style={{ fontSize: 19 }}>TECH’S DAY MAP</Label>
      </Reveal>
    </>
  );
};

export const DeadlineWarn = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [5, beats.deadline], [0.9, 0.15], clamp);
  const warn = frame >= beats.warn;
  const color = warn ? theme.mood.warn : theme.mood.success;
  return (
    <FloatingCard
      style={{ left: 155, top: 60, width: 710, height: 620, padding: 40 }}
      color={color}
    >
      <Label>DISPATCH / JOB A</Label>
      <CardHeading>Deadline approaching.</CardHeading>
      <svg
        width="290"
        height="290"
        viewBox="0 0 290 290"
        style={{ position: "absolute", left: 250, top: 210 }}
      >
        <circle
          cx="145"
          cy="145"
          r="117"
          fill="none"
          stroke={theme.border}
          strokeWidth="18"
        />
        <circle
          cx="145"
          cy="145"
          r="117"
          fill="none"
          stroke={color}
          strokeWidth="18"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray={`${progress} 1`}
          transform="rotate(-90 145 145)"
        />
        <text
          x="145"
          y="175"
          textAnchor="middle"
          fill={color}
          fontFamily={fonts.sans}
          fontSize="100"
        >
          !
        </text>
      </svg>
      <Reveal
        delay={beats.warn}
        style={{ position: "absolute", left: 60, top: 530 }}
      >
        <Chip
          color={theme.mood.warn}
          style={{
            fontSize: 23,
            transform: `translateX(${Math.sin(frame * 1.5) * Math.max(0, 8 - (frame - beats.warn) / 2)}px)`,
          }}
        >
          <Bell style={{ width: 36, height: 36 }} />
          ABOUT TO MISS DEADLINE
        </Chip>
      </Reveal>
    </FloatingCard>
  );
};

export const CallsFade = () => <CallPile fade />;

export const MapCta = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Reveal delay={3} style={{ position: "absolute", left: 425, top: 0 }}>
        <Img
          src={staticFile(mapAssets.appIcon)}
          style={{
            width: 230,
            height: 230,
            borderRadius: 44,
            boxShadow: `0 0 75px ${theme.accent}30`,
          }}
        />
      </Reveal>
      <Reveal
        delay={beats.free}
        style={{ position: "absolute", left: 225, top: 300 }}
      >
        <div
          style={{
            background: theme.accent,
            color: theme.ink,
            padding: "30px 44px",
            borderRadius: 26,
            fontFamily: fonts.sans,
            fontSize: 54,
            fontWeight: 900,
            transform: `scale(${1 + Math.sin(frame / 9) * 0.014})`,
            boxShadow: `0 12px 24px ${theme.accent}24`,
          }}
        >
          Start free trial ↗
        </div>
      </Reveal>
      <Reveal
        delay={beats.free + 8}
        style={{ position: "absolute", left: 305, top: 460 }}
      >
        <Chip color={theme.text} style={{ fontSize: 42 }}>
          getkordify.com
        </Chip>
      </Reveal>
      <Reveal
        delay={beats.free + 12}
        style={{ position: "absolute", left: 325, top: 585 }}
      >
        <Label style={{ fontSize: 23 }}>14 DAYS · NO CREDIT CARD</Label>
      </Reveal>
    </>
  );
};
