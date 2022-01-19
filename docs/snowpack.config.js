// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/#configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  workspaceRoot: "../",
  mount: {
    frontend: "/dist",
    ".bridgetown": { url: "/", static: true },
  },
  plugins: [
    [
      "@snowpack/plugin-run-script",
      {
        name: "bridgetown",
        cmd: "bin/bridgetown build",
        watch: "$1 --watch --quiet",
      },
    ],
    "@snowpack/plugin-postcss",
  ],
  devOptions: {
    port: 4000,
    hmrDelay: 300,
    open: "none",
  },
  buildOptions: {
    clean: true,
    out: "output",
  },
  packageOptions: {
    NODE_ENV: true,
    knownEntrypoints: ["mrujs"]
  },
  optimize: {
    bundle: false,
    minify: true,
    manifest: true,
    target: "es2018",
  }
}
