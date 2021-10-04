import { addListeners, attachObserverCallback, removeListeners } from './utils/dom'
import { preventInsignificantClick } from './utils/misc'
import { EventQueryInterface, MrujsPluginInterface } from '../types'

export function ClickHandler (): MrujsPluginInterface {
  const callbacks = [preventInsignificantClick] as EventListener[]
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
    name: 'ClickHandler',
    initialize,
    connect,
    disconnect,
    observerCallback,
    queries,
    callbacks
  }
}

function getQueries (): EventQueryInterface[] {
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
