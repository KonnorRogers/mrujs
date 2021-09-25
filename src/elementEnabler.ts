import { attachObserverCallback, match, addListeners, removeListeners, findFormElements } from './utils/dom'
import { stopEverything, AJAX_EVENTS } from './utils/events'
import { EventQueryInterface, MrujsPluginInterface } from './types'

export function ElementEnabler (): MrujsPluginInterface {
  return {
    name: 'ElementEnabler',
    connect,
    disconnect,
    observerCallback
  }
}

function queries (): EventQueryInterface[] {
  const { formSubmitSelector, buttonDisableSelector, linkDisableSelector, inputChangeSelector } = window.mrujs.querySelectors

  const selectors = [linkDisableSelector.selector, buttonDisableSelector.selector,
    formSubmitSelector.selector, inputChangeSelector.selector]
  return [
    { event: AJAX_EVENTS.ajaxComplete, selectors: selectors },
    { event: AJAX_EVENTS.ajaxStopped, selectors: selectors }
  ]
}

function connect (): void {
  addListeners(queries(), [enableElement])
}

function disconnect (): void {
  removeListeners(queries(), [enableElement])
}

function observerCallback (nodeList: Node[]): void {
  attachObserverCallback(queries(), nodeList, [enableElement])
}

// Unified function to enable an element (link, button and form)
export function enableElement (trigger: Event | HTMLElement): void {
  let element = trigger as HTMLElement

  if (trigger instanceof Event) element = trigger.target as HTMLElement

  const { querySelectors } = window.mrujs

  if (match(element, querySelectors.linkDisableSelector)) {
    enableLinkElement(element)
    return
  }

  if (match(element, querySelectors.buttonDisableSelector) || match(element, querySelectors.formEnableSelector)) {
    enableFormElement(element)
    return
  }

  if (match(element, querySelectors.formSubmitSelector)) {
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
  const elements = findFormElements(form, window.mrujs.querySelectors.formEnableSelector.selector) as HTMLElement[]

  elements.forEach(enableFormElement)
}

export function enableFormElement (element: HTMLElement): void {
  const originalText = element.dataset.ujsEnableWith

  if (originalText != null) {
    if (match(element, { selector: 'button' })) {
      element.innerHTML = originalText
    } else {
      (element as HTMLFormElement).value = originalText
    }
    element.removeAttribute('data-ujs-enable-with') // clean up cache
  }

  (element as HTMLFormElement).disabled = false
  element.removeAttribute('data-ujs-disabled')
}
