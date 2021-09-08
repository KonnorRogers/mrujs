import { addListeners, attachObserverCallback, removeListeners } from './utils/dom'
import { preventInsignificantClick } from './utils/misc'
import { EventQueryInterface, MrujsPluginInterface } from './types'

export function ClickHandler (): MrujsPluginInterface {
  return {
    name: 'ClickHandler',
    connect,
    disconnect,
    observerCallback,
    queries
  }
}

function connect (): void {
  addListeners(queries(), [preventInsignificantClick] as EventListener[])
}

function disconnect (): void {
  removeListeners(queries(), [preventInsignificantClick] as EventListener[])
}

function observerCallback (nodeList: Node[]): void {
  attachObserverCallback(queries(), nodeList, [preventInsignificantClick] as EventListener[])
}

function queries (): EventQueryInterface[] {
  const { querySelectors } = window.mrujs
  return [
    {
      event: 'click',
      selectors: [
        querySelectors.linkClickSelector.selector,
        querySelectors.buttonClickSelector.selector,
        querySelectors.formInputClickSelector.selector
      ]
    }
  ]
}
