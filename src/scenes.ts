import { z } from "zod";

export const sceneSchema = z.object({
  id: z.number().int(),
  from: z.number().int(),
  dur: z.number().int().positive(),
  label: z.string(),
  mood: z.enum(["problem", "warm", "fix", "warn", "success"]),
  pose: z.enum(["stressed", "think", "wave", "cool", "happy", "point"]),
  hero: z.enum([
    "noSignal",
    "messyPile",
    "noProof",
    "lateInvoice",
    "logoReveal",
    "dispatchBoard",
    "offlinePhone",
    "proofStack",
    "invoicePaid",
    "bigOne",
    "cta",
    "questionMap",
    "callPile",
    "dispatchDrop",
    "phoneArrive",
    "jobCallouts",
    "onMyWayTap",
    "liveMap",
    "deadlineWarn",
    "callsFade",
    "mapCta",
    "disputeBubble",
    "tradeChips",
    "jobDispute",
    "requiredChecklist",
    "lockedClose",
    "stampedPhotos",
    "signatureDraw",
    "evidenceLock",
    "offlineSync",
    "proofCta",
  ]),
  words: z.array(z.string()),
  accent: z.string(),
  layout: z
    .object({
      heroTop: z.number(),
      heroScale: z.number().positive(),
      captionTop: z.number(),
      ghostTop: z.number(),
    })
    .optional(),
});

export type SceneConfig = z.infer<typeof sceneSchema>;
export const reelSchema = z.object({
  showSafeZones: z.boolean(),
  sfxVolume: z.number().min(0).max(1).step(0.05).default(0.85),
  voiceoverVolume: z.number().min(0).max(1).step(0.05).default(1),
  musicVolume: z.number().min(0).max(1).step(0.01).default(0.12),
});
export type ReelProps = z.infer<typeof reelSchema>;

export const scenes = [
  {
    id: 1,
    from: 0,
    dur: 143,
    label: "THE CHAOS",
    mood: "problem",
    pose: "stressed",
    hero: "noSignal",
    words: ["No signal.", "Status:", "unknown."],
    accent: "unknown.",
  },
  {
    id: 2,
    from: 143,
    dur: 87,
    label: "THE MESS",
    mood: "problem",
    pose: "think",
    hero: "messyPile",
    words: ["Jobs", "lost", "in", "texts,", "notes,", "sheets"],
    accent: "lost",
  },
  {
    id: 3,
    from: 230,
    dur: 54,
    label: "NO PROOF",
    mood: "problem",
    pose: "stressed",
    hero: "noProof",
    words: ["No", "proof", "of", "work"],
    accent: "proof",
  },
  {
    id: 4,
    from: 284,
    dur: 72,
    label: "LATE PAY",
    mood: "problem",
    pose: "think",
    hero: "lateInvoice",
    words: ["Invoices", "go", "out", "late"],
    accent: "late",
  },
  {
    id: 5,
    from: 356,
    dur: 41,
    label: "MEET KORDIFY",
    mood: "warm",
    pose: "wave",
    hero: "logoReveal",
    words: ["Meet", "Kordify"],
    accent: "Kordify",
  },
  {
    id: 6,
    from: 397,
    dur: 59,
    label: "DISPATCH",
    mood: "fix",
    pose: "cool",
    hero: "dispatchBoard",
    words: ["Dispatch", "from", "the", "web", "app"],
    accent: "Dispatch",
  },
  {
    id: 7,
    from: 456,
    dur: 121,
    label: "OFFLINE",
    mood: "fix",
    pose: "happy",
    hero: "offlinePhone",
    words: ["Works", "offline,", "syncs", "later"],
    accent: "offline,",
  },
  {
    id: 8,
    from: 577,
    dur: 127,
    label: "PROOF",
    mood: "fix",
    pose: "cool",
    hero: "proofStack",
    words: ["Checklist.", "Photos.", "Signature."],
    accent: "Signature.",
  },
  {
    id: 9,
    from: 704,
    dur: 123,
    label: "GET PAID",
    mood: "warm",
    pose: "happy",
    hero: "invoicePaid",
    words: ["Job", "done,", "invoice", "sent,", "paid"],
    accent: "paid",
  },
  {
    id: 10,
    from: 827,
    dur: 106,
    label: "ONE PLACE",
    mood: "success",
    pose: "cool",
    hero: "bigOne",
    words: ["Request", "to", "paid.", "One", "place."],
    accent: "One place.",
  },
  {
    id: 11,
    from: 933,
    dur: 95,
    label: "TRY IT",
    mood: "warm",
    pose: "point",
    hero: "cta",
    words: ["Start", "your", "free", "trial"],
    accent: "free trial",
  },
] as const satisfies readonly SceneConfig[];

// Validate authoring errors immediately, before Studio or a render can hide them.
z.array(sceneSchema).parse(scenes);
let end = 0;
for (const scene of scenes) {
  if (scene.from !== end)
    throw new Error(`Scene ${scene.id} has a gap or overlap`);
  end += scene.dur;
}
// Narration sets the edit length; the user approved extending the original 30s.
export const reelDurationInFrames = end;

export type SceneData = SceneConfig;
