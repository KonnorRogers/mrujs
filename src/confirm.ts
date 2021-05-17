import { EVENT_DEFAULTS, dispatch } from "./utils/events";
import { SELECTORS } from './utils/dom'

interface IQuery {
  event: "click" | "change" | "submit"
  selectors: string[]
}

export class Confirm {
  /**
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
    Confirm.queries.forEach((obj) => {
      obj.selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          element.addEventListener(obj.event, this.handleConfirm.bind(this) as EventListener)
        })
      })
    })
  }

  disconnect () {
    Confirm.queries.forEach((obj) => {
      obj.selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          element.removeEventListener(obj.event, this.handleConfirm.bind(this) as EventListener)
        })
      })
    })
  }

  handleConfirm (event: CustomEvent) {
    if (event.target == null) return

    const element = event.target as HTMLElement
    const message = element.getAttribute('data-confirm')

    if (!message) {
      return true
    }

    let answer = false

    dispatch.call(element, 'confirm', EVENT_DEFAULTS)

    try {
      answer = window?.mrujs?.confirm(message) as boolean
    } catch(e) {
      console.warn("there was an error with mrujs.confirm")
    }

    const callback = dispatch.call(element, 'confirm:complete', {detail: {...EVENT_DEFAULTS, answer}})

    return (answer && callback)
  }
}
