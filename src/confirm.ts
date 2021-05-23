import { EVENT_DEFAULTS, dispatch, stopEverything } from './utils/events'
import { SELECTORS } from './utils/dom'
import { IQuery } from './types'

export class Confirm {
  __handleConfirm__!: Function

  /*
   * An array of queries to run on the document. Each object has an event, and then a queries array.
   */
  static get queries (): IQuery[] {
    return [
      {
        event: 'click',
        selectors: [
          SELECTORS.linkClickSelector.selector,
          SELECTORS.buttonClickSelector.selector,
          SELECTORS.formInputClickSelector.selector
        ]
      },
      {
        event: 'change',
        selectors: [
          SELECTORS.inputChangeSelector.selector
        ]
      },
      {
        event: 'submit',
        selectors: [
          SELECTORS.formSubmitSelector.selector
        ]
      }
    ]
  }

  connect (): void {
    this.__handleConfirm__ = this.handleConfirm.bind(this)

    Confirm.queries.forEach((obj) => {
      obj.selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          element.addEventListener(obj.event, this.__handleConfirm__ as EventListener)
        })
      })
    })
  }

  disconnect (): void {
    Confirm.queries.forEach((obj) => {
      obj.selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          element.removeEventListener(obj.event, this.__handleConfirm__ as EventListener)
        })
      })
    })
  }

  handleConfirm (event: CustomEvent): void {
    if (event.target == null) return // false

    const element = event.target as HTMLElement
    const message = element.dataset.confirm
    console.log('ELEMENT: ', element)
    console.log('MESSAGE: ', message)

    if (message == null) {
      return
    }

    let answer = false

    // dispatch.call(element, 'confirm', EVENT_DEFAULTS)

    console.log('CONFIRMING')
    try {
      answer = window?.mrujs?.confirm(message) as boolean
    } catch (e) {
      console.warn('there was an error with mrujs.confirm')
    }

    if (answer) {
      dispatch.call(element, 'confirm:complete', { detail: { ...EVENT_DEFAULTS, answer } })
      return
    }

    stopEverything(event)
  }
}
