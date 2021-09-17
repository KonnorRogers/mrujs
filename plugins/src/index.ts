import { Adapter, MrujsInterface } from '../../src/types'

declare global {
  interface Window {
    mrujs: MrujsInterface
    Rails: MrujsInterface
    Turbolinks?: Adapter
    Turbo?: Adapter
  }
}

export * from './cableCar'
export * from './asyncConfirm'
export * from './jsErb'
