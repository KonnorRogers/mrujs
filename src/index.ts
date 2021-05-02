import { Mrujs } from './mrujs'

// This is required for typescript checking in tests
declare global {
  interface Window {
    mrujs?: Mrujs
  }
}

export { Mrujs }
