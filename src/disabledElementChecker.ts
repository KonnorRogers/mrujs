import { MrujsPluginInterface, EventQueryInterface } from './types'
import { addListeners, removeListeners, attachObserverCallback } from './utils/dom'
import { stopEverything } from './utils/events'

export function DisabledElementChecker (): MrujsPluginInterface {
  return {
    name: 'DisabledElementChecker',
    connect,
    disconnect,
    observerCallback,
    queries
  }
}

function connect (): void {
  addListeners(queries(), [handleDisabledElement])
}

function disconnect (): void {
  removeListeners(queries(), [handleDisabledElement])
}

function observerCallback (nodeList: Node[]): void {
  attachObserverCallback(queries(), nodeList, [handleDisabledElement])
}

function queries (): EventQueryInterface[] {
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
