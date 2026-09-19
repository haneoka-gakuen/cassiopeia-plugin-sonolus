# Cassiopeia Sonolus plugin

An optional Sonolus target for Cassiopeia. The kernel does not import this
package or the Sonolus SDK. The plugin supplies:

- SS → `LevelData`, SS → USC, and USC → `LevelData` conversion.
- Independently buildable play, watch, preview and tutorial engines in `engine`.
- Bounded effect-atlas capture in `scripts/effects`, using the Three renderer.

SS conversion reuses the Our Notes plugin's normalization; node generation,
coincidences, integer-millisecond rounding and note counts have one source.
`createSonolusPlugin()` registers `SONOLUS_TARGET`. Direct conversion functions
are exported too, for server/CLI use without a long-lived runtime.

```ts
import { convertChart, chartToLevelData } from '@haneoka/cassiopeia-plugin-sonolus';
const levelData = chartToLevelData(convertChart(sourceBytes));
```

```sh
pnpm --filter @haneoka/cassiopeia-plugin-sonolus build
NODE_OPTIONS=--max-old-space-size=1536 pnpm --filter @haneoka/cassiopeia-sonolus-engine build
```

Engine compilation defaults to one target and one compiler worker. Hosts supply
the skin, sound and baked particle resources and serve generated engine data.
Catalogs, release storage, account services and HTTP routes remain host code.

The atlas is an explicit downgrade; straight-alpha Sonolus sprites cannot
exactly reproduce arbitrary additive HDR composition.

The engine derives from the MIT-licensed `sonolus-pjsekai-engine`;
`engine/LICENSE.pjsekai.txt` and `engine/NOTICE.txt` are retained in builds.
Haneoka-authored code is MPL-2.0. Game media is host-provided.
