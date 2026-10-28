import { useCurrentFrame } from "remotion";
import { assets } from "../../assets";
import { fonts, theme } from "../../theme";
import { BrandMark, Chip, Phone, Reveal } from "./shared";

export const Cta = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Phone
        src={assets.jobs}
        left={145}
        top={40}
        width={310}
        delay={2}
        tiltY={-14}
        angle={-5}
      />
      <Reveal delay={8} style={{ position: "absolute", left: 555, top: 70 }}>
        <BrandMark width={345} />
      </Reveal>
      <Reveal delay={15} style={{ position: "absolute", left: 470, top: 310 }}>
        <div
          style={{
            borderRadius: 24,
            background: theme.accent,
            color: `${theme.bg}`,
            fontFamily: fonts.sans,
            fontSize: 44,
            fontWeight: 900,
            padding: "28px 30px",
            boxShadow: `0 0 ${45 + Math.sin(frame / 8) * 12}px ${theme.accent}50`,
            transform: `scale(${1 + Math.sin(frame / 8) * 0.018})`,
          }}
        >
          Start free trial ↗
        </div>
      </Reveal>
      <Reveal delay={22} style={{ position: "absolute", left: 475, top: 445 }}>
        <Chip color={theme.text} style={{ fontSize: 31, letterSpacing: -1 }}>
          getkordify.com
        </Chip>
      </Reveal>
      <Reveal delay={28} style={{ position: "absolute", left: 515, top: 560 }}>
        <Chip color={`${theme.muted}`} style={{ fontSize: 20 }}>
          14 DAYS · NO CARD
        </Chip>
      </Reveal>
    </>
  );
};
