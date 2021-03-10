import { esbuildPlugin } from '@web/dev-server-esbuild'
export default ({
  rootDir: '.',
  nodeResolve: true,
  appIndex: 'demo/index.html',
  open: true,
  plugins: [
    esbuildPlugin({ ts: true })
  ]
})
