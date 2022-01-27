import { attachObserverCallback, matches, addListeners, removeListeners, formElements } from './utils/dom'
import { stopEverything, AJAX_EVENTS } from './utils/events'
import { SelectorType, EventQueryInterface, MrujsPluginInterface } from './types'

export function ElementEnabler (): MrujsPluginInterface {
  const callbacks = [enableElement] as EventListener[]
  let queries: EventQueryInterface[] = []

  function initialize (): void {
    queries = getQueries()
  }

  function connect (): void {
    addListeners(queries, callbacks)
  }

  function disconnect (): void {
    removeListeners(queries, callbacks)
  }

  function observerCallback (nodeList: Node[]): void {
    attachObserverCallback(queries, nodeList, callbacks)
  }

  return {
    name: 'ElementEnabler',
    initialize,
    connect,
    disconnect,
    observerCallback,
    callbacks
  }
}

function getQueries (): EventQueryInterface[] {
  const { formSubmitSelector, buttonDisableSelector, linkDisableSelector, inputChangeSelector } = window.mrujs

  const selectors: SelectorType[] = [linkDisableSelector, buttonDisableSelector,
    formSubmitSelector, inputChangeSelector]
  return [
    { event: AJAX_EVENTS.ajaxComplete, selectors: selectors },
    { event: AJAX_EVENTS.ajaxStopped, selectors: selectors },
    { event: 'turbo:submit-end', selectors: selectors }
  ]
}

// Unified function to enable an element (link, button and form)
export function enableElement (trigger: Event | HTMLElement): void {
  let element = trigger as HTMLElement

  if (trigger instanceof Event) element = trigger.target as HTMLElement

  const { linkDisableSelector, buttonDisableSelector, formEnableSelector, formSubmitSelector } = window.mrujs

  if (matches(element, linkDisableSelector)) {
    enableLinkElement(element)
    return
  }

  if (matches(element, buttonDisableSelector) || matches(element, formEnableSelector)) {
    enableFormElement(element)
    return
  }

  if (matches(element, formSubmitSelector)) {
    enableFormElements(element as HTMLFormElement)
  }
}

/**
  * Restore element to its original state which was disabled by 'disableLinkElement' above
  */
function enableLinkElement (element: HTMLElement): void {
  const originalText = element.dataset.ujsEnableWith

  if (originalText != null) {
    element.innerHTML = originalText // set to old enabled state
    element.removeAttribute('data-ujs-enable-with') // clean up cache
  }

  element.removeEventListener('click', stopEverything) // enable element
  element.removeAttribute('data-ujs-disabled')
}

/**
 * Re-enables disabled form elements:
 *  - Replaces element text with cached value from 'ujs-enable-with' data store (created in `disableFormElements`)
 *  - Sets disabled property to false
 */
export function enableFormElements (form: HTMLFormElement): void {
  const elements = formElements(form, window.mrujs.formEnableSelector) as HTMLElement[]

  elements.forEach(enableFormElement)
}

export function enableFormElement (element: HTMLElement): void {
  const originalText = element.dataset.ujsEnableWith

  if (originalText != null) {
    if (matches(element, 'button')) {
      element.innerHTML = originalText
    } else {
      (element as HTMLFormElement).value = originalText
    }
    element.removeAttribute('data-ujs-enable-with') // clean up cache
  }

  (element as HTMLFormElement).disabled = false
  element.removeAttribute('data-ujs-disabled')
}
