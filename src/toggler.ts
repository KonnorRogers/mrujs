import { match, linkDisableSelector, buttonDisableSelector, formEnableSelector, formSubmitSelector } from './utils/dom'

/**
 * Disables buttons / links / forms on submission start
 *   and reenables them when ajax:stopped or ajax:complete is fired.
 */
export class Toggler {
  connect (): void {

  }

  disconnect (): void {

  }

  // Unified function to enable an element (link, button and form)
  enableElement(trigger: Event | HTMLElement): void {
    let element = trigger as HTMLElement

    if (trigger instanceof Event) {
      // return if isXhrRedirect(e)
      element = trigger.target as HTMLElement
    }

    if (match(element, linkDisableSelector)) {
      this.enableLinkElement(element)
      return
    }

    if (match(element, linkDisableSelector)) {
      this.enableLinkElement(element)
      return
    }

    if (match(element, buttonDisableSelector) || match(element, formEnableSelector)) {
      this.enableFormElement(element)
      return
    }

    if (match(element, formSubmitSelector)) {
      this.enableFormElements(element)
    }
  }
}
