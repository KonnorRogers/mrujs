import { Utils } from './utils'
import { SELECTORS } from './utils/dom'
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
}
