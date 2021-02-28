import { playwrightLauncher } from '@web/test-runner-playwright';

export default /** @type {import('@web/test-runner').DevServerConfig} */ ({
  files: 'test/**/*.test.html',
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'webkit' }),
    playwrightLauncher({ product: 'firefox' }),
  ],
  nodeResolve: true,
  rootDir: "."
})
