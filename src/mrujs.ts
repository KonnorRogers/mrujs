// Currently only import the safari submit event polyfill.
import './polyfills'

import { Ajax, ExtendedRequestInit } from './ajax'
import { Csrf } from './csrf'
import { Method } from './method'
import { Confirm } from './confirm'
import { ClickHandler } from './clickHandler'
import { enableSubmitter, disableSubmitter } from './submitToggle'
import { SELECTORS } from './utils/dom'

export class Mrujs {
  config: Record<string, unknown>
  clickHandler: ClickHandler
  csrf: Csrf
  ajax: Ajax
  method: Method
  confirmClass: Confirm
  connected: boolean

  constructor (config = {}) {
    this.config = config
    this.clickHandler = new ClickHandler()
    this.csrf = new Csrf()
    this.ajax = new Ajax()
    this.method = new Method()
    this.confirmClass = new Confirm()

    this.connected = false
  }

  // connect
  start (): Mrujs {
    window.Rails = window.mrujs = this

    // Dont start twice!
    if (window.mrujs?.connected) {
      return window.mrujs
    }

    document.addEventListener('DOMContentLoaded', () => {
      this.connect()
    })

    // This event works the same as the load event, except that it fires every
    // time the page is loaded.
    // See https://github.com/rails/jquery-ujs/issues/357
    // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
    window.addEventListener('pageshow', () => {
      document
        .querySelectorAll(SELECTORS.formEnableSelector.selector)
        .forEach(element => {
          const el = element as HTMLInputElement
          // Reenable any elements previously disabled
          if (el.dataset['mrujs-disabled'] != null) {
            el.disabled = false
          }
        })

      document
        .querySelectorAll(SELECTORS.linkDisableSelector.selector)
        .forEach(element => {
          const el = element as HTMLInputElement
          if (el.dataset['mrujs-disabled'] != null) {
            el.disabled = false
          }
        })
    })

    document.addEventListener('submit', disableSubmitter as EventListener)
    document.addEventListener('ajax:complete', enableSubmitter as EventListener)

    this.connected = true
    return this
  }

  // disconnect
  stop (): void {
    this.disconnect()
  }

  connect (): void {
    this.csrf.connect()
    this.clickHandler.connect()
    this.confirmClass.connect()
    this.method.connect()
    this.ajax.connect()
  }

  disconnect (): void {
    this.csrf.disconnect()
    this.clickHandler.disconnect()
    this.confirmClass.disconnect()
    this.method.disconnect()
    this.ajax.disconnect()
  }

  /**
   * Can be overridden with a custom confirm message
   */
  confirm (message: string): boolean {
    return window.confirm(message)
  }

  /**
   * Takes in an object and will convert it to a Request. {url} is required.
   * If request is null, it comes from a form. If a request object is given,
   * it is required to have a {url:} defined.
   * @see Ajax#fetch
   */
  fetch (request: ExtendedRequestInit): Promise<Response> | null {
    return this.ajax.fetch(request)
  }

  get csrfToken (): string | null {
    return this.csrf.token
  }

  get csrfParam (): string | null {
    return this.csrf.param
  }
}
