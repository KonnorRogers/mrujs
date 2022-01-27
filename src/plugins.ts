import { Adapter, MrujsInterface } from './types'

declare global {
  interface Window {
    mrujs: MrujsInterface
    Rails: MrujsInterface
    Turbolinks?: Adapter
    Turbo?: Adapter
  }
}

export * from './plugins/cableCar'
export * from './plugins/jsErb'
export * from './plugins/mrujsTurbo'
export * from './plugins/shoelace'
