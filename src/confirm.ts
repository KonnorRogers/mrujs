import { dispatch, stopEverything } from './utils/events'
import { match } from './utils/dom'
import { EventQueryInterface } from './types'

export class Confirm {
  private readonly boundHandleConfirm = this.handleConfirm.bind(this)
  private readonly boundHandleAsyncConfirm = this.handleAsyncConfirm.bind(this)

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
        element.addEventListener(event, this.boundHandleAsyncConfirm as EventListener)
      })
    })
  }

  disconnect (): void {
    Confirm.queries.forEach(({ event, selectors }) => {
      const selector = selectors.join(', ')

      document.querySelectorAll(selector).forEach((element) => {
        element.removeEventListener(event, this.boundHandleConfirm)
        element.removeEventListener(event, this.boundHandleAsyncConfirm as EventListener)
      })
    })
  }

  observerCallback (nodeList: Node[]): void {
    Confirm.queries.forEach(({ event, selectors }) => {
      const selector = selectors.join(', ')

      nodeList.forEach((node) => {
        if (match(node, { selector })) {
          node.addEventListener(event, this.boundHandleConfirm)
          node.addEventListener(event, this.boundHandleAsyncConfirm as EventListener)
        }

        if (node instanceof Element) {
          node.querySelectorAll(selector).forEach((el) => {
            el.addEventListener(event, this.boundHandleConfirm)
            el.addEventListener(event, this.boundHandleAsyncConfirm as EventListener)
          })
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

  async handleAsyncConfirm (event: Event): Promise<void> {
    if (event.currentTarget == null) return // false

    const element = event.currentTarget as HTMLElement
    const message = element.dataset.ujsConfirm
    const eventType = event.type

    if (message == null) return

    stopEverything(event)

    let answer = false

    answer = await window.mrujs.asyncConfirm(message)

    if (answer) {
      dispatch.call(element, 'confirm:complete', { detail: { answer } })
      element.removeEventListener(eventType, this.boundHandleAsyncConfirm as EventListener)
      element.click()
      element.addEventListener(eventType, this.boundHandleAsyncConfirm as EventListener)
    }
  }
}
