import { parseScore } from "@haneoka/cassiopeia-plugin-our-notes";
import type { SsRoot } from "./types.js";

function toText(input: string | Uint8Array): string {
  if (typeof input === "string") {
    return input.replace(/^﻿/, "");
  }
  if (input.length >= 2 && input[0] === 0x1f && input[1] === 0x8b) {
    throw new Error("compressed chart input requires parseSsAsync");
  }
  return new TextDecoder("utf-8").decode(input).replace(/^﻿/, "");
}

export async function decodeSsText(input: string | Uint8Array): Promise<string> {
  if (typeof input === "string") return input.replace(/^﻿/, "");
  if (input.length < 2 || input[0] !== 0x1f || input[1] !== 0x8b) return toText(input);
  if (typeof DecompressionStream === "undefined") {
    throw new Error("gzip chart input is unsupported by this runtime");
  }
  const copy = new Uint8Array(input.byteLength);
  copy.set(input);
  const stream = new Blob([copy]).stream().pipeThrough(new DecompressionStream("gzip"));
  return (await new Response(stream).text()).replace(/^﻿/, "");
}

export function parseSs(input: string | Uint8Array): SsRoot {
  return parseScore(toText(input));
}

export async function parseSsAsync(input: string | Uint8Array): Promise<SsRoot> {
  return parseSs(await decodeSsText(input));
}
