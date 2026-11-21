import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  accountId: "964bce1cb9a4cb0e4273b7b08e61930d",
  worker: defineWorker({
    name: "aurel-dental",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-21",
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
    },
  }),
});
