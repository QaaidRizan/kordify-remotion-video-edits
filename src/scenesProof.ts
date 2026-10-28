import { sceneSchema, type SceneConfig } from "./scenes";
import narration from "./proof-voiceover.json";

const story = [
  {
    label: "PROVE IT",
    mood: "problem",
    pose: "stressed",
    hero: "disputeBubble",
    words: ['"You', "didn't", "do", 'that."', "Prove", "it."],
    accent: "Prove it.",
  },
  {
    label: "SAME ARGUMENT",
    mood: "problem",
    pose: "think",
    hero: "tradeChips",
    words: ["Cleaning.", "HVAC.", "Same", "argument."],
    accent: "Same argument.",
  },
  {
    label: "THE DISPUTE",
    mood: "problem",
    pose: "stressed",
    hero: "jobDispute",
    words: ["Job", "done.", "Customer", "says", "no."],
    accent: "no.",
  },
  {
    label: "MANDATORY",
    mood: "fix",
    pose: "cool",
    hero: "requiredChecklist",
    words: ["You", "decide", "what's", "mandatory"],
    accent: "mandatory",
  },
  {
    label: "LOCKED",
    mood: "fix",
    pose: "point",
    hero: "lockedClose",
    words: ["Can't", "close", "the", "job", "until", "it's", "done"],
    accent: "until it's done",
  },
  {
    label: "PHOTOS",
    mood: "fix",
    pose: "happy",
    hero: "stampedPhotos",
    words: [
      "Before",
      "+",
      "after",
      "photos,",
      "time",
      "and",
      "place",
      "stamped",
    ],
    accent: "time and place",
  },
  {
    label: "SIGNATURE",
    mood: "fix",
    pose: "wave",
    hero: "signatureDraw",
    words: ["Customer", "signs", "on", "the", "screen"],
    accent: "signs",
  },
  {
    label: "EVIDENCE",
    mood: "success",
    pose: "cool",
    hero: "evidenceLock",
    words: ["Evidence", "can't", "be", "edited"],
    accent: "can't be edited",
  },
  {
    label: "OFFLINE",
    mood: "fix",
    pose: "happy",
    hero: "offlineSync",
    words: ["Even", "with", "no", "signal"],
    accent: "no signal",
  },
  {
    label: "TRY IT",
    mood: "warm",
    pose: "point",
    hero: "proofCta",
    words: ["Try", "it", "free", "for", "14", "days"],
    accent: "free",
  },
] as const;

export const scenesProof: SceneConfig[] = story.map((scene, index) =>
  sceneSchema.parse({
    ...scene,
    id: index + 1,
    from: narration[index].from,
    dur: narration[index].dur,
  }),
);
let end = 0;
for (const scene of scenesProof) {
  if (scene.from !== end)
    throw new Error(`Proof scene ${scene.id} has a gap or overlap`);
  end += scene.dur;
}
export const proofDurationInFrames = end;
