// Currently only import the safari submit event polyfill.
import './polyfills'

import { Mrujs } from './mrujs'
import { FetchRequest } from './http/fetchRequest'
import { FetchResponse } from './http/fetchResponse'
import { Adapter } from './navigationAdapter'
import { MrujsInterface } from './types'

// This is required for typescript checking in tests
declare global {
  interface Window {
    mrujs: MrujsInterface
    Rails: MrujsInterface
    Turbolinks?: Adapter
    Turbo?: Adapter
  }
}

const mrujs = Mrujs()

export { mrujs, Mrujs }
export { FetchRequest, FetchResponse }
export default mrujs
