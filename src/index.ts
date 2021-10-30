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

const mrujs = Mrujs()

export { mrujs, Mrujs }
export default mrujs

// Yay...esmodules!
export const $ = mrujs.$
export const CSRFProtection = mrujs.CSRFProtection
export const buttonClickSelector = mrujs.buttonClickSelector
export const buttonDisableSelector = mrujs.buttonDisableSelector
export const cspNonce = mrujs.cspNonce
export const csrfParam = mrujs.csrfParam
export const csrfToken = mrujs.csrfToken
export const confirm = mrujs.confirm
export const delegate = mrujs.delegate
export const disableElement = mrujs.disableElement
export const enableElement = mrujs.enableElement
export const fileInputSelector = mrujs.fileInputSelector
export const fire = mrujs.fire
export const formDisableSelector = mrujs.formDisableSelector
export const formElements = mrujs.formElements
export const formEnableSelector = mrujs.formEnableSelector
export const formInputClickSelector = mrujs.formInputClickSelector
export const formSubmitSelector = mrujs.formSubmitSelector
export const handleConfirm = mrujs.handleConfirm
export const handleDisabledElement = mrujs.handleDisabledElement
export const handleMethod = mrujs.handleMethod
export const inputChangeSelector = mrujs.inputChangeSelector
export const linkClickSelector = mrujs.linkClickSelector
export const linkDisableSelector = mrujs.linkDisableSelector
export const matches = mrujs.matches
export const preventInsignificantClick = mrujs.preventInsignificantClick
export const refreshCSRFTokens = mrujs.refreshCSRFTokens
export const start = mrujs.start
export const stopEverything = mrujs.stopEverything
