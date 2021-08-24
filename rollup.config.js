import analyze from 'rollup-plugin-analyzer'
import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"

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
      analyze()
    ],
    watch: {
      include: "src/**"
    }
  },
]
