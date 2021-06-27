import { dispatch, stopEverything } from './utils/events'
import { match } from './utils/dom'
import { EventQueryInterface } from './types'

export class Confirm {
  boundHandleConfirm!: EventListener

  /*
   * An array of queries to run on the document. Each object has an event, and then a queries array.
   */
  get queries (): EventQueryInterface[] {
    return [
      {
        event: 'click',
        selectors: [
          window.mrujs.querySelectors.linkClickSelector.selector,
          window.mrujs.querySelectors.buttonClickSelector.selector,
          window.mrujs.querySelectors.formInputClickSelector.selector
        ]
      },
      {
        event: 'change',
        selectors: [
          window.mrujs.querySelectors.inputChangeSelector.selector
        ]
      },
      {
        event: 'submit',
        selectors: [
          window.mrujs.querySelectors.formSubmitSelector.selector
        ]
      }
    ]
  }

  connect (): void {
    this.boundHandleConfirm = this.handleConfirm.bind(this)

    this.queries.forEach((obj) => {
      obj.selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          element.addEventListener(obj.event, this.boundHandleConfirm)
        })
      })
    })
  }

  disconnect (): void {
    this.queries.forEach((obj) => {
      obj.selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          element.removeEventListener(obj.event, this.boundHandleConfirm)
        })
      })
    })
  }

  observerCallback (nodeList: NodeList): void {
    this.queries.forEach((obj) => {
      obj.selectors.forEach((selector) => {
        nodeList.forEach((node) => {
          if (match(node, { selector })) {
            node.addEventListener(obj.event, this.boundHandleConfirm)
          }

          if (node instanceof Element) {
            node.querySelectorAll(selector).forEach((el) => el.addEventListener(obj.event, this.boundHandleConfirm))
          }
        })
      })
    })
  }

  handleConfirm (event: Event | CustomEvent): void {
    if (event.target == null) return // false

    const element = event.target as HTMLElement
    const message = element.dataset.confirm

    if (message == null) {
      return
    }

    let answer = false

    try {
      answer = window?.mrujs?.confirm(message)
    } catch (e) {
      console.warn('there was an error with mrujs.confirm')
    }

    if (answer) {
      dispatch.call(element, 'confirm:complete', { detail: { answer } })
      return
    }

    stopEverything(event)
  }
}
