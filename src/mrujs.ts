// Currently only import the safari submit event polyfill.
import './polyfills'

import { FormSubmitDispatcher } from './formSubmitDispatcher'
import { ClickHandler } from './clickHandler'
import { Csrf } from './csrf'
import { Confirm } from './confirm'
import { Method } from './method'
import { NavigationAdapter } from './navigationAdapter'
import { Toggler } from './toggler'

import { FetchRequest } from './http/fetchRequest'
import { FetchResponse } from './http/fetchResponse'
import { SELECTORS } from './utils/dom'
import { Locateable } from './utils/url'

export class Mrujs {
  static FetchRequest = FetchRequest.constructor
  static FetchResponse = FetchResponse.constructor

  formSubmitDispatcher: FormSubmitDispatcher
  clickHandler: ClickHandler
  connected: boolean
  config: Record<string, unknown>
  confirmClass: Confirm
  csrf: Csrf
  method: Method
  navigationAdapter: NavigationAdapter
  toggler: Toggler
  boundReenableDisabledElements: EventListener

  __restart__!: Function

  constructor (config = {}) {
    this.config = config
    this.clickHandler = new ClickHandler()
    this.csrf = new Csrf()
    this.formSubmitDispatcher = new FormSubmitDispatcher()
    this.navigationAdapter = new NavigationAdapter()
    this.method = new Method()
    this.confirmClass = new Confirm()
    this.toggler = new Toggler()
    this.boundReenableDisabledElements = this.reenableDisabledElements.bind(this)

    this.connected = false
  }

  // connect
  start (): Mrujs {
    window.Rails = window.mrujs = this

    // Dont start twice!
    if (window.mrujs?.connected) {
      return window.mrujs
    }

    this.restart()

    // Allows us to actually remove the function
    this.__restart__ = this.restart.bind(this)

    document.addEventListener('DOMContentLoaded', this.__restart__ as EventListener)
    document.addEventListener('turbolinks:load', this.__restart__ as EventListener)

    return this
  }

  // disconnect and remove the DOMContentLoaded event listener
  stop (): void {
    this.disconnect()
    document.removeEventListener('DOMContentLoaded', this.__restart__ as EventListener)
    document.removeEventListener('turbolinks:load', this.__restart__ as EventListener)
  }

  restart (): void {
    this.disconnect()
    this.connect()
  }

  connect (): void {
    // This event works the same as the load event, except that it fires every
    // time the page is loaded.
    // See https://github.com/rails/jquery-ujs/issues/357
    // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
    this.reenableDisabledElements()
    window.addEventListener('pageshow', this.boundReenableDisabledElements)

    this.csrf.connect()
    this.toggler.addEnableElementListeners() // Enables elements on ajax:stopped / ajax:complete
    this.clickHandler.connect() // preventInsignificantClicks
    this.toggler.addHandleDisabledListeners() // checks if element is disabled before proceeding.
    this.confirmClass.connect() // confirm
    this.toggler.addDisableElementListeners() // disables element while processing.
    this.method.connect()
    this.formSubmitDispatcher.connect()
    this.navigationAdapter.connect()

    this.connected = true
  }

  disconnect (): void {
    window.removeEventListener('pageshow', this.boundReenableDisabledElements)
    this.csrf.disconnect()
    this.toggler.removeEnableElementListeners()
    this.clickHandler.disconnect()
    this.toggler.removeHandleDisabledListeners()
    this.confirmClass.disconnect()
    this.toggler.removeDisableElementListeners()
    this.method.disconnect()
    this.formSubmitDispatcher.disconnect()
    this.navigationAdapter.disconnect()

    this.connected = false
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
  async fetch (input: Request | Locateable, options: RequestInit = {}): Promise<Response> {
    const fetchRequest = new FetchRequest(input, options)
    return await window.fetch(fetchRequest.request)
  }

  get csrfToken (): string | null {
    return this.csrf.token
  }

  get csrfParam (): string | null {
    return this.csrf.param
  }

  reenableDisabledElements (): void {
    document
      .querySelectorAll(`${SELECTORS.formEnableSelector.selector} ${SELECTORS.linkDisableSelector.selector}`)
      .forEach(element => {
        const el = element as HTMLInputElement
        // Reenable any elements previously disabled
        this.toggler.enableElement(el)
      })

    // document
    //   .querySelectorAll()
    //   .forEach(element => {
    //     const el = element as HTMLInputElement
    //     if (el.dataset.ujsDisabled != null) {
    //       el.disabled = false
    //     }
    //   })
  }
}
