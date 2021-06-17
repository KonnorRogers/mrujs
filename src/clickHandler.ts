import { Utils } from './utils'
import { match, SELECTORS } from './utils/dom'
import { IQuery } from './types'

export class ClickHandler {
  static get queries (): IQuery[] {
    return [
      {
        event: 'click',
        selectors: [
          SELECTORS.linkClickSelector.selector,
          SELECTORS.buttonClickSelector.selector,
          SELECTORS.formInputClickSelector.selector
        ]
      }
    ]
  }

  connect (): void {
    ClickHandler.queries.forEach((obj) => {
      obj.selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          element.addEventListener(obj.event, Utils.preventInsignificantClick as EventListener)
        })
      })
    })
  }

  disconnect (): void {
    ClickHandler.queries.forEach((obj) => {
      obj.selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          element.removeEventListener(obj.event, Utils.preventInsignificantClick as EventListener)
        })
      })
    })
  }

  observerCallback (nodeList: NodeList): void {
    ClickHandler.queries.forEach((obj) => {
      obj.selectors.forEach((selector) => {
        nodeList.forEach((node) => {
          if (match(node, { selector })) {
            node.addEventListener(obj.event, Utils.preventInsignificantClick as EventListener)
          }

          if (node instanceof Element) {
            node.querySelectorAll(selector).forEach((el) => el.addEventListener(obj.event, Utils.preventInsignificantClick as EventListener))
          }
        })
      })
    })
  }
}
