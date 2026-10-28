import type { SceneData } from "../../scenes";
import { NoSignal } from "./NoSignal";
import { MessyPile } from "./MessyPile";
import { NoProof } from "./NoProof";
import { LateInvoice } from "./LateInvoice";
import { LogoReveal } from "./LogoReveal";
import { DispatchBoard } from "./DispatchBoard";
import { OfflinePhone } from "./OfflinePhone";
import { ProofStack } from "./ProofStack";
import { InvoicePaid } from "./InvoicePaid";
import { BigOne } from "./BigOne";
import { Cta } from "./Cta";
import {
  DisputeBubble,
  TradeChips,
  JobDispute,
  RequiredChecklist,
  LockedClose,
  StampedPhotos,
  SignatureDraw,
  EvidenceLock,
  OfflineSync,
  ProofCta,
} from "../heroesProof/ProofHeroes";
import {
  QuestionMap,
  CallPile,
  DispatchDrop,
  PhoneArrive,
  JobCallouts,
  OnMyWayTap,
  LiveMap,
  DeadlineWarn,
  CallsFade,
  MapCta,
} from "../heroesMap/MapHeroes";

const heroes = {
  noSignal: NoSignal,
  messyPile: MessyPile,
  noProof: NoProof,
  lateInvoice: LateInvoice,
  logoReveal: LogoReveal,
  dispatchBoard: DispatchBoard,
  offlinePhone: OfflinePhone,
  proofStack: ProofStack,
  invoicePaid: InvoicePaid,
  bigOne: BigOne,
  cta: Cta,
  questionMap: QuestionMap,
  callPile: CallPile,
  dispatchDrop: DispatchDrop,
  phoneArrive: PhoneArrive,
  jobCallouts: JobCallouts,
  onMyWayTap: OnMyWayTap,
  liveMap: LiveMap,
  deadlineWarn: DeadlineWarn,
  callsFade: CallsFade,
  mapCta: MapCta,
  disputeBubble: DisputeBubble,
  tradeChips: TradeChips,
  jobDispute: JobDispute,
  requiredChecklist: RequiredChecklist,
  lockedClose: LockedClose,
  stampedPhotos: StampedPhotos,
  signatureDraw: SignatureDraw,
  evidenceLock: EvidenceLock,
  offlineSync: OfflineSync,
  proofCta: ProofCta,
} as const;

export const Hero = ({
  type,
  layout,
}: {
  type: SceneData["hero"];
  layout?: SceneData["layout"];
}) => {
  const Component = heroes[type];
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: layout?.heroTop ?? 295,
        width: 1080,
        height: 800,
        transform: `scale(${layout?.heroScale ?? 1})`,
        transformOrigin: "50% 0%",
      }}
    >
      <Component />
    </div>
  );
};
