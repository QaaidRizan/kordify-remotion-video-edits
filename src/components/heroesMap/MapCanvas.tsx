import { interpolate, useCurrentFrame } from "remotion";
import { theme, fonts } from "../../theme";
import { clamp } from "../heroes/shared";

// Fictional map geometry, with no real customer/location data or external tiles.
export const MapCanvas = ({ question = false }: { question?: boolean }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [8, 54], [0, 1], clamp);
  return (
    <svg viewBox="0 0 800 600" width="100%" height="100%">
      <rect width="800" height="600" fill={theme.surface} />
      {Array.from({ length: 28 }, (_, i) => (
        <rect
          key={i}
          x={(i % 7) * 128 - 12}
          y={Math.floor(i / 7) * 156 + 18}
          width={94}
          height={116}
          rx={18}
          fill={i % 5 === 0 ? `${theme.mood.success}12` : theme.surfaceRaised}
          transform="rotate(-12 400 300)"
        />
      ))}
      <path
        d="M-40 480 C180 220 290 550 470 310 S680 340 840 90"
        fill="none"
        stroke={`${theme.mood.fix}35`}
        strokeWidth={65}
      />
      <g fill="none" stroke={theme.border} strokeWidth={17}>
        <path d="M-80 160L850 0 M-80 330L850 160 M-50 495L850 335 M90 -40L230 650 M330 -40L460 650 M590 -40L740 650" />
      </g>
      <g fill="none" stroke={theme.muted} strokeWidth={2} opacity={0.35}>
        <path d="M-80 160L850 0 M-80 330L850 160 M-50 495L850 335 M90 -40L230 650 M330 -40L460 650 M590 -40L740 650" />
      </g>
      <path
        d={
          question
            ? "M140 560 L112 410 L370 362 L342 224 L490 197"
            : "M140 560 L112 410 L370 362 L342 224 L626 171"
        }
        pathLength={1}
        stroke={question ? theme.mood.problem : theme.blueSoft}
        strokeWidth={5}
        strokeDasharray="10 12"
        fill="none"
      />
      <path
        d="M140 560 L112 410 L370 362 L342 224 L626 171"
        pathLength={1}
        stroke={question ? theme.mood.problem : theme.blueSoft}
        strokeWidth={7}
        strokeDasharray={1}
        strokeDashoffset={1 - progress * (question ? 0.68 : 1)}
        fill="none"
        opacity={0.55}
      />
      <text
        x="38"
        y="557"
        fill={theme.muted}
        fontFamily={fonts.mono}
        fontSize="17"
        letterSpacing="3"
      >
        ILLUSTRATIVE MAP
      </text>
    </svg>
  );
};

export const MapPin = ({
  x,
  y,
  label,
  color,
  delay = 0,
  question = false,
}: {
  x: number;
  y: number;
  label?: string;
  color: string;
  delay?: number;
  question?: boolean;
}) => {
  const frame = useCurrentFrame();
  const show = interpolate(frame, [delay, delay + 9], [0, 1], clamp);
  const pulse = (Math.max(0, frame - delay) % 42) / 42;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: show,
        transform: `translate(-50%,-50%) translateY(${(1 - show) * -60}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -43,
          top: -43,
          width: 86,
          height: 86,
          borderRadius: "50%",
          border: `2px solid ${color}`,
          transform: `scale(${1 + pulse})`,
          opacity: 1 - pulse,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -28,
          top: -28,
          width: 56,
          height: 56,
          borderRadius: "50% 50% 50% 5%",
          background: color,
          transform: "rotate(-45deg)",
          boxShadow: `0 0 40px ${color}80`,
          border: `5px solid ${theme.bg}`,
        }}
      >
        <div
          style={{
            transform: "rotate(45deg)",
            color: theme.white,
            fontFamily: fonts.sans,
            fontSize: 36,
            textAlign: "center",
            lineHeight: "56px",
          }}
        >
          {question ? "?" : "•"}
        </div>
      </div>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: -100,
            top: -90,
            minWidth: 200,
            textAlign: "center",
            whiteSpace: "nowrap",
            background: theme.bg,
            border: `1px solid ${color}`,
            borderRadius: 13,
            padding: "12px 16px",
            color: theme.text,
            fontFamily: fonts.mono,
            fontSize: 22,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};
