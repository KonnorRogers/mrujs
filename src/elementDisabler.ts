import { MrujsPluginInterface, EventQueryInterface, Submitter } from '../types'
import { attachObserverCallback, addListeners, removeListeners, formElements, matches } from './utils/dom'
import { stopEverything } from './utils/events'

export function ElementDisabler (): MrujsPluginInterface {
  const callbacks = [disableElement] as EventListener[]
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
    name: 'ElementDisabler',
    initialize,
    connect,
    disconnect,
    observerCallback,
    queries
  }
}

function getQueries (): EventQueryInterface[] {
  const { formSubmitSelector, linkClickSelector, buttonClickSelector, inputChangeSelector } = window.mrujs

  return [
    { event: 'click', selectors: [buttonClickSelector, linkClickSelector] },
    { event: 'ajax:send', selectors: [formSubmitSelector] },
    { event: 'turbo:submit-start', selectors: ['form'] },
    { event: 'change', selectors: [inputChangeSelector] }
  ]
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

  const { linkDisableSelector, buttonDisableSelector, formDisableSelector, formSubmitSelector } = window.mrujs
  if (matches(element, linkDisableSelector)) {
    disableLinkElement(element)
  } else if (matches(element, buttonDisableSelector) || matches(element, formDisableSelector)) {
    disableFormElement(element as HTMLFormElement)
  } else if (matches(element, formSubmitSelector)) {
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
  formElements(form, window.mrujs.formDisableSelector).forEach((el) => disableFormElement(el))
}

function disableFormElement (element: HTMLFormElement): void {
  if (element.dataset.ujsDisabled != null) return

  const replacement = element.getAttribute('data-disable-with')

  if (replacement != null) {
    if (matches(element, 'button')) {
      element.dataset.ujsEnableWith = element.innerHTML
      element.innerHTML = replacement
    } else {
      element.dataset.ujsEnableWith = element.value
      element.value = replacement
    }
  }

  element.dataset.ujsDisabled = 'true'

  // Due to how FormSubmissions work in Chrome, if the button is disabled prior
  // to submitting the form, then form "submit" event will never trigger.
  setTimeout(() => { element.disabled = true })
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
