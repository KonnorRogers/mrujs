import { AJAX_EVENTS, dispatch, stopEverything, delegate, fire } from './utils/events'
import { FormSubmitDispatcher } from './formSubmitDispatcher'
import { RemoteWatcher } from './remoteWatcher'
import { ClickHandler } from './clickHandler'
import { CSRFProtection, Csrf, csrfParam, csrfToken, refreshCSRFTokens } from './csrf'
import { handleConfirm, Confirm } from './confirm'
import { Method, handleMethod } from './method'
import { NavigationAdapter } from './navigationAdapter'
import { handleDisabledElement, DisabledElementChecker } from './disabledElementChecker'
import { ElementEnabler, enableElement, enableFormElements, enableFormElement } from './elementEnabler'
import { ElementDisabler, disableElement } from './elementDisabler'
import { AddedNodesObserver } from './addedNodesObserver'
import { urlEncodeFormData } from './utils/form'
import { findSubmitter } from './submitFinder'
import { expandUrl } from './utils/url'

import { getMetaContent, preventInsignificantClick } from './utils/misc'
import { FetchRequest } from './http/fetchRequest'
import { FetchResponse } from './http/fetchResponse'
import { $, addListeners, removeListeners, attachObserverCallback, BASE_SELECTORS, formElements, matches, toArray } from './utils/dom'
import { BASE_ACCEPT_HEADERS } from './utils/headers'
import {
  MimeTypeInterface,
  CustomMimeTypeInterface,
  Locateable,
  ExtendedRequestInit,
  MrujsInterface
} from './types'

export function Mrujs (obj: Partial<MrujsInterface> = {}): MrujsInterface {
  obj.connected = false

  obj = { ...BASE_SELECTORS }
  obj.FetchResponse = FetchResponse
  obj.FetchRequest = FetchRequest

  obj.addedNodesObserver = AddedNodesObserver(addedNodesCallback)
  obj.remoteWatcher = RemoteWatcher()
  obj.elementEnabler = ElementEnabler()
  obj.elementDisabler = ElementDisabler()
  obj.disabledElementChecker = DisabledElementChecker()
  obj.navigationAdapter = NavigationAdapter()
  obj.clickHandler = ClickHandler()
  obj.confirmClass = Confirm()
  obj.csrf = Csrf()
  obj.method = Method()
  obj.formSubmitDispatcher = FormSubmitDispatcher()

  // Order matters here!
  const corePlugins = [
    obj.addedNodesObserver,
    obj.remoteWatcher,
    obj.csrf,
    obj.elementEnabler,
    obj.clickHandler,
    obj.disabledElementChecker,
    obj.confirmClass,
    obj.elementDisabler,
    obj.method,
    obj.formSubmitDispatcher,
    obj.navigationAdapter
  ]

  obj.corePlugins = corePlugins

  const plugins = obj.plugins ?? []
  obj.plugins = plugins

  const allPlugins = corePlugins.concat(plugins)
  obj.allPlugins = allPlugins

  obj.maskLinkMethods = true
  obj.mimeTypes = { ...BASE_ACCEPT_HEADERS }

  obj.stop = stop
  obj.restart = restart
  obj.fetch = fetch
  obj.urlEncodeFormData = urlEncodeFormData
  obj.registerMimeTypes = registerMimeTypes
  obj.enableElement = enableElement
  obj.enableFormElements = enableFormElements
  obj.enableFormElement = enableFormElement
  obj.disableElement = disableElement
  obj.stopEverything = stopEverything
  obj.dispatch = dispatch
  obj.addListeners = addListeners
  obj.removeListeners = removeListeners
  obj.attachObserverCallback = attachObserverCallback
  obj.expandUrl = expandUrl

  obj.findSubmitter = findSubmitter

  // a wrapper for document.querySelectorAll
  obj.$ = $
  obj.CSRFProtection = CSRFProtection
  obj.csrfParam = csrfParam
  obj.csrfToken = csrfToken
  obj.cspNonce = cspNonce
  obj.confirm = confirm
  obj.handleConfirm = handleConfirm
  obj.handleDisabledElement = handleDisabledElement
  obj.handleMethod = handleMethod
  obj.start = start
  obj.preventInsignificantClick = preventInsignificantClick
  obj.refreshCSRFTokens = refreshCSRFTokens
  obj.delegate = delegate
  obj.fire = fire
  obj.formElements = formElements
  obj.matches = matches
  obj.toArray = toArray

  return obj as MrujsInterface
}

