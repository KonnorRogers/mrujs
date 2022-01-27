import { Adapter, MrujsInterface } from '../../types'

declare global {
  interface Window {
    mrujs: MrujsInterface
    Rails: MrujsInterface
    Turbolinks?: Adapter
    Turbo?: Adapter
  }
}

export * from './cableCar'
export * from './jsErb'
export * from './mrujsTurbo'
export * from './shoelace'
