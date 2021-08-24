import { dispatch, stopEverything } from './utils/events'
import { addListeners, removeListeners, attachObserverCallback } from './utils/dom'
import { EventQueryInterface } from './types'

export class Confirm {
  private readonly boundHandleConfirm = this.handleConfirm.bind(this)
  private readonly boundHandleAsyncConfirm = this.handleAsyncConfirm.bind(this)

  /*
   * An array of queries to run on the document. Each object has an event, and then a queries array.
   */
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
      },
      {
        event: 'change',
        selectors: [
          querySelectors.inputChangeSelector.selector
        ]
      },
      {
        event: 'submit',
        selectors: [
          querySelectors.formSubmitSelector.selector
        ]
      }
    ]
  }

  get name (): string {
    return Confirm.name
  }

  connect (): void {
    addListeners(Confirm.queries, [this.boundHandleConfirm, this.boundHandleAsyncConfirm] as EventListener[])
  }

  disconnect (): void {
    removeListeners(Confirm.queries, [this.boundHandleConfirm, this.boundHandleAsyncConfirm] as EventListener[])
  }

  observerCallback (nodeList: Node[]): void {
    attachObserverCallback(Confirm.queries, nodeList, [this.boundHandleConfirm, this.boundHandleAsyncConfirm] as EventListener[])
  }

  handleConfirm (event: Event | CustomEvent): void {
    if (event.target == null) return // false

    const element = event.target as HTMLElement
    const message = element.dataset.confirm

    if (message == null) return

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
