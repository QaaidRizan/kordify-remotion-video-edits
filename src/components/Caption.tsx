import type { Caption as CaptionData } from "@remotion/captions";
import { Fragment } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { SceneData } from "../scenes";
import { fonts, theme } from "../theme";
import captionTimings from "../caption-timings.json";

// The approved summary captions are anchored to measured spoken concepts.
export const getCaptionWords = (config: SceneData): CaptionData[] => {
  return captionTimings[String(config.id) as keyof typeof captionTimings];
};

export const Caption = ({
  config,
  timings,
}: {
  config: SceneData;
  timings?: CaptionData[];
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = timings ?? getCaptionWords(config);
  // Six-word scene 2 has two balanced pages, never six words on screen.
  const pageSize = words.length > 5 ? 3 : 5;
  const active = Math.max(
    0,
    words.filter((w) => frame >= (w.startMs / 1000) * fps).length - 1,
  );
  const pages: CaptionData[][] = [[]];
  const explicit = words.some((item) => item.pageBreakAfter);
  for (const word of words) {
    const current = pages[pages.length - 1];
    if (
      current.length &&
      (current[current.length - 1].pageBreakAfter ||
        current.length >= (explicit ? 5 : pageSize))
    )
      pages.push([]);
    pages[pages.length - 1].push(word);
  }
  let offset = 0;
  const page = Math.max(
    0,
    pages.findIndex((items) => {
      offset += items.length;
      return active < offset;
    }),
  );
  const accentWords = config.accent.split(" ");
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: config.layout?.captionTop ?? 1148,
        minHeight: 220,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignContent: "center",
        columnGap: 22,
        rowGap: 4,
        fontFamily: fonts.sans,
        fontSize: 88,
        lineHeight: 1.09,
        fontWeight: 900,
        letterSpacing: -4,
        color: theme.text,
        textAlign: "center",
      }}
    >
      {pages[page].map((word, i) => {
        const start = (word.startMs / 1000) * fps;
        const local = frame - start;
        const pop = spring({
          frame: Math.max(0, local),
          fps,
          config: { damping: 14, stiffness: 160 },
        });
        const accent = accentWords.includes(word.text);
        return (
          <Fragment key={`${page}-${i}`}>
            {config.id === 10 && word.text === "One" ? (
              <span style={{ flexBasis: "100%", height: 0 }} />
            ) : null}
            <span
              style={{
                display: "inline-block",
                opacity:
                  local < 0
                    ? 0
                    : interpolate(local, [0, 4], [0, 1], {
                        extrapolateRight: "clamp",
                      }),
                transform: `translateY(${(1 - pop) * 10}px) scale(${0.85 + 0.15 * pop})`,
                filter: `blur(${interpolate(Math.max(0, local), [0, 8], [6, 0], { extrapolateRight: "clamp" })}px)`,
                fontFamily: accent ? fonts.serif : fonts.sans,
                fontStyle: "normal",
                fontWeight: accent ? 700 : 900,
                fontSize: accent ? 98 : 88,
                color: accent ? theme.accentText : theme.text,
              }}
            >
              {word.text}
            </span>
          </Fragment>
        );
      })}
    </div>
  );
};