function start (this: MrujsInterface, options: Partial<MrujsInterface> = {}): MrujsInterface {
  window.Rails = window.mrujs = this

  // Dont start twice!
  if (window.mrujs.connected) {
    return window.mrujs
  }

  Object.assign(this, options)

  this.allPlugins = this.corePlugins.concat(this.plugins)

  for (let i = 0; i < this.allPlugins.length; i++) {
    const plugin = this.allPlugins[i]
    plugin.initialize?.()
  }

  connect()

  return this
}

function stop (): void {
  disconnect()
}

function restart (): void {
  disconnect()
  connect()
}

function connect (): void {
  // This event works the same as the load event, except that it fires every
  // time the page is loaded.
  // See https://github.com/rails/jquery-ujs/issues/357
  // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
  reEnableDisabledElements()
  window.addEventListener('pageshow', reEnableDisabledElements)

  for (let i = 0; i < window.mrujs.allPlugins.length; i++) {
    const plugin = window.mrujs.allPlugins[i]
    plugin.connect?.()
  }

  window.mrujs.connected = true
}

function disconnect (): void {
  window.removeEventListener('pageshow', reEnableDisabledElements)

  for (let i = 0; i < window.mrujs.allPlugins.length; i++) {
    const plugin = window.mrujs.allPlugins[i]
    plugin.disconnect?.()
  }

  window.mrujs.connected = false
}

function confirm (message: string): boolean {
  return window.confirm(message)
}

function addedNodesCallback (this: MrujsInterface, mutationList: MutationRecord[], _observer: MutationObserver): void {
  for (const mutation of mutationList) {
    let addedNodes: Node[]

    if (mutation.type === 'attributes') {
      addedNodes = [mutation.target]
    } else {
      addedNodes = Array.from(mutation.addedNodes)
    }

    // kick it into setTimeout so we dont delay rendering
    window.setTimeout(() => {
      for (let i = 0; i < window.mrujs.allPlugins.length; i++) {
        const plugin = window.mrujs.allPlugins[i]
        plugin.observerCallback?.(addedNodes)
      }
    }, 0)
  }
}

export function fetch (input: Request | Locateable, options: ExtendedRequestInit = {}): undefined | Promise<Response> {
  let { element, submitter, dispatchEvents } = options
  delete options.element
  delete options.submitter
  delete options.dispatchEvents

  const fetchRequest = FetchRequest(input, options)

  if (dispatchEvents === true) {
    if (element == null) element = document.documentElement

    dispatch.call(element, AJAX_EVENTS.ajaxBeforeSend, {
      detail: { element, fetchRequest, request: fetchRequest.request, submitter }
    })
    return undefined
  }

  return window.fetch(fetchRequest.request)
}

export function registerMimeTypes (mimeTypes: CustomMimeTypeInterface[]): MimeTypeInterface {
  mimeTypes.forEach((mimeType) => {
    const { shortcut, header } = mimeType
    window.mrujs.mimeTypes[shortcut] = header
  })

  return window.mrujs.mimeTypes
}

function reEnableDisabledElements (): void {
  const { formEnableSelector, linkDisableSelector } = window.mrujs

  $(`${formEnableSelector as string}, ${linkDisableSelector as string}`)
    .forEach(element => {
      const el = element as HTMLInputElement
      // Reenable any elements previously disabled
      enableElement(el)
    })
}

function cspNonce (): string | undefined {
  return getMetaContent('csp-nonce')
}
