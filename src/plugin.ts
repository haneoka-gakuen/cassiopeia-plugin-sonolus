import { defineCassiopeiaPlugin, defineCassiopeiaService } from "@haneoka/cassiopeia/plugin";
import { convertChart, convertChartAsync, chartToLevelData, chartToUsc, uscToLevelData } from "./convert/index.js";
export const SONOLUS_TARGET = defineCassiopeiaService<{
  convertChart: typeof convertChart;
  convertChartAsync: typeof convertChartAsync;
  chartToLevelData: typeof chartToLevelData;
  chartToUsc: typeof chartToUsc;
  uscToLevelData: typeof uscToLevelData;
}>("cassiopeia.sonolus.v1");
export function createSonolusPlugin() {
  return defineCassiopeiaPlugin({
    manifest: {
      id: "cassiopeia.sonolus",
      version: "0.1.0",
      apiVersion: 1,
      requires: ["cassiopeia.our-notes"],
      provides: [SONOLUS_TARGET.id],
    },
    setup(context) {
      context.provide(SONOLUS_TARGET, {
        convertChart,
        convertChartAsync,
        chartToLevelData,
        chartToUsc,
        uscToLevelData,
      });
    },
  });
}
