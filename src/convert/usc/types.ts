/** USC data contract used by the Sonolus archetype projection. */
export type USC = { offset: number; objects: USCObject[] };
export type USCObject = USCBpmChange | USCTimeScaleChange | USCSingleNote | USCSlideNote;

export type USCBpmChange = { type: "bpm"; beat: number; bpm: number };
export type USCTimeScaleChange = { type: "timeScale"; beat: number; timeScale: number };

type Dir = "left" | "up" | "right";
type Ease = "out" | "linear" | "in";

export type USCSingleNote = {
  type: "single";
  beat: number;
  lane: number;
  size: number;
  trace: boolean;
  critical: boolean;
  direction?: Dir;
};

export type USCConnectionStartNote = {
  type: "start";
  beat: number;
  lane: number;
  size: number;
  trace: boolean;
  critical: boolean;
  ease: Ease;
  easeL?: Ease;
  easeR?: Ease;
};
export type USCConnectionTickNote = {
  type: "tick";
  beat: number;
  lane: number;
  size: number;
  trace: boolean;
  critical: boolean;
  ease: Ease;
  easeL?: Ease;
  easeR?: Ease;
};
export type USCConnectionEndNote = {
  type: "end";
  beat: number;
  lane: number;
  size: number;
  trace: boolean;
  critical: boolean;
  direction?: Dir;
};
// The following connection kinds are part of the USC spec and are handled by
// uscToLevelData, but our chart→USC converter does not currently emit them
// (we emit only start / tick / end). They're included so the vendored
// converter typechecks against the full union.
export type USCConnectionIgnoreNote = {
  type: "ignore";
  beat: number;
  lane: number;
  size: number;
  ease: Ease;
  easeL?: Ease;
  easeR?: Ease;
};
export type USCConnectionHiddenNote = {
  type: "hidden";
  beat: number;
};
export type USCConnectionAttachNote = {
  type: "attach";
  beat: number;
  critical: boolean;
};
export type USCSlideConnection =
  | USCConnectionStartNote
  | USCConnectionTickNote
  | USCConnectionEndNote
  | USCConnectionIgnoreNote
  | USCConnectionHiddenNote
  | USCConnectionAttachNote;

export type USCSlideNote = {
  type: "slide";
  active: boolean;
  critical: boolean;
  connections: USCSlideConnection[];
};
