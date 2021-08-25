import analyze from 'rollup-plugin-analyzer'
import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import { terser } from "rollup-plugin-terser";
import { brotliCompressSync } from 'zlib'
import gzipPlugin from 'rollup-plugin-gzip'

export default [
  {
    input: "src/index.ts",
    output: [
      {
        name: "mrujs",
        file: "dist/mrujs.umd.js",
        format: "umd",
        sourcemap: true,
        exports: "named"
      },
      {
        file: "dist/mrujs.module.js",
        format: "es",
        sourcemap: true,
      }
    ],
    plugins: [
      resolve(),
      typescript(),
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
      analyze()
    ],
    watch: {
      include: "src/**"
    }
  },
]
