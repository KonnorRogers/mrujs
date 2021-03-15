import { Mrujs } from './mrujs'

declare global {
  interface Window {
    mrujs?: Mrujs
    events: Record<string, undefined | number>
  }
}

export { Mrujs }
