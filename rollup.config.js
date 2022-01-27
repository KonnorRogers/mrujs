import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import { brotliCompressSync } from 'zlib'
import gzipPlugin from 'rollup-plugin-gzip'

function basePlugins(tsconfig = "./tsconfig.json") {
  return [
    resolve(),
    commonjs(),
    typescript({ tsconfig }),
  ]
}

function compressionPlugins(tsconfig = "./tsconfig.json") {
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
    input: "src/index.ts",
    output: [{
      name: "mrujs",
      file: "dist/index.umd.js",
      format: "umd",
      sourcemap: true,
      exports: "named",
    }],
    plugins: basePlugins()
  },
  {
    input: "src/index.ts",
    external: ["morphdom"],
    output: [{
      file: "dist/index.module.js",
      format: "es",
      sourcemap: true,
    }],
    plugins: basePlugins()
  },

  // Plugins
  {
    input: "plugins/src/index.ts",
    output: [{
      file: "plugins/dist/plugins.module.js",
      format: "es",
      sourcemap: true,
    }],
    plugins: basePlugins("./tsconfig-plugins.json")
  },
  {
    input: "plugins/src/index.ts",
    output: [{
      name: "mrujsPlugins",
      file: "plugins/dist/plugins.umd.js",
      format: "umd",
      sourcemap: true,
      exports: "named",
    }],
    plugins: basePlugins("./tsconfig-plugins.json")
  },

  // Compressed
  {
    input: "src/index.ts",
    output: [{
      name: "mrujs",
      file: "dist/index.umd.min.js",
      format: "umd",
      sourcemap: true,
      exports: "named",
    }],
    plugins: compressionPlugins()
  },
  {
    input: "src/index.ts",
    external: ["morphdom"],
    output: [{
      file: "dist/index.module.min.js",
      format: "es",
      sourcemap: true,
    }],
    plugins: compressionPlugins()
  },

  // Plugins
  {
    input: "plugins/src/index.ts",
    output: [{
      file: "plugins/dist/plugins.module.min.js",
      format: "es",
      sourcemap: true,
    }],
    plugins: compressionPlugins("./tsconfig-plugins.json")
  },
  {
    input: "plugins/src/index.ts",
    output: [{
      name: "mrujs",
      file: "plugins/dist/plugins.umd.min.js",
      format: "umd",
      sourcemap: true,
      exports: "named",
    }],
    plugins: compressionPlugins("./tsconfig-plugins.json")
  },
]
