import { Misc } from './utils/misc'
import { match } from './utils/dom'
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
    ClickHandler.queries.forEach((obj) => {
      obj.selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          element.addEventListener(obj.event, Misc.preventInsignificantClick as EventListener)
        })
      })
    })
  }

  disconnect (): void {
    ClickHandler.queries.forEach((obj) => {
      obj.selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          element.removeEventListener(obj.event, Misc.preventInsignificantClick as EventListener)
        })
      })
    })
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
