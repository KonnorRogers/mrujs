// Currently only import the safari submit event polyfill.
import './polyfills'

import { Mrujs } from './mrujs'
import { FetchRequest } from './http/fetchRequest'
import { FetchResponse } from './http/fetchResponse'
import { Adapter } from './navigationAdapter'

// This is required for typescript checking in tests
declare global {
  interface Window {
    mrujs: Mrujs
    Rails: Mrujs
    Turbolinks?: Adapter
    Turbo?: Adapter
  }
}

const mrujs = new Mrujs()

export { Mrujs }
export { FetchRequest, FetchResponse }
export default mrujs

export { CableCar } from './plugins/cableCar'
