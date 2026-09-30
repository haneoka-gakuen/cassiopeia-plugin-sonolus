# Cassiopeia Sonolus conversion plugin

`@haneoka/cassiopeia-plugin-sonolus` is the conversion boundary between Our
Notes SS charts and Sonolus chart data. It normalizes the source through the
Our Notes rules, then converts the same internal chart into:

- Sonolus `LevelData` through `chartToLevelData()`.
- USC through `chartToUsc()`.
- Sonolus `LevelData` from USC through `uscToLevelData()`.

This package is a server/CLI conversion library. Sonolus play, watch, preview,
tutorial presentation, native effects, and resource hosting belong to
`@haneoka/sonolus-our-notes` and the host application.

## Build from a clean Git workspace

The bridge consumes unpublished Cassiopeia and Our Notes peers. Clone and link
them in one workspace:

```sh
mkdir cassiopeia-sonolus-workspace
cd cassiopeia-sonolus-workspace
git clone https://github.com/haneoka-gakuen/cassiopeia.git packages/cassiopeia
git clone https://github.com/haneoka-gakuen/cassiopeia-plugin-our-notes.git packages/our-notes
git clone https://github.com/haneoka-gakuen/cassiopeia-plugin-sonolus.git packages/sonolus-bridge
```

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - packages/*
linkWorkspacePackages: true
```

Install and build:

```sh
corepack enable
corepack prepare pnpm@11.14.0 --activate
pnpm install
pnpm --filter @haneoka/cassiopeia build
pnpm --filter @haneoka/cassiopeia-plugin-our-notes build
pnpm --filter @haneoka/cassiopeia-plugin-sonolus check
```

Use Node 24 or newer. The bridge uses `@sonolus/core` for the `LevelData`
types and output objects; it does not start a Sonolus server.

## Smallest complete conversion

Input is SS chart JSON text or bytes. There is no JSON input-manifest format in
this package:

```ts
import { writeFile } from "node:fs/promises";
import {
  chartToLevelData,
  chartToUsc,
  convertChart,
  uscToLevelData
} from "@haneoka/cassiopeia-plugin-sonolus";

const source = JSON.stringify({
  meta: { version: 1 },
  score: {
    events: {
      bpm: [{ t: 0, bpm: 120 }],
      sig: [{ t: 0, sig: [4, 4] }],
      skill: [],
      fever: [],
      call: []
    },
    notes: [
      {
        type: "tap",
        t: 480,
        pos: 10,
        size: 4,
        crit: false,
        dir: "up",
        ease: "linear",
        visible: true
      }
    ]
  }
});

const chart = convertChart(source);
const levelData = chartToLevelData(chart, 0);
const usc = chartToUsc(chart);
const levelDataFromUsc = uscToLevelData(usc);

await writeFile("out/level-data.json", JSON.stringify(levelData, null, 2));
await writeFile("out/level-data-from-usc.json", JSON.stringify(levelDataFromUsc, null, 2));
await writeFile("out/chart.usc.json", JSON.stringify(usc, null, 2));
```

`convertChart()` returns the normalized internal chart. `convertChartAsync()`
accepts the same SS string/bytes and additionally handles gzip bytes through
the host's `DecompressionStream`. `chartToLevelData()` preserves source tick,
time, lane, operation, judgement, critical, line, and easing fields in entity
data so a host engine can inspect them while consuming native archetypes.

## Runtime service form

Use `createSonolusPlugin()` when conversion is part of a composed Cassiopeia
runtime:

```ts
import { CassiopeiaRuntime, createKernelPlugin } from "@haneoka/cassiopeia/plugin";
import { createOurNotesPlugin } from "@haneoka/cassiopeia-plugin-our-notes";
import { createSonolusPlugin, SONOLUS_TARGET } from "@haneoka/cassiopeia-plugin-sonolus";

const runtime = new CassiopeiaRuntime([
  createKernelPlugin(),
  createOurNotesPlugin(),
  createSonolusPlugin()
]);
const target = runtime.require(SONOLUS_TARGET);
const levelData = target.chartToLevelData(target.convertChart(source));
runtime.dispose();
```

The plugin registers `SONOLUS_TARGET`; direct conversion exports remain
available for short-lived server and CLI jobs without a long-lived runtime.

## Host boundary and lifetime

A host writes the returned objects to release storage, attaches level metadata,
selects `EnginePlayData`/`EngineWatchData` from a native engine package, and
serves the resulting resources. The bridge does not choose catalogs, HTTP
routes, accounts, audio, presentation, or engine revision.

Conversion is synchronous after parsing. Release the returned chart and output
objects after the host has serialized them; dispose `CassiopeiaRuntime` when a
composed conversion service ends.

## License

The package is available under [MPL-2.0](LICENSE). `@sonolus/core` retains its
own license and notices. Preserve game-derived chart, audio, image, and engine
attribution when publishing converted resources.
