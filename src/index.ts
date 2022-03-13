// Currently only import the safari submit event polyfill.
import './polyfills'

import { Mrujs } from './mrujs'
import { Adapter, MrujsInterface } from '../types'

// This is required for typescript checking in tests
declare global {
  interface Window {
    SubmitEvent: typeof Event
    mrujs: MrujsInterface
    Rails: MrujsInterface
    Turbolinks?: Adapter
    Turbo?: Adapter
  }
}

const mrujs: MrujsInterface = Mrujs()

export { mrujs, Mrujs }
export default mrujs

// Yay...esmodules!
export const {
  $,
  CSRFProtection,
  buttonClickSelector,
  buttonDisableSelector,
  cspNonce,
  csrfParam,
  csrfToken,
  confirm,
  delegate,
  disableElement,
  enableElement,
  fileInputSelector,
  fire,
  formDisableSelector,
  formElements,
  formEnableSelector,
  formInputClickSelector,
  formSubmitSelector,
  handleConfirm,
  handleDisabledElement,
  handleMethod,
  inputChangeSelector,
  linkClickSelector,
  linkDisableSelector,
  matches,
  preventInsignificantClick,
  refreshCSRFTokens,
  start,
  stopEverything,
  FetchResponse,
  FetchRequest
} = mrujs
