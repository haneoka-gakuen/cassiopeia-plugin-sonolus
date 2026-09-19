import { NoteOperateType, NoteJudgementType, NoteDirection, NoteLineEaseType } from "../shared/enums.js";

import type { SsSig, SsCall } from "@haneoka/cassiopeia";
export type { SsBpm, SsCall, SsRawNote, SsRoot, SsSig } from "@haneoka/cassiopeia";

// ---- Resolved internal chart (engine-agnostic IR) ----
export interface BpmChange {
  tick: number;
  beat: number;
  timeMs: number;
  bpm: number;
}

export interface ResolvedNote {
  id: number;
  tick: number;
  timeMs: number;
  beat: number;
  pos: number; // left-edge lane coord 0..24 (PosAuto already interpolated)
  size: number;
  laneX: number; // normalized center, -1..1
  width: number; // normalized width
  operateType: NoteOperateType;
  judgementType: NoteJudgementType;
  direction: NoteDirection;
  critical: boolean;
  judged: boolean;
  visible: boolean; // raw SsRawNote.visible (default true); standalone notes are always true
  lineIds: number[]; // native NoteInfoData.LineIndexList; endpoints can belong to multiple lines
  slideAlong: boolean; // native NoteInfoData.SlideAlong; PosAuto nodes are excluded from combo boundaries
  indexInLine: number | null;
  easeL: NoteLineEaseType | null; // ease of the segment LEAVING this node (null if last/standalone)
  easeR: NoteLineEaseType | null;
}

export interface NoteLine {
  id: number;
  kind: "long" | "guide";
  noteIds: number[]; // ordered head→tail; includes generated Combo/ComboSkip notes for long lines
}

export interface InternalChart {
  version: number;
  bpmChanges: BpmChange[];
  notes: ResolvedNote[]; // sorted by tick, then id
  lines: NoteLine[];
  durationMs: number;
  passthrough: { skill: number[]; fever: [number, number][]; sig: SsSig[]; call: SsCall[] };
}
