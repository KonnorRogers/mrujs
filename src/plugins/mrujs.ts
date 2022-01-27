import { Adapter, MrujsInterface } from '../types'

declare global {
  interface Window {
    mrujs: MrujsInterface
    Rails: MrujsInterface
    Turbolinks?: Adapter
    Turbo?: Adapter
  }
}

export const mrujs = (): MrujsInterface => window.mrujs
