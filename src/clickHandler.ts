import { addListeners, match, removeListeners } from "./utils/dom"
import { Misc } from './utils/misc'
import { EventQueryInterface } from './types'

export class ClickHandler {
  static get queries (): EventQueryInterface[] {
    return [
      {
        event: 'click',
        selectors: [
          window.mrujs.querySelectors.linkClickSelector.selector,
          window.mrujs.querySelectors.buttonClickSelector.selector,
          window.mrujs.querySelectors.formInputClickSelector.selector
        ]
      }
    ]
  }

  get name (): string {
    return ClickHandler.name
  }

  connect (): void {
    addListeners(ClickHandler.queries, Misc.preventInsignificantClick as EventListener)
  }

  disconnect (): void {
    removeListeners(ClickHandler.queries, Misc.preventInsignificantClick as EventListener)
  }

  observerCallback (nodeList: Node[]): void {
    ClickHandler.queries.forEach((obj) => {
      obj.selectors.forEach((selector) => {
        nodeList.forEach((node) => {
          if (match(node, { selector })) {
            node.addEventListener(obj.event, Misc.preventInsignificantClick as EventListener)
          }

          if (node instanceof Element) {
            node.querySelectorAll(selector).forEach((el) => el.addEventListener(obj.event, Misc.preventInsignificantClick as EventListener))
          }
        })
      })
    })
  }
}
