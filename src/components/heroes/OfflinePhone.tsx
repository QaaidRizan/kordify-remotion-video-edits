import { interpolate, useCurrentFrame } from "remotion";
import beats from "../../voice-beats.json";
import { assets } from "../../assets";
import { fonts, theme } from "../../theme";
import { Check, Chip, clamp, Phone, Reveal } from "./shared";

export const OfflinePhone = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [beats.sync, beats.synced],
    [0, 1],
    clamp,
  );
  return (
    <>
      <Phone
        src={frame >= beats.synced ? assets.jobs : assets.offline}
        left={325}
        top={0}
        width={370}
        delay={2}
      >
        {frame >= beats.synced ? (
          <div
            style={{
              position: "absolute",
              top: 60,
              left: 18,
              right: 18,
              padding: "12px 10px",
              background: `${theme.text}`,
              border: `1px solid ${theme.muted}`,
              borderRadius: 10,
              color: `${theme.border}`,
              fontFamily: fonts.mono,
              fontSize: 17,
            }}
          >
            ✓ Back online. Changes synced.
          </div>
        ) : null}
      </Phone>
      <Reveal delay={10} style={{ position: "absolute", left: 145, top: 120 }}>
        <Chip
          color={
            frame < beats.synced ? `${theme.accentSoft}` : theme.mood.success
          }
        >
          {frame < beats.synced ? "● OFFLINE" : "● ONLINE"}
        </Chip>
      </Reveal>
      {frame >= beats.sync && frame < beats.synced ? (
        <div
          style={{
            position: "absolute",
            left: 662,
            top: 490,
            width: 115,
            height: 115,
            borderRadius: "50%",
            background: `${theme.surface}`,
            display: "grid",
            placeItems: "center",
          }}
        >
          <svg
            width="88"
            height="88"
            viewBox="0 0 100 100"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={`${theme.border}`}
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={`${theme.blueSoft}`}
              strokeWidth="8"
              strokeDasharray={251.33}
              strokeDashoffset={251.33 * (1 - progress)}
            />
          </svg>
        </div>
      ) : null}
      <Reveal
        delay={beats.synced}
        style={{ position: "absolute", left: 575, top: 545 }}
      >
        <Chip color={theme.mood.success} style={{ fontSize: 38 }}>
          <Check delay={beats.synced} /> Synced
        </Chip>
      </Reveal>
      <Reveal
        delay={beats.synced + 4}
        style={{
          position: "absolute",
          left: 820,
          top: 505,
          color: `${theme.muted}`,
          fontSize: 68,
        }}
      >
        ✦
      </Reveal>
    </>
  );
};
