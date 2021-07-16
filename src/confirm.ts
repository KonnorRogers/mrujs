import { dispatch, stopEverything } from './utils/events'
import { match } from './utils/dom'
import { EventQueryInterface } from './types'

export class Confirm {
  private readonly boundHandleConfirm = this.handleConfirm.bind(this)

  /*
   * An array of queries to run on the document. Each object has an event, and then a queries array.
   */
  static get queries (): EventQueryInterface[] {
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

  get name (): string {
    return Confirm.name
  }

  connect (): void {
    Confirm.queries.forEach(({ event, selectors }) => {
      const selector = selectors.join(', ')

      document.querySelectorAll(selector).forEach((element) => {
        element.addEventListener(event, this.boundHandleConfirm)
      })
    })
  }

  disconnect (): void {
    Confirm.queries.forEach(({ event, selectors }) => {
      const selector = selectors.join(', ')

      document.querySelectorAll(selector).forEach((element) => {
        element.removeEventListener(event, this.boundHandleConfirm)
      })
    })
  }

  observerCallback (nodeList: Node[]): void {
    Confirm.queries.forEach(({ event, selectors }) => {
      const selector = selectors.join(', ')

      nodeList.forEach((node) => {
        if (match(node, { selector })) {
          node.addEventListener(event, this.boundHandleConfirm)
        }

        if (node instanceof Element) {
          node.querySelectorAll(selector).forEach((el) => el.addEventListener(event, this.boundHandleConfirm))
        }
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
