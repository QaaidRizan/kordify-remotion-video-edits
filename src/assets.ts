// Mapped by visual inspection. Keep the user's original filenames untouched.
export const assets = {
  logo: "assets/logo.jpeg",
  jobs: "assets/phone-2-job.jpeg",
  job: "assets/phone-3-checklist.jpeg",
  evidence: "assets/phone-4-evidence.jpeg",
  offline: "assets/phone-6-offline.jpeg",
  signature: "assets/app-icon.jpeg",
  reports: "assets/feature-graphic.jpeg",
  checklist: null,
  appIcon: null,
  webDispatch: null,
  webInvoice: "assets/invoice.png",
} as const;

export const mascotAssets: Partial<Record<string, string>> = {};

export const mapAssets = {
  jobs: "assets/phone-1-jobs.webp",
  job: "assets/phone-2-job.webp",
  dayMap: "assets/phone-5-map.webp",
  appIcon: "assets/app-icon.png",
} as const;

// Original filenames are retained. Missing assets use explicit illustrations.
export const proofAssets = {
  evidence: assets.evidence,
  signature: assets.signature,
  offline: assets.offline,
  appIcon: mapAssets.appIcon,
  checklist: null,
  before: "assets/proof-before-demo.png",
  after: "assets/proof-after-demo.png",
} as const;
