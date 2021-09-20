import { MrujsPluginInterface, EventQueryInterface, Submitter } from './types'
import { attachObserverCallback, addListeners, removeListeners, findFormElements, match } from './utils/dom'
import { stopEverything } from './utils/events'

export function ElementDisabler (): MrujsPluginInterface {
  return {
    name: 'ElementDisabler',
    connect,
    disconnect,
    observerCallback,
    queries
  }
}

function queries (): EventQueryInterface[] {
  const { formSubmitSelector, linkClickSelector, buttonClickSelector } = window.mrujs.querySelectors

  return [
    { event: 'click', selectors: [buttonClickSelector.selector, linkClickSelector.selector] },
    { event: 'ajax:send', selectors: [formSubmitSelector.selector] }
  ]
}

function connect (): void {
  addListeners(queries(), [disableElement])
}

function disconnect (): void {
  removeListeners(queries(), [disableElement])
}

function observerCallback (nodeList: Node[]): void {
  attachObserverCallback(queries(), nodeList, [disableElement])
}

/**
  * Unified function to disable an element (link, button and form)
  */
export function disableElement (event: Event | HTMLFormElement | Submitter): void {
  let element

  if (event instanceof Event) {
    element = event.target as HTMLFormElement
  } else {
    element = event
  }

  if (match(element, window.mrujs.querySelectors.linkDisableSelector)) {
    disableLinkElement(element)
  } else if (match(element, window.mrujs.querySelectors.buttonDisableSelector) || match(element, window.mrujs.querySelectors.formDisableSelector)) {
    disableFormElement(element as HTMLFormElement)
  } else if (match(element, window.mrujs.querySelectors.formSubmitSelector)) {
    disableFormElements(element as HTMLFormElement)
  }
}

/**
  * Disables form elements:
  *   - Caches element value in 'ujs-enable-with' data store
  *   - Replaces element text with value of 'data-disable-with' attribute
  *   - Sets disabled property to true
  */
function disableFormElements (form: HTMLFormElement): void {
  findFormElements(form, window.mrujs.querySelectors.formDisableSelector.selector).forEach((el) => disableFormElement(el))
}

function disableFormElement (element: HTMLFormElement): void {
  if (element.dataset.ujsDisabled != null) return

  const replacement = element.getAttribute('data-disable-with')

  if (replacement != null) {
    if (match(element, { selector: 'button' })) {
      element.dataset.ujsEnableWith = element.innerHTML
      element.innerHTML = replacement
    } else {
      element.dataset.ujsEnableWith = element.value
      element.value = replacement
    }
  }

  element.disabled = true
  element.dataset.ujsDisabled = 'true'
}

/**
  * Replace element's html with the 'data-disable-with' after storing original html
  *   and prevent clicking on it
  */
function disableLinkElement (element: HTMLElement): void {
  if (element.dataset.ujsDisabled != null) return

  const replacement = element.dataset.disableWith

  // Perhaps morph here instead??
  if (replacement != null) {
    element.dataset.ujsEnableWith = element.innerHTML
    element.innerHTML = replacement
  }

  element.addEventListener('click', stopEverything) // prevent further clicking
  element.dataset.ujsDisabled = 'true'
}
