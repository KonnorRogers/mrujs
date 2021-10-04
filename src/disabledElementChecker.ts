import { MrujsPluginInterface, EventQueryInterface } from '../types'
import { addListeners, removeListeners, attachObserverCallback } from './utils/dom'
import { stopEverything } from './utils/events'

export function DisabledElementChecker (): MrujsPluginInterface {
  const callbacks = [handleDisabledElement] as EventListener[]
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
    name: 'DisabledElementChecker',
    initialize,
    connect,
    disconnect,
    observerCallback,
    queries,
    callbacks
  }
}

function getQueries (): EventQueryInterface[] {
  const { linkClickSelector, buttonClickSelector, inputChangeSelector, formSubmitSelector, formInputClickSelector } = window.mrujs.querySelectors

  return [
    { event: 'click', selectors: [buttonClickSelector.selector, linkClickSelector.selector, formInputClickSelector.selector] },
    { event: 'change', selectors: [inputChangeSelector.selector] },
    { event: 'submit', selectors: [formSubmitSelector.selector] }
  ]
}

function handleDisabledElement (this: HTMLFormElement, event: Event): void {
  if (this.disabled === true) stopEverything(event)
}
