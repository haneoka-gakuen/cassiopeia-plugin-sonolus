import { buildChart as normalizeChart } from "@haneoka/cassiopeia-plugin-our-notes";
import type { InternalChart, SsRoot } from "./types.js";

/** Both targets consume the same normalization, including coincident and quantized auto nodes. */
export function buildChart(root: SsRoot): InternalChart {
  const chart = normalizeChart(root);
  return { ...chart, passthrough: { skill: root.skill, fever: root.fever, sig: root.sig, call: root.call } };
}
