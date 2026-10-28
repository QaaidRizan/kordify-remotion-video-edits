import { useCurrentFrame } from "remotion";
import { FloatingCard } from "../FloatingCard";
import { fonts, theme } from "../../theme";
import { Label } from "./shared";

const cards = [
  {
    x: 150,
    y: 40,
    w: 350,
    angle: -12,
    title: "NOTES",
    text: "Call back.\nBook the job.",
    bg: `${theme.muted}`,
    ink: `${theme.surface}`,
  },
  {
    x: 520,
    y: 80,
    w: 350,
    angle: 9,
    title: "SPREADSHEET",
    text: "",
    bg: `${theme.surface}`,
    ink: `${theme.text}`,
  },
  {
    x: 205,
    y: 290,
    w: 420,
    angle: -7,
    title: "MISSED CALL",
    text: "No answer.",
    bg: `${theme.surface}`,
    ink: `${theme.accentSoft}`,
  },
  {
    x: 550,
    y: 420,
    w: 320,
    angle: 12,
    title: "MESSAGES",
    text: "Any update?",
    bg: `${theme.surface}`,
    ink: `${theme.text}`,
  },
  {
    x: 230,
    y: 590,
    w: 460,
    angle: -5,
    title: "REMINDER",
    text: "Who has this job?",
    bg: `${theme.surface}`,
    ink: `${theme.accentSoft}`,
  },
];
export const MessyPile = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {cards.map((card, i) => (
        <div
          key={card.title}
          style={{
            position: "absolute",
            left: card.x,
            top: card.y,
            transform: `rotate(${card.angle + Math.sin(frame / 5 + i) * 0.6}deg)`,
          }}
        >
          <FloatingCard
            delay={i * 5}
            tiltX={8}
            tiltY={i % 2 ? 10 : -10}
            color={theme.mood.problem}
            style={{
              width: card.w,
              padding: "28px 30px",
              boxSizing: "border-box",
              background: card.bg,
            }}
          >
            <Label style={{ color: card.ink, fontSize: 23, marginBottom: 23 }}>
              {card.title}
            </Label>
            {i === 1 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 2,
                }}
              >
                {Array.from({ length: 12 }, (_, j) => (
                  <div
                    key={j}
                    style={{
                      height: 27,
                      border: `1px solid ${theme.border}`,
                      background:
                        j === 7
                          ? `${theme.mood.problem}55`
                          : `${theme.white}05`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 36,
                  color: card.ink,
                  lineHeight: 1.25,
                  whiteSpace: "pre-line",
                  letterSpacing: -1,
                }}
              >
                {card.text}
              </div>
            )}
          </FloatingCard>
        </div>
      ))}
    </>
  );
};
