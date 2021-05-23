import { Mrujs } from './mrujs'

// This is required for typescript checking in tests
declare global {
  interface Window {
    mrujs?: Mrujs
    Rails?: Mrujs
    Turbolinks?: any
  }
}

const mrujs = new Mrujs()

export { Mrujs }
export default mrujs
