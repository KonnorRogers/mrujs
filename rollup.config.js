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
      file: "dist/mrujs.umd.js",
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
      file: "dist/mrujs.module.js",
      format: "es",
      sourcemap: true,
    }],
    plugins: basePlugins()
  },

  // Plugins
  {
    input: "src/plugins/index.ts",
    output: [{
      file: "dist/plugins.module.js",
      format: "es",
      sourcemap: true,
    }],
    plugins: basePlugins()
  },
  {
    input: "src/plugins/index.ts",
    output: [{
      name: "mrujsPlugins",
      file: "dist/plugins.umd.js",
      format: "umd",
      sourcemap: true,
      exports: "named",
    }],
    plugins: basePlugins()
  },

  // Compressed
  {
    input: "src/index.ts",
    output: [{
      name: "mrujs",
      file: "dist/mrujs.umd.min.js",
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
      file: "dist/mrujs.module.min.js",
      format: "es",
      sourcemap: true,
    }],
    plugins: compressionPlugins()
  },

  // Plugins
  {
    input: "src/plugins/index.ts",
    output: [{
      file: "dist/plugins.module.min.js",
      format: "es",
      sourcemap: true,
    }],
    plugins: compressionPlugins()
  },
  {
    input: "src/plugins/index.ts",
    output: [{
      name: "mrujsPlugins",
      file: "dist/plugins.umd.min.js",
      format: "umd",
      sourcemap: true,
      exports: "named",
    }],
    plugins: compressionPlugins()
  },
]
