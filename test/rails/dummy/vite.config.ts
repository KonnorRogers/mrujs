import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'

export default defineConfig({
  optimizeDeps: {
    include: ['mrujs', 'mrujs/plugins']
  },
  plugins: [
    RubyPlugin(),
  ],
})
