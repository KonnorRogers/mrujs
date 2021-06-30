// Currently only import the safari submit event polyfill.
import './polyfills'

import { FormSubmitDispatcher } from './formSubmitDispatcher'
import { ClickHandler } from './clickHandler'
import { Csrf } from './csrf'
import { Confirm } from './confirm'
import { Method } from './method'
import { NavigationAdapter } from './navigationAdapter'
import { Toggler } from './toggler'
import { AddedNodesObserver } from './addedNodesObserver'

import { FetchRequest } from './http/fetchRequest'
import { FetchResponse } from './http/fetchResponse'
import { BASE_SELECTORS } from './utils/dom'
import { Locateable } from './utils/url'
import { BASE_ACCEPT_HEADERS } from './utils/headers'
import { MrujsConfigInterface, QuerySelectorInterface, MimeTypeInterface, CustomMimeTypeInterface } from './types'

export class Mrujs {
  static FetchRequest = FetchRequest.constructor
  static FetchResponse = FetchResponse.constructor

  private readonly addedNodesObserver: AddedNodesObserver
  formSubmitDispatcher: FormSubmitDispatcher
  clickHandler: ClickHandler
  connected: boolean
  config: MrujsConfigInterface
  confirmClass: Confirm
  csrf: Csrf
  method: Method
  navigationAdapter: NavigationAdapter
  toggler: Toggler

  boundReenableDisabledElements: EventListener

  constructor () {
    this.config = { querySelectors: { ...BASE_SELECTORS }, mimeTypes: { ...BASE_ACCEPT_HEADERS } }
    this.clickHandler = new ClickHandler()
    this.csrf = new Csrf()
    this.formSubmitDispatcher = new FormSubmitDispatcher()
    this.navigationAdapter = new NavigationAdapter()
    this.method = new Method()
    this.confirmClass = new Confirm()
    this.toggler = new Toggler()
    this.boundReenableDisabledElements = this.reenableDisabledElements.bind(this)

    // MutationObserver for added nodes
    this.addedNodesObserver = new AddedNodesObserver(this.addedNodesCallback.bind(this))

    this.connected = false
  }

  start (): Mrujs {
    window.Rails = window.mrujs = this

    // Dont start twice!
    if (window.mrujs.connected) {
      return window.mrujs
    }

    this.connect()

    return this
  }

  stop (): void {
    this.disconnect()
  }

  restart (): void {
    this.disconnect()
    this.connect()
  }

  connect (): void {
    this.addedNodesObserver.connect()
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
    this.addedNodesObserver.disconnect()
    this.csrf.disconnect()
    this.toggler.removeEnableElementListeners()
    this.clickHandler.disconnect()
    this.toggler.removeHandleDisabledListeners()
    this.confirmClass.disconnect()
    this.toggler.removeDisableElementListeners()
    this.method.disconnect()
    this.formSubmitDispatcher.disconnect()
    this.navigationAdapter.disconnect()

    this.addedNodesObserver.disconnect()

    this.connected = false
  }

  addedNodesCallback (mutationList: MutationRecord[], _observer: MutationObserver): void {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        this.toggler.enableElementObserverCallback(mutation.addedNodes)
        this.clickHandler.observerCallback(mutation.addedNodes)
        this.confirmClass.observerCallback(mutation.addedNodes)
        this.toggler.disableElementObserverCallback(mutation.addedNodes)
        this.toggler.handleDisabledObserverCallback(mutation.addedNodes)
        this.method.observerCallback(mutation.addedNodes)
      }
    }
  }

  /**
   * Can be overridden with a custom confirm message
   */
  confirm (message: string): boolean {
    return window.confirm(message)
  }

  async fetch (input: Request | Locateable, options: RequestInit = {}): Promise<Response> {
    const fetchRequest = new FetchRequest(input, options)
    return await window.fetch(fetchRequest.request)
  }

  registerMimeTypes (mimeTypes: CustomMimeTypeInterface[]): MimeTypeInterface {
    const customMimeTypes: MimeTypeInterface = {}

    mimeTypes.forEach((mimeType) => {
      const { shortcut, header } = mimeType
      customMimeTypes[shortcut] = header
    })

    this.config.mimeTypes = {
      ...this.config.mimeTypes,
      ...customMimeTypes
    }

    return this.mimeTypes
  }

  get mimeTypes (): MimeTypeInterface {
    return this.config.mimeTypes
  }

  get querySelectors (): QuerySelectorInterface {
    return this.config.querySelectors
  }

  set querySelectors (querySelectors: QuerySelectorInterface) {
    this.config.querySelectors = querySelectors
  }

  get csrfToken (): string | null {
    return this.csrf.token
  }

  get csrfParam (): string | null {
    return this.csrf.param
  }

  reenableDisabledElements (): void {
    document
      .querySelectorAll(`${this.querySelectors.formEnableSelector.selector} ${this.querySelectors.linkDisableSelector.selector}`)
      .forEach(element => {
        const el = element as HTMLInputElement
        // Reenable any elements previously disabled
        this.toggler.enableElement(el)
      })
  }
}
