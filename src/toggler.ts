import { Submitter } from './types'
import { match, SELECTORS } from './utils/dom'
import { AJAX_EVENTS, stopEverything } from './utils/events'

interface ListeningConditions {
  event: string
  selector: string
}

/**
 * Disables buttons / links / forms on submission start
 *   and reenables them when ajax:stopped or ajax:complete is fired.
 */
export class Toggler {
  readonly enableElementConditions: ListeningConditions[] = [
    { event: AJAX_EVENTS.ajaxComplete, selector: SELECTORS.buttonDisableSelector.selector },
    { event: AJAX_EVENTS.ajaxStopped, selector: SELECTORS.buttonDisableSelector.selector },
    { event: AJAX_EVENTS.ajaxComplete, selector: SELECTORS.linkDisableSelector.selector },
    { event: AJAX_EVENTS.ajaxStopped, selector: SELECTORS.linkDisableSelector.selector }
  ]

  readonly disableElementConditions: ListeningConditions[] = [
    { event: 'click', selector: SELECTORS.linkClickSelector.selector },
    { event: 'click', selector: SELECTORS.buttonClickSelector.selector }
  ]

  readonly handleDisabledConditions: ListeningConditions[] = [
    { event: 'click', selector: SELECTORS.linkClickSelector.selector },
    { event: 'click', selector: SELECTORS.buttonClickSelector.selector },
    { event: 'change', selector: SELECTORS.inputChangeSelector.selector },
    { event: 'submit', selector: SELECTORS.formSubmitSelector.selector },
    { event: 'click', selector: SELECTORS.formInputClickSelector.selector }
  ]

  readonly boundEnableElement = this.enableElement.bind(this)
  readonly boundDisableElement = this.disableElement.bind(this)

  addEnableElementListeners (): void {
    this.addListeners(this.enableElementConditions, this.boundEnableElement)
  }

  removeEnableElementListeners (): void {
    this.removeListeners(this.enableElementConditions, this.boundEnableElement)
  }

  enableElementObserverCallback (nodeList: NodeList): void {
    this.enableElementConditions.forEach((condition) => {
      const { selector, event } = condition
      nodeList.forEach((node) => {
        if (match(node, { selector })) {
          node.addEventListener(event, this.boundEnableElement)
        }
      })
    })
  }

  addDisableElementListeners (): void {
    this.addListeners(this.disableElementConditions, this.boundDisableElement)
  }

  removeDisableElementListeners (): void {
    this.removeListeners(this.disableElementConditions, this.boundDisableElement)
  }

  disableElementObserverCallback (nodeList: NodeList): void {
    this.disableElementConditions.forEach((condition) => {
      const { selector, event } = condition
      nodeList.forEach((node) => {
        if (match(node, { selector })) {
          node.addEventListener(event, this.boundDisableElement)
        }
      })
    })
  }

  addHandleDisabledListeners (): void {
    this.addListeners(this.handleDisabledConditions, this.handleDisabledElement)
  }

  removeHandleDisabledListeners (): void {
    this.removeListeners(this.handleDisabledConditions, this.handleDisabledElement)
  }

  handleDisabledObserverCallback (nodeList: NodeList): void {
    this.handleDisabledConditions.forEach((condition) => {
      const { selector, event } = condition
      nodeList.forEach((node) => {
        if (match(node, { selector })) {
          node.addEventListener(event, this.handleDisabledElement)
        }
      })
    })
  }

  addListeners (conditions: ListeningConditions[], callback: EventListener): void {
    conditions.forEach((condition) => {
      const { selector, event } = condition
      document.querySelectorAll(selector).forEach((el: Element) => el.addEventListener(event, callback))
    })
  }

  removeListeners (conditions: ListeningConditions[], callback: EventListener): void {
    conditions.forEach((condition) => {
      const { selector, event } = condition
      document.querySelectorAll(selector).forEach((el: Element) => el.removeEventListener(event, callback))
    })
  }

  handleDisabledElement (this: HTMLFormElement, event: Event): void {
    if (this.disabled === true) stopEverything(event)
  }

  // Unified function to enable an element (link, button and form)
  enableElement (trigger: Event | HTMLElement): void {
    let element = trigger as HTMLElement

    if (trigger instanceof Event) {
      // return if isXhrRedirect(e)
      element = trigger.target as HTMLElement
    }

    if (match(element, SELECTORS.linkDisableSelector)) {
      this.enableLinkElement(element)
      return
    }

    if (match(element, SELECTORS.linkDisableSelector)) {
      this.enableLinkElement(element)
      return
    }

    if (match(element, SELECTORS.buttonDisableSelector) || match(element, SELECTORS.formEnableSelector)) {
      this.enableFormElement(element)
      return
    }

    if (match(element, SELECTORS.formSubmitSelector)) {
      this.enableFormElements(element as HTMLFormElement)
    }
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

    if (match(element, SELECTORS.linkDisableSelector)) {
      this.disableLinkElement(element)
    } else if (match(element, SELECTORS.buttonDisableSelector) || match(element, SELECTORS.formDisableSelector)) {
      this.disableFormElement(element as HTMLFormElement)
    } else if (match(element, SELECTORS.formSubmitSelector)) {
      this.disableFormElements(element as HTMLFormElement)
    }
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

  /**
   * Restore element to its original state which was disabled by 'disableLinkElement' above
   */
  enableLinkElement (element: HTMLElement): void {
    const originalText = element.dataset.ujsEnableWith
    if (originalText != null) {
      element.innerHTML = originalText // set to old enabled state
      element.dataset.ujsEnableWith = undefined // clean up cache
    }

    element.removeEventListener('click', stopEverything) // enable element
    element.dataset.ujsDisabled = undefined
  }

  // Disables form elements:
  //  - Caches element value in 'ujs-enable-with' data store
  //  - Replaces element text with value of 'data-disable-with' attribute
  //  - Sets disabled property to true
  disableFormElements (form: HTMLFormElement): void {
    findFormElements(form, SELECTORS.formDisableSelector.selector).forEach((el) => this.disableFormElement(el))
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
 * Re-enables disabled form elements:
 *  - Replaces element text with cached value from 'ujs-enable-with' data store (created in `disableFormElements`)
 *  - Sets disabled property to false
 */
  enableFormElements (form: HTMLFormElement): void {
    const elements = findFormElements(form, SELECTORS.formEnableSelector.selector) as HTMLElement[]

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
      element.dataset.ujsEnableWith = undefined // clean up cache
    }

    (element as HTMLFormElement).disabled = false
    element.dataset.ujsDisabled = undefined
  }
}

/**
 * Helper function that returns form elements that match the specified CSS selector
 *   If form is actually a "form" element this will return associated elements outside the from that have
 *   the html form attribute set
 */
function findFormElements (form: HTMLElement, selector: string): HTMLFormElement[] {
  if (match(form, { selector: 'form' })) {
    return Array.from((form as HTMLFormElement).elements).filter((el: Element) => match(el, { selector })) as HTMLFormElement[]
  }

  return Array.from(form.querySelectorAll(selector))
}
