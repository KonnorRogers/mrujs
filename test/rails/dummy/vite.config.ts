import { defineConfig } from 'vite'
import ViteRuby from 'vite-plugin-ruby'

export default {
  optimizeDeps: {
    include: ['mrujs', 'mrujs/plugins']
  },
  plugins: [
    ViteRuby(),
  ],
}
