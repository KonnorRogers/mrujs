import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"

import { terser } from "rollup-plugin-terser";
import { brotliCompressSync } from 'zlib'
import gzipPlugin from 'rollup-plugin-gzip'

function basePlugins(tsconfig = "tsconfig.json") {
  return [
    resolve(),
    typescript({ tsconfig }),
  ]
}

function compressionPlugins(tsconfig = "tsconfig.json") {
  return [
    ...basePlugins(tsconfig),
    terser({
      compress: {
        passes: 10
      }
    }),
    // GZIP compression as .gz files
    gzipPlugin(),
    // Brotil compression as .br files
    gzipPlugin({
        customCompression: content =>
            brotliCompressSync(Buffer.from(content)),
        fileName: '.br',
    }),
  ]
}

export default [
  {
    external: ["morphdom"],
    input: "src/index.ts",
    output: [
      {
        name: "mrujs",
        file: "dist/mrujs.umd.js",
        format: "umd",
        sourcemap: true,
        exports: "named",
      },
      {
        file: "dist/mrujs.module.js",
        format: "es",
        sourcemap: true,
      }
    ],
    plugins: basePlugins()
  },

  // Plugins
  {
    input: "plugins/src/index.ts",
    output: [
      {
        name: "mrujs",
        file: "plugins/dist/mrujs.umd.js",
        format: "umd",
        sourcemap: true,
        exports: "named",
      },
      {
        file: "plugins/dist/mrujs.module.js",
        format: "es",
        sourcemap: true,
      }
    ],
    plugins: basePlugins("tsconfig-plugins.json")
  },


  // Compressed
  {
    input: "src/index.ts",
    output: [
      {
        name: "mrujs",
        file: "dist/mrujs.umd.min.js",
        format: "umd",
        sourcemap: true,
        exports: "named"
      },
      {
        file: "dist/mrujs.module.min.js",
        format: "es",
        sourcemap: true,
      }
    ],
    plugins: compressionPlugins(),
  },

  {
    input: "plugins/src/index.ts",
    output: [
      {
        name: "mrujs",
        file: "plugins/dist/mrujs.umd.min.js",
        format: "umd",
        sourcemap: true,
        exports: "named"
      },
      {
        file: "plugins/dist/mrujs.module.min.js",
        format: "es",
        sourcemap: true,
      }
    ],
    plugins: compressionPlugins("tsconfig-plugins.json")
  },
]
