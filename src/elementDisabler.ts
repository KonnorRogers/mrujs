import { EventQueryInterface, Submitter } from './types'
import { attachObserverCallback, addListeners, removeListeners, findFormElements, match } from './utils/dom'
import { stopEverything } from './utils/events'

export class ElementDisabler {
  readonly boundDisableElement = this.disableElement.bind(this)

  static get queries (): EventQueryInterface[] {
    const { linkClickSelector, buttonClickSelector } = window.mrujs.querySelectors

    return [
      { event: 'click', selectors: [buttonClickSelector.selector, linkClickSelector.selector] }
    ]
  }

  get name (): string {
    return ElementDisabler.name
  }

  connect (): void {
    addListeners(ElementDisabler.queries, [this.boundDisableElement])
  }

  disconnect (): void {
    removeListeners(ElementDisabler.queries, [this.boundDisableElement])
  }

  observerCallback (nodeList: Node[]): void {
    attachObserverCallback(ElementDisabler.queries, nodeList, [this.boundDisableElement])
  }

  /**
   * Unified function to disable an element (link, button and form)
   */
  disableElement (event: Event | HTMLFormElement | Submitter): void {
    let element

    if (event instanceof Event) {
      element = event.target as HTMLFormElement
    } else {
      element = event
    }

    if (match(element, window.mrujs.querySelectors.linkDisableSelector)) {
      this.disableLinkElement(element)
    } else if (match(element, window.mrujs.querySelectors.buttonDisableSelector) || match(element, window.mrujs.querySelectors.formDisableSelector)) {
      this.disableFormElement(element as HTMLFormElement)
    } else if (match(element, window.mrujs.querySelectors.formSubmitSelector)) {
      this.disableFormElements(element as HTMLFormElement)
    }
  }

  /**
   * Disables form elements:
   *   - Caches element value in 'ujs-enable-with' data store
   *   - Replaces element text with value of 'data-disable-with' attribute
   *   - Sets disabled property to true
   */
  disableFormElements (form: HTMLFormElement): void {
    findFormElements(form, window.mrujs.querySelectors.formDisableSelector.selector).forEach((el) => this.disableFormElement(el))
  }

  disableFormElement (element: HTMLFormElement): void {
    if (element.dataset.ujsDisabled != null) return

    const replacement = element.getAttribute('data-disable-with')

    if (replacement != null) {
      if (match(element, { selector: 'button' })) {
        element.dataset.ujsEnableWith = element.innerHTML
        element.innerHTML = replacement
      } else {
        element.dataset.ujsEnableWith = element.value
        element.value = replacement
      }
    }

    element.disabled = true
    element.dataset.ujsDisabled = 'true'
  }

  /**
   * Replace element's html with the 'data-disable-with' after storing original html
   *   and prevent clicking on it
   */
  disableLinkElement (element: HTMLElement): void {
    if (element.dataset.ujsDisabled != null) return

    const replacement = element.dataset.disableWith

    // Perhaps morph here instead??
    if (replacement != null) {
      element.dataset.ujsEnableWith = element.innerHTML
      element.innerHTML = replacement
    }

    element.addEventListener('click', stopEverything) // prevent further clicking
    element.dataset.ujsDisabled = 'true'
  }
}
