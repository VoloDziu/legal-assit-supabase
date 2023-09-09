import { Parcel } from "@parcel/core";

let bundler = new Parcel({
  entries: [
    "src/service-worker.ts",
    "src/content-scripts/*.ts",
    "src/app/index.html",
  ],
  defaultConfig: "@parcel/config-default",
  defaultTargetOptions: {
    shouldOptimize: false,
    sourceMaps: false,
    distDir: "./dist/build",
    publicUrl: "../",
  },
});

bundler.watch((err, event) => {
  if (err) {
    // fatal error
    throw err;
  }

  if (event.type === "buildSuccess") {
    let bundles = event.bundleGraph.getBundles();
    console.log(`✨ Built ${bundles.length} bundles in ${event.buildTime}ms!`);
  } else if (event.type === "buildFailure") {
    console.log(event.diagnostics);
  }
});
