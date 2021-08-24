import { addListeners, attachObserverCallback, removeListeners } from "./utils/dom"
import { preventInsignificantClick } from './utils/misc'
import { EventQueryInterface } from './types'

export class ClickHandler {
  static get queries (): EventQueryInterface[] {
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

  get name (): string {
    return ClickHandler.name
  }

  connect (): void {
    addListeners(ClickHandler.queries, [preventInsignificantClick] as EventListener[])
  }

  disconnect (): void {
    removeListeners(ClickHandler.queries, [preventInsignificantClick] as EventListener[])
  }

  observerCallback (nodeList: Node[]): void {
    attachObserverCallback(ClickHandler.queries, nodeList, [preventInsignificantClick] as EventListener[])
  }
}
