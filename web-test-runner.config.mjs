import { playwrightLauncher } from '@web/test-runner-playwright'
import { esbuildPlugin } from '@web/dev-server-esbuild'

export default ({
  files: 'test/js/**/*.test.html',
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'webkit' })
  ],
  nodeResolve: true,
  rootDir: '.',

  plugins: [
    esbuildPlugin({ ts: true })
  ]
})
