import { sceneSchema, type SceneData } from "./scenes";
import narration from "./map-voiceover.json";

// User approved extending the timeline to preserve every word at normal speed.
const content = [
  {
    label: "WHERE ARE THEY",
    mood: "problem",
    pose: "think",
    hero: "questionMap",
    layout: { heroTop: 350, heroScale: 1.1, captionTop: 1280, ghostTop: 1160 },
    words: ["Where", "is", "your", "technician?"],
    accent: "Where",
  },
  {
    label: "THE CALLS",
    mood: "problem",
    pose: "stressed",
    hero: "callPile",
    layout: { heroTop: 350, heroScale: 1.08, captionTop: 1280, ghostTop: 1160 },
    words: ["Calls.", "Texts.", "“Where", "are", "you?”"],
    accent: "“Where are you?”",
  },
  {
    label: "DISPATCH",
    mood: "warm",
    pose: "cool",
    hero: "dispatchDrop",
    layout: { heroTop: 375, heroScale: 1.06, captionTop: 1280, ghostTop: 1160 },
    words: ["Dispatch", "the", "job"],
    accent: "Dispatch",
  },
  {
    label: "ON THEIR PHONE",
    mood: "fix",
    pose: "wave",
    hero: "phoneArrive",
    layout: { heroTop: 330, heroScale: 1.23, captionTop: 1280, ghostTop: 1160 },
    words: ["It", "lands", "on", "their", "phone"],
    accent: "phone",
  },
  {
    label: "THE JOB",
    mood: "fix",
    pose: "happy",
    hero: "jobCallouts",
    layout: { heroTop: 330, heroScale: 1.1, captionTop: 1280, ghostTop: 1160 },
    words: ["Customer", "number.", "Site", "on", "a", "map."],
    accent: "number. on a map.",
  },
  {
    label: "ON MY WAY",
    mood: "fix",
    pose: "point",
    hero: "onMyWayTap",
    layout: { heroTop: 365, heroScale: 1.14, captionTop: 1280, ghostTop: 1160 },
    words: ["Tap", "“On", "my", "way”"],
    accent: "“On my way”",
  },
  {
    label: "LIVE MAP",
    mood: "fix",
    pose: "cool",
    hero: "liveMap",
    layout: { heroTop: 360, heroScale: 1.04, captionTop: 1280, ghostTop: 1160 },
    words: ["See", "them", "on", "the", "live", "map"],
    accent: "live map",
  },
  {
    label: "DEADLINE",
    mood: "warn",
    pose: "think",
    hero: "deadlineWarn",
    layout: { heroTop: 340, heroScale: 1.08, captionTop: 1280, ghostTop: 1160 },
    words: ["Warned", "before", "a", "deadline", "slips"],
    accent: "before",
  },
  {
    label: "FEWER CALLS",
    mood: "success",
    pose: "happy",
    hero: "callsFade",
    layout: { heroTop: 385, heroScale: 1.28, captionTop: 1280, ghostTop: 1160 },
    words: ["Fewer", "“where", "are", "you?”", "calls"],
    accent: "Fewer",
  },
  {
    label: "TRY IT",
    mood: "warm",
    pose: "point",
    hero: "mapCta",
    words: ["Try", "it", "free", "for", "14", "days"],
    accent: "free",
  },
] satisfies Omit<SceneData, "id" | "from" | "dur">[];

export const scenesMap: SceneData[] = content.map((scene, i) =>
  sceneSchema.parse({
    ...scene,
    id: i + 1,
    from: narration[i].from,
    dur: narration[i].dur,
  }),
);
let end = 0;
for (const scene of scenesMap) {
  if (scene.from !== end)
    throw new Error(`Map scene ${scene.id}: timeline gap or overlap`);
  end += scene.dur;
}
export const mapDurationInFrames = end;
