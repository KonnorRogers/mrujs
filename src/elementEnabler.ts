import { match, addListeners, removeListeners, findFormElements } from './utils/dom'
import { stopEverything, AJAX_EVENTS } from './utils/events'
import { EventQueryInterface } from './types'

export class ElementEnabler {
  readonly boundEnableElement = this.enableElement.bind(this)

  static get queries (): EventQueryInterface[] {
    const { buttonDisableSelector, linkDisableSelector } = window.mrujs.querySelectors

    return [
      { event: AJAX_EVENTS.ajaxComplete, selectors: [linkDisableSelector.selector, buttonDisableSelector.selector] },
      { event: AJAX_EVENTS.ajaxStopped, selectors: [linkDisableSelector.selector, buttonDisableSelector.selector] }
    ]
  }

  get name (): string {
    return ElementEnabler.name
  }

  connect (): void {
    addListeners(ElementEnabler.queries, this.boundEnableElement)
  }

  disconnect (): void {
    removeListeners(ElementEnabler.queries, this.boundEnableElement)
  }

  observerCallback (nodeList: Node[]): void {
    ElementEnabler.queries.forEach(({ selectors, event }) => {
      const selector = selectors.join(', ')

      nodeList.forEach((node) => {
        if (match(node, { selector })) {
          node.addEventListener(event, this.boundEnableElement)
        }

        if (node instanceof Element) {
          node.querySelectorAll(selector).forEach((el) => el.addEventListener(event, this.boundEnableElement))
        }
      })
    })
  }

  // Unified function to enable an element (link, button and form)
  enableElement (trigger: Event | HTMLElement): void {
    let element = trigger as HTMLElement

    if (trigger instanceof Event) {
      element = trigger.target as HTMLElement
    }

    if (match(element, window.mrujs.querySelectors.linkDisableSelector)) {
      this.enableLinkElement(element)
      return
    }

    if (match(element, window.mrujs.querySelectors.linkDisableSelector)) {
      this.enableLinkElement(element)
      return
    }

    if (match(element, window.mrujs.querySelectors.buttonDisableSelector) || match(element, window.mrujs.querySelectors.formEnableSelector)) {
      this.enableFormElement(element)
      return
    }

    if (match(element, window.mrujs.querySelectors.formSubmitSelector)) {
      this.enableFormElements(element as HTMLFormElement)
    }
  }

  /**
   * Restore element to its original state which was disabled by 'disableLinkElement' above
   */
  enableLinkElement (element: HTMLElement): void {
    const originalText = element.dataset.ujsEnableWith

    if (originalText != null) {
      element.innerHTML = originalText // set to old enabled state
      element.removeAttribute('data-ujs-enable-with') // clean up cache
    }

    element.removeEventListener('click', stopEverything) // enable element
    element.removeAttribute('data-ujs-disabled')
  }

  /**
 * Re-enables disabled form elements:
 *  - Replaces element text with cached value from 'ujs-enable-with' data store (created in `disableFormElements`)
 *  - Sets disabled property to false
 */
  enableFormElements (form: HTMLFormElement): void {
    const elements = findFormElements(form, window.mrujs.querySelectors.formEnableSelector.selector) as HTMLElement[]

    elements.forEach((el: HTMLElement) => {
      this.enableFormElement(el)
    })
  }

  enableFormElement (element: HTMLElement): void {
    const originalText = element.dataset.ujsEnableWith

    if (originalText != null) {
      if (match(element, { selector: 'button' })) {
        element.innerHTML = originalText
      } else {
        (element as HTMLFormElement).value = originalText
      }
      element.removeAttribute('data-ujs-enable-with') // clean up cache
    }

    (element as HTMLFormElement).disabled = false
    element.removeAttribute('data-ujs-disabled')
  }
}
