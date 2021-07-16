// Currently only import the safari submit event polyfill.
import './polyfills'

import { FormSubmitDispatcher } from './formSubmitDispatcher'
import { ClickHandler } from './clickHandler'
import { Csrf } from './csrf'
import { Confirm } from './confirm'
import { Method } from './method'
import { NavigationAdapter } from './navigationAdapter'
import { DisabledElementChecker } from './disabledElementChecker'
import { ElementEnabler } from './elementEnabler'
import { ElementDisabler } from './elementDisabler'
import { AddedNodesObserver } from './addedNodesObserver'

import { FetchRequest } from './http/fetchRequest'
import { FetchResponse } from './http/fetchResponse'
import { BASE_SELECTORS, match } from './utils/dom'
import { Locateable } from './utils/url'
import { BASE_ACCEPT_HEADERS } from './utils/headers'
import {
  ExposedUtilsInterface,
  MrujsPluginInterface,
  MrujsConfigInterface,
  QuerySelectorInterface,
  MimeTypeInterface,
  CustomMimeTypeInterface
} from './types'

export class Mrujs {
  connected: boolean
  config: MrujsConfigInterface

  readonly boundReEnableDisabledElements = this.reEnableDisabledElements.bind(this) as EventListener

  readonly elementEnabler = new ElementEnabler()
  readonly elementDisabler = new ElementDisabler()
  readonly disabledElementChecker = new DisabledElementChecker()
  readonly navigationAdapter = new NavigationAdapter()
  readonly clickHandler = new ClickHandler()
  readonly confirmClass = new Confirm()
  readonly csrf = new Csrf()
  readonly method = new Method()

  private readonly corePlugins: MrujsPluginInterface[]
  private readonly formSubmitDispatcher = new FormSubmitDispatcher()
  private readonly boundAddedNodesCallback = this.addedNodesCallback.bind(this)
  private readonly addedNodesObserver = new AddedNodesObserver(this.boundAddedNodesCallback)

  constructor () {
    this.config = {
      querySelectors: { ...BASE_SELECTORS },
      mimeTypes: { ...BASE_ACCEPT_HEADERS },
      plugins: []
    }

    // Order matters here!
    this.corePlugins = [
      this.addedNodesObserver,
      this.csrf,
      this.elementEnabler,
      this.clickHandler,
      this.disabledElementChecker,
      this.confirmClass,
      this.elementDisabler,
      this.method,
      this.formSubmitDispatcher,
      this.navigationAdapter
    ]

    this.connected = false
  }

  start (config: Partial<MrujsConfigInterface> = {}): Mrujs {
    window.Rails = window.mrujs = this

    // Dont start twice!
    if (window.mrujs.connected) {
      return window.mrujs
    }

    this.config = { ...this.config, ...config }
    this.plugins.forEach((plugin) => {
      if (typeof plugin["initialize"] === "function") {
        plugin.initialize()
      }
    })

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

  private connect (): void {
    // This event works the same as the load event, except that it fires every
    // time the page is loaded.
    // See https://github.com/rails/jquery-ujs/issues/357
    // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
    this.reEnableDisabledElements()
    window.addEventListener('pageshow', this.boundReEnableDisabledElements)

    this.corePlugins.concat(this.plugins).forEach((plugin) => {
      plugin.connect()
    })

    this.connected = true
  }

  private disconnect (): void {
    window.removeEventListener('pageshow', this.boundReEnableDisabledElements)

    this.corePlugins.concat(this.plugins).forEach((plugin) => {
      plugin.connect()
    })

    this.connected = false
  }

  addedNodesCallback (mutationList: MutationRecord[], _observer: MutationObserver): void {
    for (const mutation of mutationList) {
      let addedNodes: Node[]

      if (mutation.type === 'attributes') {
        addedNodes = [mutation.target]
      } else {
        addedNodes = Array.from(mutation.addedNodes)
      }

      this.corePlugins.concat(this.plugins).forEach((plugin) => {
        if (typeof plugin.observerCallback === 'function') {
          plugin.observerCallback(addedNodes)
        }
      })
    }
  }

  /**
   * Can be overridden with a custom confirm message
   */
  confirm (message: string): boolean {
    return window.confirm(message)
  }

  /**
   * Utilities generally not used for general purpose, but instead used for things like
   *   plugins or advanced features.
   */
  get utils (): ExposedUtilsInterface {
    return {
      match,
      FetchRequest: FetchRequest,
      FetchResponse: FetchResponse
    }
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

  get plugins (): MrujsPluginInterface[] {
    return this.config.plugins
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

  private reEnableDisabledElements (): void {
    document
      .querySelectorAll(`${window.mrujs.querySelectors.formEnableSelector.selector}, ${window.mrujs.querySelectors.linkDisableSelector.selector}`)
      .forEach(element => {
        const el = element as HTMLInputElement
        // Reenable any elements previously disabled
        this.elementEnabler.enableElement(el)
      })
  }
}
