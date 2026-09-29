# Cassiopeia Sonolus plugin

An optional Sonolus target for Cassiopeia. The kernel does not import this
package or the Sonolus SDK. The plugin supplies:

- SS → `LevelData`, SS → USC, and USC → `LevelData` conversion.

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
```

The package supplies the bridge used by host-owned Sonolus engines. Catalogs,
release storage, account services, HTTP routes, presentation, and game media
remain outside this conversion package.
