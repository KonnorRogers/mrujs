import { EventQueryInterface } from './types'
import { addListeners, removeListeners, attachObserverCallback } from './utils/dom'
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
    addListeners(DisabledElementChecker.queries, [this.handleDisabledElement])
  }

  disconnect (): void {
    removeListeners(DisabledElementChecker.queries, [this.handleDisabledElement])
  }

  observerCallback (nodeList: Node[]): void {
    attachObserverCallback(DisabledElementChecker.queries, nodeList, [this.handleDisabledElement])
  }

  handleDisabledElement (this: HTMLFormElement, event: Event): void {
    if (this.disabled === true) stopEverything(event)
  }
}
