import { EventQueryInterface } from './types'
import { match, addListeners, removeListeners } from './utils/dom'
import { stopEverything } from './utils/events'

export class DisabledElementChecker {
  static get queries (): EventQueryInterface[] {
    const { linkClickSelector, buttonClickSelector, inputChangeSelector, formSubmitSelector, formInputClickSelector } = window.mrujs.querySelectors

    return [
      { event: 'click', selectors: [buttonClickSelector.selector, linkClickSelector.selector, formInputClickSelector.selector] },
      { event: 'change', selectors: [inputChangeSelector.selector] },
      { event: 'submit', selectors: [formSubmitSelector.selector] }
    ]
  }

  get name (): string {
    return DisabledElementChecker.name
  }

  connect (): void {
    addListeners(DisabledElementChecker.queries, this.handleDisabledElement)
  }

  disconnect (): void {
    removeListeners(DisabledElementChecker.queries, this.handleDisabledElement)
  }

  observerCallback (nodeList: Node[]): void {
    DisabledElementChecker.queries.forEach(({ selectors, event }) => {
      const selector = selectors.join(', ')

      nodeList.forEach((node) => {
        if (match(node, { selector })) {
          node.addEventListener(event, this.handleDisabledElement)
        }

        if (node instanceof Element) {
          node.querySelectorAll(selector).forEach((el) => el.addEventListener(event, this.handleDisabledElement))
        }
      })
    })
  }

  handleDisabledElement (this: HTMLFormElement, event: Event): void {
    if (this.disabled === true) stopEverything(event)
  }
}
